import { Crown, Medal } from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { Card } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { EmptyState } from '../components/ui/empty-state';
import { useLeaderboard } from '../hooks/use-leaderboard';
import { useAuth } from '../hooks/use-auth';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

export function LeaderboardPage() {
  const { data, isLoading, isError } = useLeaderboard();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full rounded-3xl" />
        <Skeleton className="h-[60vh] w-full rounded-3xl" />
      </div>
    );
  }

  if (isError || !data) {
    return <EmptyState title="Leaderboard unavailable" description="Unable to load rankings from the backend." />;
  }

  const currentUser = data.find((entry) => entry.username === user?.username);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leaderboard"
        description="Track the top-ranked users and compare your rating against the field."
        actions={currentUser ? <div className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">Your rating: {currentUser.rating}</div> : null}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-[0.3em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">Rank</th>
                  <th className="px-5 py-4">Username</th>
                  <th className="px-5 py-4">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {data.map((entry, index) => {
                  const isCurrentUser = entry.username === user?.username;
                  const topRank = index < 3;
                  return (
                    <tr
                      key={entry._id}
                      className={isCurrentUser ? 'bg-cyan-500/10' : 'hover:bg-white/5'}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-slate-100">
                          {topRank ? <Crown className="h-4 w-4 text-amber-300" /> : null}
                          #{index + 1}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-100">{entry.username}</td>
                      <td className="px-5 py-4 text-slate-300">{entry.rating}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Top 3 spotlight</p>
            <div className="mt-4 space-y-3">
              {data.slice(0, 3).map((entry, index) => (
                <div key={entry._id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-300">
                    <Medal className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-100">#{index + 1} {entry.username}</p>
                    <p className="text-sm text-slate-400">{entry.rating} rating</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {user ? (
            <Card className="space-y-3 p-5">
              <p className="text-sm font-semibold text-slate-100">Signed-in user</p>
              <p className="text-sm text-slate-400">{user.username}</p>
              <p className="text-3xl font-semibold text-cyan-300">{user.rating ?? 0}</p>
              <Button variant="outline" onClick={() => navigate('/profile')}>
                View profile
              </Button>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
