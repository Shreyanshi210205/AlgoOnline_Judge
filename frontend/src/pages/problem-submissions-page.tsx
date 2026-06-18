import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../components/ui/page-header';
import { Card } from '../components/ui/card';
import { Select } from '../components/ui/select';
import { Skeleton } from '../components/ui/skeleton';
import { EmptyState } from '../components/ui/empty-state';
import { StatusPill } from '../components/status-pill';
import { useProblem } from '../hooks/use-problem';
import { useProblemSubmissions } from '../hooks/use-problem-submissions';
import { formatDateTime, formatExecutionTime } from '../utils/format';
import type { Language, Verdict } from '../types';

export function ProblemSubmissionsPage() {
  const { id = '' } = useParams();
  const { data: problem, isLoading: problemLoading } = useProblem(id);
  const { data: submissions, isLoading: submissionsLoading } = useProblemSubmissions(id, Boolean(id));
  const [languageFilter, setLanguageFilter] = useState<'all' | Language>('all');
  const [verdictFilter, setVerdictFilter] = useState<'all' | Verdict>('all');

  const filtered = useMemo(() => {
    const subs = submissions ?? [];

    return subs.filter((submission) => {
      const matchesLanguage = languageFilter === 'all' || submission.language === languageFilter;
      const matchesVerdict = verdictFilter === 'all' || submission.verdict === verdictFilter;
      return matchesLanguage && matchesVerdict;
    });
  }, [id, languageFilter, submissions, verdictFilter]);

  if (problemLoading || submissionsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full rounded-3xl" />
        <Skeleton className="h-[60vh] w-full rounded-3xl" />
      </div>
    );
  }

  if (!problem) {
    return <EmptyState title="Problem not found" description="The backend did not return a matching problem." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${problem.title} submissions`}
        description="This view lists submissions for the selected problem (all users)."
      />

      <Card className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
        <Select value={languageFilter} onChange={(event) => setLanguageFilter(event.target.value as 'all' | Language)}>
          <option value="all">All languages</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
        </Select>
        <Select value={verdictFilter} onChange={(event) => setVerdictFilter(event.target.value as 'all' | Verdict)}>
          <option value="all">All verdicts</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Wrong Answer">Wrong Answer</option>
          <option value="Compilation Error">Compilation Error</option>
          <option value="Runtime Error">Runtime Error</option>
          <option value="Time Limit Exceeded">Time Limit Exceeded</option>
          <option value="Memory Limit Exceeded">Memory Limit Exceeded</option>
        </Select>
        <div className="flex items-center rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-400 xl:col-span-1">
          Showing {filtered.length} submission{filtered.length === 1 ? '' : 's'} for this problem
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState title="No submissions yet" description="Submit code for this problem to see your history here." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-[0.3em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">Username</th>
                  <th className="px-5 py-4">Language</th>
                  <th className="px-5 py-4">Verdict</th>
                  <th className="px-5 py-4">Execution Time</th>
                  <th className="px-5 py-4">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filtered.map((submission) => (
                  <tr key={submission._id} className="hover:bg-white/5">
                    <td className="px-5 py-4 text-slate-100">{typeof submission.userId === 'string' ? 'User' : submission.userId?.username || 'User'}</td>
                    <td className="px-5 py-4 text-slate-300">{submission.language}</td>
                    <td className="px-5 py-4">
                      <StatusPill verdict={submission.verdict} />
                    </td>
                    <td className="px-5 py-4 text-slate-300">{formatExecutionTime(submission.executionTime)}</td>
                    <td className="px-5 py-4 text-slate-300">{formatDateTime(submission.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
