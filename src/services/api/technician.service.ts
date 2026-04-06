import axiosClient from './axios-client';
import { Issue } from '../../types';

export const technicianService = {
  getTasks: async () => {
    const response = await axiosClient.get<Issue[]>('/technician/tasks');
    return response.data;
  },

  getUnassignedTasks: async () => {
    const response = await axiosClient.get<Issue[]>('/technician/tasks/unassigned');
    return response.data;
  },

  getFinishedTasks: async () => {
    const response = await axiosClient.get<Issue[]>('/technician/tasks/finished');
    return response.data;
  },

  acceptTask: async (id: string) => {
    const response = await axiosClient.post(`/technician/tasks/${id}/accept`);
    return response.data;
  },

  startTask: async (id: string) => {
    const response = await axiosClient.post(`/technician/tasks/${id}/start`);
    return response.data;
  },

  completeTask: async (id: string) => {
    const response = await axiosClient.post(`/technician/tasks/${id}/complete`);
    return response.data;
  }
};
