import { useQuery } from '@tanstack/react-query';
import { getProblemById } from '../services/problem.service';
import { queryKeys } from './use-query-keys';

export function useProblem(id: string) {
  return useQuery({
    queryKey: queryKeys.problem(id),
    queryFn: () => getProblemById(id),
    enabled: Boolean(id),
  });
}
