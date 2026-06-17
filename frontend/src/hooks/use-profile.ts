import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../services/auth.service';
import { queryKeys } from './use-query-keys';

export function useProfile(enabled = true) {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: getProfile,
    enabled,
  });
}
