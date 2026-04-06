import { useMutation } from '@tanstack/react-query';
import { AuthRepository } from '../../repositories';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from 'sonner';
import { LoginRequest, SignupRequest } from '../../types/api';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginRequest) => AuthRepository.login(data),
    onSuccess: (data) => {
      setAuth(data.user, data.access_token, data.refresh_token);
      toast.success('Logged in successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: SignupRequest) => AuthRepository.signup(data),
    onSuccess: () => {
      toast.success('Account created successfully. Please verify your OTP.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Signup failed');
    }
  });
};

export const useLogout = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: () => AuthRepository.logout(),
    onSettled: () => {
      clearAuth();
      toast.success('Logged out successfully');
    }
  });
};
