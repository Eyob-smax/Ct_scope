export type UserRole =
  | 'federal_admin'
  | 'regional_admin'
  | 'zonal_admin'
  | 'woreda_admin'
  | 'technician'
  | 'employee'
  | 'citizen';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  region: string;
  zone: string;
  woreda: string;
  phone: string;
  status: 'active' | 'inactive';
  fullName?: string;
  isActive?: boolean;
  isVerified?: boolean;
  adminUnitId?: string | null;
  language?: string;
}
