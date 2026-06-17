import { useQuery } from '@tanstack/react-query';
import { getAllProblems } from '../services/problem.service';
import { queryKeys } from './use-query-keys';

export function useProblems() {
  return useQuery({
    queryKey: queryKeys.problems,
    queryFn: getAllProblems,
  });
}
