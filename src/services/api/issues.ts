import { Issue, User } from '../../types';
import { mockIssues } from '../mock';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getIssues = async (user?: User | null): Promise<Issue[]> => {
  console.log('GET /api/issues', user?.role);
  await delay(800);
  
  if (!user) return [];
  
  // RBAC Filtering
  if (user.role === 'federal_admin') {
    return [...mockIssues];
  }
  
  if (user.role === 'regional_admin') {
    return mockIssues.filter(issue => issue.region === user.region);
  }
  
  if (user.role === 'zonal_admin') {
    return mockIssues.filter(issue => issue.region === user.region && issue.zone === user.zone);
  }
  
  if (user.role === 'woreda_admin') {
    return mockIssues.filter(issue => 
      issue.region === user.region && 
      issue.zone === user.zone && 
      issue.woreda === user.woreda
    );
  }
  
  if (user.role === 'technician') {
    return mockIssues.filter(issue => issue.assignedTo === user.id);
  }
  
  return [];
};

export const getIssueById = async (id: string): Promise<Issue | undefined> => {
  console.log(`GET /api/issues/${id}`);
  await delay(500);
  return mockIssues.find((issue) => issue.id === id);
};

export const createIssue = async (data: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>): Promise<Issue> => {
  console.log('POST /api/issues', data);
  await delay(1000);
  const newIssue: Issue = {
    ...data,
    id: `ISS-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockIssues.push(newIssue);
  return newIssue;
};

export const updateIssue = async (id: string, data: Partial<Issue>): Promise<Issue> => {
  console.log(`PUT /api/issues/${id}`, data);
  await delay(800);
  const index = mockIssues.findIndex((issue) => issue.id === id);
  if (index === -1) throw new Error('Issue not found');
  
  const updatedIssue = {
    ...mockIssues[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  mockIssues[index] = updatedIssue;
  return updatedIssue;
};

export const deleteIssue = async (id: string): Promise<void> => {
  console.log(`DELETE /api/issues/${id}`);
  await delay(600);
  const index = mockIssues.findIndex((issue) => issue.id === id);
  if (index !== -1) {
    mockIssues.splice(index, 1);
  }
};

export const assignIssue = async (issueId: string, technicianId: string): Promise<Issue> => {
  console.log(`POST /api/issues/${issueId}/assign`, { technicianId });
  return updateIssue(issueId, { assignedTo: technicianId, status: 'assigned' });
};

export const changeIssueStatus = async (issueId: string, status: Issue['status']): Promise<Issue> => {
  console.log(`POST /api/issues/${issueId}/status`, { status });
  return updateIssue(issueId, { status });
};
