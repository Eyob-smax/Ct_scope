import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getIssues, getIssueById, createIssue } from './api';
import { Issue } from '../../types';
import { useAuthStore } from '../../hooks/useAuth';

export const useIssues = () => {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ['issues', user?.id],
    queryFn: () => getIssues(user),
  });
};

export const useIssue = (id: string) => {
  return useQuery({
    queryKey: ['issues', id],
    queryFn: () => getIssueById(id),
    enabled: !!id,
  });
};

export const useCreateIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
  });
};
