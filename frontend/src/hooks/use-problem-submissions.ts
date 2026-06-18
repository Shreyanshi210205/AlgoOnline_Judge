import { useQuery } from '@tanstack/react-query';
import { getProblemSubmissions } from '../services/submission.service';
import { queryKeys } from './use-query-keys';

export function useProblemSubmissions(problemId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.problemSubmissions(problemId),
    queryFn: () => getProblemSubmissions(problemId),
    enabled: enabled && Boolean(problemId),
  });
}
