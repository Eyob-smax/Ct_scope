import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['federal_admin', 'regional_admin', 'zonal_admin', 'woreda_admin', 'technician']),
  region: z.string().min(1, 'Region is required'),
  zone: z.string().optional(),
  woreda: z.string().optional(),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  status: z.enum(['active', 'inactive']),
});

export type UserFormData = z.infer<typeof userSchema>;
