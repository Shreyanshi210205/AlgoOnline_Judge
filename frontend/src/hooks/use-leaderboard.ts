import { useQuery } from '@tanstack/react-query';
import { getLeaderboard } from '../services/leaderboard.service';
import { queryKeys } from './use-query-keys';

export function useLeaderboard() {
  return useQuery({
    queryKey: queryKeys.leaderboard,
    queryFn: getLeaderboard,
  });
}
