import { apiClient } from '../api/client';
import type { Problem, ProblemListItem } from '../types';

export async function getAllProblems() {
  const { data } = await apiClient.get<{ data: ProblemListItem[] }>('/api/problems');
  return data.data;
}

export async function getProblemById(id: string) {
  const { data } = await apiClient.get<{ data: Problem }>(`/api/problems/${id}`);
  return data.data;
}
