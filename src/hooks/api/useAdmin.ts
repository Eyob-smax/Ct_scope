import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminRepository } from '../../repositories';
import { toast } from 'sonner';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => AdminRepository.getDashboard(),
  });
};

export const useScopedIssues = () => {
  return useQuery({
    queryKey: ['admin', 'scoped-issues'],
    queryFn: () => AdminRepository.getScopedIssues(),
  });
};

export const usePendingIssues = () => {
  return useQuery({
    queryKey: ['admin', 'pending-issues'],
    queryFn: () => AdminRepository.getPendingIssues(),
  });
};

export const useAssignIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ issueId, technicianId }: { issueId: string; technicianId: string }) => 
      AdminRepository.assignIssue(issueId, technicianId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'scoped-issues'] });
      toast.success('Issue assigned successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to assign issue');
    }
  });
};

export const useTechnicians = () => {
  return useQuery({
    queryKey: ['admin', 'technicians'],
    queryFn: () => AdminRepository.getTechnicians(),
  });
};
