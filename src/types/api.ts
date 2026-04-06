import { User } from './user';

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface SignupRequest {
  phone: string;
  full_name: string;
  password: string;
  admin_unit_id?: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface DashboardResponse {
  stats: {
    total_issues: number;
    pending_issues: number;
    resolved_issues: number;
    active_technicians: number;
  };
  recent_activity: any[];
  trends: any[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}
