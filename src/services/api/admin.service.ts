import axiosClient from './axios-client';
import { DashboardResponse } from '../../types/api';
import { Issue, User } from '../../types';

export const adminService = {
  getDashboard: async () => {
    const response = await axiosClient.get<DashboardResponse>('/admin/dashboard');
    return response.data;
  },

  getScopedIssues: async () => {
    const response = await axiosClient.get<Issue[]>('/admin/scoped-issues');
    return response.data;
  },

  getPendingIssues: async () => {
    const response = await axiosClient.get<Issue[]>('/admin/scoped-issues/pending');
    return response.data;
  },

  assignIssue: async (issueId: string, technicianId: string) => {
    const response = await axiosClient.post(`/admin/issues/${issueId}/assign`, { technician_id: technicianId });
    return response.data;
  },

  getTechnicians: async () => {
    const response = await axiosClient.get<User[]>('/admin/technicians');
    return response.data;
  }
};
