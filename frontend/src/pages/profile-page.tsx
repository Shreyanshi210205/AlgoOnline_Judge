import { useState } from 'react';
import { PageHeader } from '../components/ui/page-header';
import { Card } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { EmptyState } from '../components/ui/empty-state';
import { StatCard } from '../components/stat-card';
import { StatusPill } from '../components/status-pill';
import { useProfile } from '../hooks/use-profile';
import { formatDateTime, formatExecutionTime } from '../utils/format';
import { Button } from '../components/ui/button';
import type { ProblemSummary } from '../types';

export function ProfilePage() {
  const { data, isLoading, isError } = useProfile();
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const submissions = data?.submissions ?? [];
  const solvedProblems = data?.user.solvedProblems ?? [];
  const acceptedSubmissions = submissions.filter((submission) => submission.verdict === 'Accepted').length;
  const paginatedSubmissions = submissions.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(submissions.length / pageSize));

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full rounded-3xl" />
        <Skeleton className="h-[60vh] w-full rounded-3xl" />
      </div>
    );
  }

  if (isError || !data) {
    return <EmptyState title="Profile unavailable" description="Unable to load your profile from the backend." />;
  }

  const profileUser = data.user;

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Track rating, solved problems, and submission history in one place." />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 md:col-span-1">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">User card</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-50">{profileUser.username}</h2>
          <p className="mt-2 text-sm text-slate-400">{profileUser.email}</p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Rating</p>
            <p className="mt-2 text-3xl font-semibold text-cyan-300">{profileUser.rating ?? 0}</p>
          </div>
        </Card>

        <div className="grid gap-4 md:col-span-2 md:grid-cols-3">
          <StatCard label="Solved problems" value={solvedProblems.length} helper="Unique problems solved" />
          <StatCard label="Total submissions" value={submissions.length} helper="All judged attempts" />
          <StatCard label="Accepted submissions" value={acceptedSubmissions} helper="Clean passes only" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-100">Solved Problems</p>
              <p className="text-xs text-slate-400">Challenges already added to your streak</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {solvedProblems.length === 0 ? (
              <p className="text-sm text-slate-400">No solved problems yet.</p>
            ) : (
              solvedProblems.map((problem: ProblemSummary) => (
                <Card key={problem._id} className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-medium text-slate-100">{problem.title}</p>
                    <p className="text-sm text-slate-400">{problem.difficulty}</p>
                  </div>
                  <StatusPill difficulty={problem.difficulty} />
                </Card>
              ))
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-100">Submission History</p>
              <p className="text-xs text-slate-400">Paginated user attempts</p>
            </div>
            <p className="text-sm text-slate-400">
              Page {page} of {totalPages}
            </p>
          </div>
          <div className="mt-4 space-y-3">
            {paginatedSubmissions.length === 0 ? (
              <p className="text-sm text-slate-400">No submissions available.</p>
            ) : (
              paginatedSubmissions.map((submission) => {
                const problemTitle = typeof submission.problemId === 'string' ? submission.problemId : submission.problemId.title || 'Problem';
                const problemDifficulty = typeof submission.problemId === 'string' ? undefined : submission.problemId.difficulty;

                return (
                  <Card key={submission._id} className="space-y-3 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-100">{problemTitle}</p>
                        <p className="text-sm text-slate-400">{submission.language}</p>
                      </div>
                      <StatusPill verdict={submission.verdict} />
                    </div>
                    <div className="grid gap-3 text-sm text-slate-400 sm:grid-cols-3">
                      <p>Execution: {formatExecutionTime(submission.executionTime)}</p>
                      <p>Submitted: {formatDateTime(submission.createdAt)}</p>
                      {problemDifficulty ? <p>Difficulty: {problemDifficulty}</p> : null}
                    </div>
                  </Card>
                );
              })
            )}
          </div>
          {submissions.length > pageSize ? (
            <div className="mt-4 flex items-center justify-between gap-3">
              <Button variant="outline" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
                Previous
              </Button>
              <Button variant="outline" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages}>
                Next
              </Button>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
