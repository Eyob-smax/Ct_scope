import { z } from 'zod';
import { User } from './user';

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface SignupRequest {
  phone: string;
  full_name: string;
  password: string;
  email?: string;
  admin_unit_id?: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface DashboardResponse {
  totals: {
    total: number;
    reported: number;
    verified: number;
    assigned: number;
    in_progress: number;
    resolved: number;
  };
  by_category: Array<{ category: string; count: number }>;
  high_priority_count: number;
  avg_resolution_hours: number | null;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// Zod schema matching backend's camelCase auth payload. `user` is intentionally
// permissive (passthrough) — the server may add fields we don't model yet.
export const authResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    phone: z.string().optional(),
    email: z.string().nullable().optional(),
    full_name: z.string().optional(),
    role: z.string(),
    language: z.string().optional(),
    admin_unit_id: z.string().nullable().optional(),
    is_verified: z.boolean().optional(),
  }).passthrough(),
  accessToken: z.string(),
  refreshToken: z.string(),
}).passthrough();

export class ApiErrorClass extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: Record<string, unknown>;

  constructor(message: string, code: string, status: number, details?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiErrorClass';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}
