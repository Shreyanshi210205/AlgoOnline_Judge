import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSubmission } from '../services/submission.service';
import { queryKeys } from './use-query-keys';

export function useCreateSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSubmission,
    onSuccess: async (submission) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      await queryClient.invalidateQueries({ queryKey: ['submissions'] });
      return submission;
    },
  });
}
