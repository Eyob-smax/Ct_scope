import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IssuesRepository } from '../../repositories';
import { toast } from 'sonner';

export const useIssues = () => {
  return useQuery({
    queryKey: ['issues'],
    queryFn: () => IssuesRepository.getMyIssues(),
  });
};

export const useIssue = (id: string) => {
  return useQuery({
    queryKey: ['issues', id],
    queryFn: () => IssuesRepository.getIssueById(id),
    enabled: !!id,
  });
};

export const useCreateIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => IssuesRepository.createIssue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      toast.success('Issue reported successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to report issue');
    }
  });
};

export const useVoteIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (issueId: string) => IssuesRepository.voteIssue(issueId),
    onSuccess: (_, issueId) => {
      queryClient.invalidateQueries({ queryKey: ['issues', issueId] });
      toast.success('Vote cast successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to vote');
    }
  });
};
