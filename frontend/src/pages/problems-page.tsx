import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDebounce } from '../hooks/use-debounce';
import { useProblems } from '../hooks/use-problems';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { EmptyState } from '../components/ui/empty-state';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Skeleton } from '../components/ui/skeleton';
import { PageHeader } from '../components/ui/page-header';
import { StatusPill } from '../components/status-pill';
import { DIFFICULTY_ORDER } from '../constants';
import type { Difficulty } from '../types';

export function ProblemsPage() {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<'all' | Difficulty>('all');
  const debouncedSearch = useDebounce(search, 250);
  const { data: problems, isLoading, isError, refetch } = useProblems();

  const filteredProblems = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase();

    return (problems ?? []).filter((problem) => {
      const matchesSearch = !normalizedSearch || problem.title.toLowerCase().includes(normalizedSearch);
      const matchesDifficulty = difficulty === 'all' || problem.difficulty === difficulty;
      return matchesSearch && matchesDifficulty;
    });
  }, [debouncedSearch, difficulty, problems]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Problems"
        description="Browse the challenge set, filter by difficulty, and jump straight into the editor or submission history."
      />

      <Card className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-lg">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            className="pl-11"
            placeholder="Search by title"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={difficulty} onChange={(event) => setDifficulty(event.target.value as 'all' | Difficulty)} className="w-44">
            <option value="all">All difficulties</option>
            {DIFFICULTY_ORDER.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-3xl" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState title="Unable to load problems" description="Check the backend connection and try again." actionLabel="Retry" onAction={() => void refetch()} />
      ) : filteredProblems.length === 0 ? (
        <EmptyState title="No problems found" description="Try a different search term or difficulty filter." />
      ) : (
        <div className="space-y-4">
          {filteredProblems.map((problem) => (
            <Card key={problem._id} className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold text-slate-50">{problem.title}</h3>
                  <StatusPill difficulty={problem.difficulty} />
                </div>
                <p className="text-sm text-slate-400">Created {problem.createdAt ? new Date(problem.createdAt).toLocaleDateString() : '-'}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <Link to={`/problems/${problem._id}`}>Solve Problem</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link to={`/problems/${problem._id}/submissions`}>View Submissions</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
