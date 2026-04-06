export const APP_NAME = 'CitiScope Admin';
export const APP_DESCRIPTION = 'Government Civic Intelligence Dashboard';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://incident-report-backend-cyep.onrender.com/api';

export const ROUTES = {
  DASHBOARD: '/',
  ISSUES: '/issues',
  MAP: '/map',
  ANALYTICS: '/analytics',
  SENSORS: '/sensors',
  USERS: '/users',
  NOTIFICATIONS: '/notifications',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  AUDIT_LOGS: '/audit-logs',
};
