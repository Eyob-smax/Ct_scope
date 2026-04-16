import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../../config/constants';
import { useAuthStore } from '../../store/useAuthStore';
import { ApiErrorClass } from '../../types/api';

// Create axios instance
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach access token
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 and refresh token
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Helper to create typed API errors
const createApiError = (error: AxiosError, context?: Record<string, unknown>): ApiErrorClass => {
  const status = error.response?.status || 500;
  const data = (error.response?.data || {}) as Record<string, unknown>;

  // Backend conventions:
  // - { success: false, message: string }
  // - { success: false, error: string } (500s)
  // - { success: false, error: express-validator errors[] } (422)
  const messageFromValidatorArray = (() => {
    const maybe = data?.error;
    if (!Array.isArray(maybe) || maybe.length === 0) return null;

    const first = maybe[0] as Record<string, unknown>;
    const msg = first?.msg;
    if (typeof msg === 'string' && msg.trim()) return msg;
    return null;
  })();

  const message =
    (typeof data?.message === 'string' && data.message) ||
    messageFromValidatorArray ||
    (typeof data?.error === 'string' && data.error) ||
    error.message ||
    'An error occurred';

  const code = (typeof data?.code === 'string' && data.code) || `HTTP_${status}`;
  
  // Log errors for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error(`[API Error] ${code} - ${message}`, {
      status,
      url: error.config?.url,
      method: error.config?.method,
      context,
      responseData: data,
    });
  }
  
  return new ApiErrorClass(message, code, status, {
    raw: data,
    context,
  });
};

axiosClient.interceptors.response.use(
  (response) => {
    // Log successful requests in development
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[API Success] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(createApiError(err as AxiosError, { reason: 'Token refresh failed' })));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { refreshToken, setAccessToken, clearAuth } = useAuthStore.getState();

      if (!refreshToken) {
        clearAuth();
        return Promise.reject(createApiError(error, { reason: 'No refresh token available' }));
      }

      try {
        // Use a raw axios call to avoid interceptor recursion.
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data as any;

        if (!accessToken || !newRefreshToken) {
          throw new Error('Invalid refresh response: missing accessToken or refreshToken');
        }

        setAccessToken(accessToken);
        useAuthStore.getState().setRefreshToken(newRefreshToken);
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        processQueue(null, accessToken);
        return axiosClient(originalRequest);
      } catch (refreshError) {
        const apiError = createApiError(refreshError as AxiosError, { 
          reason: 'Token refresh failed during retry queue' 
        });
        processQueue(apiError, null);
        clearAuth();
        return Promise.reject(apiError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(createApiError(error, { 
      reason: `HTTP ${error.response?.status || 'unknown'}` 
    }));
  }
);

export default axiosClient;
