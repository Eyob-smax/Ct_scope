import axiosClient from './axios-client';
import { Issue } from '../../types';
import { parseApiResponse } from './response-parser';
import { mapBackendIssue } from './adapters';

export interface CreateIssueInput {
  title: string;
  description?: string;
  category: string;
  latitude: number;
  longitude: number;
  address?: string;
  source?: 'citizen' | 'iot_sensor' | 'admin';
}

const asIssue = (data: unknown): Issue => mapBackendIssue(data);
const asIssueList = (data: unknown): Issue[] =>
  Array.isArray(data) ? (data as unknown[]).map(mapBackendIssue) : [];

export const issuesService = {
  createIssue: async (data: CreateIssueInput, imageFile?: File): Promise<Issue> => {
    let response;
    if (imageFile) {
      const form = new FormData();
      form.append('title', data.title);
      if (data.description) form.append('description', data.description);
      form.append('category', data.category);
      form.append('latitude', String(data.latitude));
      form.append('longitude', String(data.longitude));
      if (data.address) form.append('address', data.address);
      form.append('source', data.source ?? 'citizen');
      form.append('image', imageFile);
      response = await axiosClient.post('/issues', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } else {
      response = await axiosClient.post('/issues', { source: 'citizen', ...data });
    }
    return asIssue(parseApiResponse(response.data, { context: 'issues.create' }));
  },

  getMyIssues: async (): Promise<Issue[]> => {
    const response = await axiosClient.get('/issues/my-issues');
    return asIssueList(parseApiResponse(response.data, { context: 'issues.myIssues' }));
  },

  searchIssues: async (params?: Record<string, string | number | undefined>): Promise<Issue[]> => {
    const qs = params
      ? '?' +
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== '')
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
          .join('&')
      : '';
    const response = await axiosClient.get(`/issues/search${qs}`);
    return asIssueList(parseApiResponse(response.data, { context: 'issues.search' }));
  },

  getIssueById: async (id: string): Promise<Issue> => {
    const response = await axiosClient.get(`/issues/${id}`);
    return asIssue(parseApiResponse(response.data, { context: 'issues.byId' }));
  },

  voteIssue: async (issueId: string): Promise<{ votes: number; message?: string }> => {
    const response = await axiosClient.post(`/issues/${issueId}/vote`, {});
    const data = parseApiResponse<Record<string, unknown>>(response.data, {
      context: 'issues.vote',
    });
    return {
      votes: typeof data.votes === 'number' ? data.votes : 0,
      message: typeof data.message === 'string' ? data.message : undefined,
    };
  },

  updateStatus: async (
    issueId: string,
    status: string,
    notes?: string,
  ): Promise<Issue> => {
    const response = await axiosClient.patch(`/issues/${issueId}/status`, { status, notes });
    return asIssue(parseApiResponse(response.data, { context: 'issues.updateStatus' }));
  },
};
