import axiosClient from './axios-client';
import { useAuthStore } from '../../store/useAuthStore';
import {
  LoginRequest,
  SignupRequest,
  VerifyOtpRequest,
  AuthResponse,
  authResponseSchema,
  ApiErrorClass,
} from '../../types/api';
import { parseApiResponse } from './response-parser';
import { mapBackendUser } from './adapters';

const toAuthResponse = (data: unknown, context: string): AuthResponse => {
  try {
    const parsed = authResponseSchema.parse(data);
    return {
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken,
      user: mapBackendUser(parsed.user),
    };
  } catch (error) {
    throw new ApiErrorClass(
      'Invalid authentication response from server',
      'INVALID_RESPONSE',
      500,
      { context, validationError: error }
    );
  }
};

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await axiosClient.post('/auth/login', data);
      const parsed = parseApiResponse(response.data, { context: 'auth.login' });
      return toAuthResponse(parsed, 'auth.login');
    } catch (error) {
      if (error instanceof ApiErrorClass) throw error;
      throw new ApiErrorClass('Login failed', 'LOGIN_ERROR', 500, { originalError: error });
    }
  },

  signup: async (data: SignupRequest) => {
    try {
      const response = await axiosClient.post('/auth/signup', data);
      return parseApiResponse(response.data, { context: 'auth.signup' });
    } catch (error) {
      if (error instanceof ApiErrorClass) throw error;
      throw new ApiErrorClass('Signup failed', 'SIGNUP_ERROR', 500, { originalError: error });
    }
  },

  signupAdmin: async (data: SignupRequest) => {
    try {
      const response = await axiosClient.post('/auth/signup-admin', data);
      return parseApiResponse(response.data, { context: 'auth.signupAdmin' });
    } catch (error) {
      if (error instanceof ApiErrorClass) throw error;
      throw new ApiErrorClass('Admin signup failed', 'SIGNUP_ADMIN_ERROR', 500, { originalError: error });
    }
  },

  signupEmployee: async (data: SignupRequest) => {
    try {
      const response = await axiosClient.post('/auth/signup-employee', data);
      return parseApiResponse(response.data, { context: 'auth.signupEmployee' });
    } catch (error) {
      if (error instanceof ApiErrorClass) throw error;
      throw new ApiErrorClass('Employee signup failed', 'SIGNUP_EMPLOYEE_ERROR', 500, { originalError: error });
    }
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<AuthResponse> => {
    try {
      const response = await axiosClient.post('/auth/verify-signup', {
        phone: data.phone,
        code: data.otp,
      });
      const parsed = parseApiResponse(response.data, { context: 'auth.verifyOtp' });
      return toAuthResponse(parsed, 'auth.verifyOtp');
    } catch (error) {
      if (error instanceof ApiErrorClass) throw error;
      throw new ApiErrorClass('OTP verification failed', 'VERIFY_OTP_ERROR', 500, { originalError: error });
    }
  },

  // Backend does not expose /auth/resend-signup-otp. We surface a typed error so
  // callers can present "resend unavailable" in the UI without a network round-trip.
  resendSignupOtp: async (_phone: string): Promise<never> => {
    throw new ApiErrorClass(
      'Resending the signup OTP is not supported by the server. Please start signup again.',
      'NOT_SUPPORTED',
      501,
    );
  },

  logout: async () => {
    try {
      const refreshToken = useAuthStore.getState().refreshToken;
      const response = await axiosClient.post('/auth/logout', {
        refreshToken: refreshToken || undefined,
      });
      return parseApiResponse(response.data, { context: 'auth.logout' });
    } catch (error) {
      if (error instanceof ApiErrorClass) throw error;
      throw new ApiErrorClass('Logout failed', 'LOGOUT_ERROR', 500, { originalError: error });
    }
  },

  refreshToken: async (token: string): Promise<AuthResponse> => {
    try {
      const response = await axiosClient.post('/auth/refresh', { refreshToken: token });
      const parsed = parseApiResponse(response.data, { context: 'auth.refreshToken' });
      // /auth/refresh does not return a user object; synthesize one from the store.
      const currentUser = useAuthStore.getState().user;
      const payload = (parsed && typeof parsed === 'object' ? parsed : {}) as Record<string, unknown>;
      if (typeof payload.accessToken !== 'string' || typeof payload.refreshToken !== 'string') {
        throw new ApiErrorClass('Refresh response missing tokens', 'INVALID_RESPONSE', 500);
      }
      return {
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        user: currentUser as AuthResponse['user'],
      };
    } catch (error) {
      if (error instanceof ApiErrorClass) throw error;
      throw new ApiErrorClass('Token refresh failed', 'REFRESH_TOKEN_ERROR', 500, { originalError: error });
    }
  },

  forgotPassword: async (phone: string) => {
    try {
      const response = await axiosClient.post('/auth/forgot-password', { phone });
      return parseApiResponse(response.data, { context: 'auth.forgotPassword' });
    } catch (error) {
      if (error instanceof ApiErrorClass) throw error;
      throw new ApiErrorClass('Failed to send password reset OTP', 'FORGOT_PASSWORD_ERROR', 500, { originalError: error });
    }
  },

  resetPassword: async (data: { phone: string; otp: string; password: string }) => {
    try {
      const response = await axiosClient.post('/auth/reset-password', {
        phone: data.phone,
        code: data.otp,
        new_password: data.password,
      });
      return parseApiResponse(response.data, { context: 'auth.resetPassword' });
    } catch (error) {
      if (error instanceof ApiErrorClass) throw error;
      throw new ApiErrorClass('Password reset failed', 'RESET_PASSWORD_ERROR', 500, { originalError: error });
    }
  },

  changePassword: async (data: { oldPassword: string; newPassword: string }) => {
    try {
      const response = await axiosClient.post('/auth/change-password', {
        current_password: data.oldPassword,
        new_password: data.newPassword,
      });
      return parseApiResponse(response.data, { context: 'auth.changePassword' });
    } catch (error) {
      if (error instanceof ApiErrorClass) throw error;
      throw new ApiErrorClass('Password change failed', 'CHANGE_PASSWORD_ERROR', 500, { originalError: error });
    }
  },
};
