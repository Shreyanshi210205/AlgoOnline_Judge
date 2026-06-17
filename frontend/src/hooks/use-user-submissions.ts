import { useQuery } from '@tanstack/react-query';
import { getUserSubmissions } from '../services/submission.service';
import { queryKeys } from './use-query-keys';

export function useUserSubmissions(userId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: userId ? queryKeys.userSubmissions(userId) : ['users', 'anonymous', 'submissions'],
    queryFn: () => getUserSubmissions(userId as string),
    enabled: enabled && Boolean(userId),
  });
}
