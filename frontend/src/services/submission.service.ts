import { apiClient } from '../api/client';
import type { RunResponse, Submission, SubmissionCreatePayload } from '../types';

export async function createSubmission(payload: SubmissionCreatePayload) {
  const { data } = await apiClient.post<{ data: Submission }>('/api/submissions', payload);
  return data.data;
}

export async function getSubmissionById(id: string) {
  const { data } = await apiClient.get<{ data: Submission }>(`/api/submissions/${id}`);
  return data.data;
}

export async function getUserSubmissions(userId: string) {
  const { data } = await apiClient.get<{ data: Submission[]; count?: number }>(`/api/submissions/user/${userId}`);
  return data.data;
}

export async function runCode(payload: {
  problemId: string;
  code: string;
  language: string;
  customInput?: string;
}) {
  const { data } = await apiClient.post<{ results: RunResponse['results'] }>('/api/submissions/run', payload);
  return data.results;
}
