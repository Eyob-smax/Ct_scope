import { Issue, User } from '../../types';
import * as mockIssuesApi from '../../services/api/issues';
import { issuesService, CreateIssueInput } from '../../services/api/issues.service';

// Real backend wired for the endpoints it supports: create, get-by-id.
// List/filter still uses the role-based mock (backend's /issues/my-issues is
// reporter-scoped only; the UI wants multi-tier RBAC lists that the backend
// doesn't expose).
const USE_MOCK_FOR_LIST = true;

export const getIssues = async (user?: User | null): Promise<Issue[]> => {
  if (USE_MOCK_FOR_LIST) {
    return mockIssuesApi.getIssues(user);
  }
  return issuesService.getMyIssues();
};

export const getIssueById = async (id: string): Promise<Issue | undefined> => {
  try {
    return await issuesService.getIssueById(id);
  } catch {
    return undefined;
  }
};

export const createIssue = async (
  input: CreateIssueInput & { imageFile?: File },
): Promise<Issue> => {
  const { imageFile, ...rest } = input;
  return issuesService.createIssue(rest, imageFile);
};
