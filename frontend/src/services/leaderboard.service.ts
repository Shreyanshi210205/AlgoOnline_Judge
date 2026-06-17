import { apiClient } from '../api/client';
import type { LeaderboardEntry } from '../types';

export async function getLeaderboard() {
  const { data } = await apiClient.get<{ users: LeaderboardEntry[] }>('/api/leaderboard');
  return data.users;
}
