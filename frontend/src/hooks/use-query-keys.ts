export const queryKeys = {
  auth: ['auth'] as const,
  problems: ['problems'] as const,
  problem: (id: string) => ['problems', id] as const,
  leaderboard: ['leaderboard'] as const,
  profile: ['profile'] as const,
  submission: (id: string) => ['submissions', id] as const,
  userSubmissions: (userId: string) => ['users', userId, 'submissions'] as const,
};
