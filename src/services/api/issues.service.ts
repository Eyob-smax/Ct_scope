import axiosClient from './axios-client';
import { Issue } from '../../types';

export const issuesService = {
  createIssue: async (data: any) => {
    const response = await axiosClient.post<Issue>('/issues', data);
    return response.data;
  },

  getMyIssues: async () => {
    const response = await axiosClient.get<Issue[]>('/issues/my-issues');
    return response.data;
  },

  searchIssues: async (query: string) => {
    const response = await axiosClient.get<Issue[]>(`/issues/search?q=${query}`);
    return response.data;
  },

  getIssueById: async (id: string) => {
    const response = await axiosClient.get<Issue>(`/issues/${id}`);
    return response.data;
  },

  voteIssue: async (issueId: string) => {
    const response = await axiosClient.post(`/issues/${issueId}/vote`);
    return response.data;
  }
};
