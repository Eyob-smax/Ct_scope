import axiosClient from './axios-client';
import { 
  LoginRequest, 
  SignupRequest, 
  VerifyOtpRequest, 
  AuthResponse,
  ApiResponse
} from '../../types/api';

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await axiosClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  signup: async (data: SignupRequest) => {
    const response = await axiosClient.post<AuthResponse>('/auth/signup', data);
    return response.data;
  },

  signupAdmin: async (data: SignupRequest) => {
    const response = await axiosClient.post<AuthResponse>('/auth/signup-admin', data);
    return response.data;
  },

  signupEmployee: async (data: SignupRequest) => {
    const response = await axiosClient.post<AuthResponse>('/auth/signup-employee', data);
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpRequest) => {
    const response = await axiosClient.post<ApiResponse<any>>('/auth/verify-otp', data);
    return response.data;
  },

  logout: async () => {
    const response = await axiosClient.post('/auth/logout');
    return response.data;
  },

  refreshToken: async (token: string) => {
    const response = await axiosClient.post<AuthResponse>('/auth/refresh', { refresh_token: token });
    return response.data;
  },

  forgotPassword: async (phone: string) => {
    const response = await axiosClient.post('/auth/forgot-password', { phone });
    return response.data;
  },

  resetPassword: async (data: any) => {
    const response = await axiosClient.post('/auth/reset-password', data);
    return response.data;
  },

  changePassword: async (data: any) => {
    const response = await axiosClient.post('/auth/change-password', data);
    return response.data;
  }
};
