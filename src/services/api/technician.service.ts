import axiosClient from './axios-client';
import { Issue } from '../../types';
import { parseApiResponse } from './response-parser';
import { mapBackendIssue } from './adapters';

// Technician task rows come back as assignment records with a flattened issue.
// We normalize each row into the frontend Issue shape so the UI doesn't need a
// second type. The assignment id is kept in `id`; the underlying issue id moves
// into reportedBy-adjacent fields only when we have them.
const mapTaskRow = (raw: unknown): Issue => {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  // Reshape so the existing mapBackendIssue can consume it.
  const issueShaped = {
    id: r.issue_id ?? r.id,
    issue_number: r.issue_number,
    title: r.title,
    description: r.description,
    category: r.category,
    status: r.status,
    priority: r.issue_priority ?? r.priority,
    severity: r.severity,
    latitude: r.latitude,
    longitude: r.longitude,
    address: r.address,
    reported_at: r.created_at,
    updated_at: r.updated_at ?? r.created_at,
  };
  const issue = mapBackendIssue(issueShaped);
  // Preserve the assignment id so mutations (/accept, /start, /complete) target the right row.
  issue.id = typeof r.id === 'string' ? r.id : issue.id;
  return issue;
};

const toList = (parsed: unknown): Issue[] =>
  Array.isArray(parsed) ? (parsed as unknown[]).map(mapTaskRow) : [];

export const technicianService = {
  getTasks: async (): Promise<Issue[]> => {
    const response = await axiosClient.get('/api/technician/tasks');
    return toList(parseApiResponse(response.data, { context: 'technician.tasks' }));
  },

  getUnfinishedTasks: async (): Promise<Issue[]> => {
    const response = await axiosClient.get('/api/technician/tasks/unfinished');
    return toList(parseApiResponse(response.data, { context: 'technician.unfinishedTasks' }));
  },

  getFinishedTasks: async (): Promise<Issue[]> => {
    const response = await axiosClient.get('/api/technician/tasks/finished');
    return toList(parseApiResponse(response.data, { context: 'technician.finishedTasks' }));
  },

  acceptTask: async (id: string) => {
    const response = await axiosClient.post(`/api/technician/tasks/${id}/accept`, {});
    return parseApiResponse(response.data, { context: 'technician.accept' });
  },

  startTask: async (id: string) => {
    const response = await axiosClient.post(`/api/technician/tasks/${id}/start`, {});
    return parseApiResponse(response.data, { context: 'technician.start' });
  },

  completeTask: async (id: string) => {
    const response = await axiosClient.post(`/api/technician/tasks/${id}/complete`, {});
    return parseApiResponse(response.data, { context: 'technician.complete' });
  },
};
