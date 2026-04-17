import axiosClient from './axios-client';
import { DashboardResponse } from '../../types/api';
import { Issue, User } from '../../types';
import { parseApiResponse } from './response-parser';
import { mapBackendDashboard, mapBackendIssue, mapBackendUser } from './adapters';

const buildQS = (params?: Record<string, string | number | undefined>) => {
  if (!params) return '';
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== '');
  if (entries.length === 0) return '';
  return '?' + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&');
};

export const adminService = {
  getDashboard: async (): Promise<DashboardResponse> => {
    const response = await axiosClient.get('/api/admin/dashboard');
    return mapBackendDashboard(parseApiResponse(response.data, { context: 'admin.dashboard' }));
  },

  getScopedIssues: async (params?: Record<string, string | number | undefined>): Promise<Issue[]> => {
    const response = await axiosClient.get(`/api/admin/issues${buildQS(params)}`);
    const parsed = parseApiResponse<unknown>(response.data, { context: 'admin.issues' });
    // Backend envelope for this endpoint is `{ success, issues, total, page, limit }`
    // parseApiResponse with success:true + no `data` will return the remainder, so look at `issues`.
    const list =
      Array.isArray(parsed) ? parsed :
      parsed && typeof parsed === 'object' && Array.isArray((parsed as any).issues)
        ? (parsed as any).issues
        : [];
    return (list as unknown[]).map(mapBackendIssue);
  },

  getPendingIssues: async (): Promise<Issue[]> => {
    const response = await axiosClient.get('/api/admin/issues/pending');
    const parsed = parseApiResponse<unknown>(response.data, { context: 'admin.pendingIssues' });
    const list = Array.isArray(parsed) ? parsed : [];
    return (list as unknown[]).map(mapBackendIssue);
  },

  assignIssue: async (issueId: string, technicianId: string): Promise<Issue> => {
    const response = await axiosClient.post(`/api/admin/issues/${issueId}/assign`, { technicianId });
    return mapBackendIssue(parseApiResponse(response.data, { context: 'admin.assignIssue' }));
  },

  getTechnicians: async (): Promise<User[]> => {
    const response = await axiosClient.get('/api/admin/technicians');
    const parsed = parseApiResponse<unknown>(response.data, { context: 'admin.technicians' });
    const list = Array.isArray(parsed) ? parsed : [];
    return (list as unknown[]).map(mapBackendUser);
  },
};
