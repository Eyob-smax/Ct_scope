import { UserRole } from '../types';

export type Permission = 'view_all' | 'view_region' | 'view_zone' | 'view_woreda' | 'view_assigned' | 'manage_users' | 'manage_settings' | 'view_analytics' | 'view_iot';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  federal_admin: [
    'view_all',
    'manage_users',
    'manage_settings',
    'view_analytics',
    'view_iot'
  ],
  regional_admin: [
    'view_region',
    'manage_users',
    'view_analytics',
    'view_iot'
  ],
  zonal_admin: [
    'view_zone',
    'view_analytics',
    'view_iot'
  ],
  woreda_admin: [
    'view_woreda',
    'view_analytics',
    'view_iot'
  ],
  technician: [
    'view_assigned',
    'view_iot'
  ]
};

export const hasPermission = (userRole: UserRole | null, permission: Permission): boolean => {
  if (!userRole) return false;
  return ROLE_PERMISSIONS[userRole].includes(permission) || ROLE_PERMISSIONS[userRole].includes('view_all');
};

export const canAccessRoute = (userRole: UserRole | null, path: string): boolean => {
  if (!userRole) return false;
  if (userRole === 'federal_admin') return true;

  const restrictedRoutes: Record<string, UserRole[]> = {
    '/users': ['federal_admin', 'regional_admin'],
    '/settings': ['federal_admin'],
    '/analytics': ['federal_admin', 'regional_admin', 'zonal_admin', 'woreda_admin'],
  };

  const allowedRoles = restrictedRoutes[path];
  if (!allowedRoles) return true; // Default allowed

  return allowedRoles.includes(userRole);
};
