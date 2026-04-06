import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TechnicianRepository } from '../../repositories';
import { toast } from 'sonner';

export const useTechnicianTasks = () => {
  return useQuery({
    queryKey: ['technician', 'tasks'],
    queryFn: () => TechnicianRepository.getTasks(),
  });
};

export const useUnassignedTasks = () => {
  return useQuery({
    queryKey: ['technician', 'tasks', 'unassigned'],
    queryFn: () => TechnicianRepository.getUnassignedTasks(),
  });
};

export const useAcceptTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TechnicianRepository.acceptTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technician', 'tasks'] });
      toast.success('Task accepted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to accept task');
    }
  });
};

export const useStartTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TechnicianRepository.startTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technician', 'tasks'] });
      toast.success('Task started successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to start task');
    }
  });
};

export const useCompleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TechnicianRepository.completeTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technician', 'tasks'] });
      toast.success('Task completed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to complete task');
    }
  });
};
