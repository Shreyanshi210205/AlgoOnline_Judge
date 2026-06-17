import { useMutation } from '@tanstack/react-query';
import { runCode } from '../services/submission.service';

export function useRunCode() {
  return useMutation({ mutationFn: runCode });
}
