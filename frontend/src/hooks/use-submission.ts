import { useQuery } from '@tanstack/react-query';
import { getSubmissionById } from '../services/submission.service';
import { SUBMISSION_POLL_INTERVAL_MS } from '../constants';
import { queryKeys } from './use-query-keys';

export function useSubmission(id: string) {
  return useQuery({
    queryKey: queryKeys.submission(id),
    queryFn: () => getSubmissionById(id),
    enabled: Boolean(id),
    refetchInterval: (query) => (query.state.data?.verdict === 'Pending' ? SUBMISSION_POLL_INTERVAL_MS : false),
  });
}
