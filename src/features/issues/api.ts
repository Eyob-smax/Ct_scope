import { Issue, User } from '../../types';
import * as issuesApi from '../../services/api/issues';

const USE_MOCK = true;

export const getIssues = async (user?: User | null): Promise<Issue[]> => {
  if (USE_MOCK) {
    return issuesApi.getIssues(user);
  }
  // return apiClient.get<Issue[]>('/issues');
  return [];
};

export const getIssueById = async (id: string): Promise<Issue | undefined> => {
  if (USE_MOCK) {
    return issuesApi.getIssueById(id);
  }
  // return apiClient.get<Issue>(`/issues/${id}`);
  return undefined;
};

export const createIssue = async (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>): Promise<Issue> => {
  if (USE_MOCK) {
    return issuesApi.createIssue(issue);
  }
  // return apiClient.post<Issue>('/issues', issue);
  return {} as Issue;
};
