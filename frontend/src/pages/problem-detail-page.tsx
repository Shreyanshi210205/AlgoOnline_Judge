import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Select } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { LanguageEditor } from '../components/language-editor';
import { SplitPane } from '../components/split-pane';
import { EmptyState } from '../components/ui/empty-state';
import { PageHeader } from '../components/ui/page-header';
import { Skeleton } from '../components/ui/skeleton';
import { StatusPill } from '../components/status-pill';
import { useAuth } from '../hooks/use-auth';
import { useCreateSubmission } from '../hooks/use-create-submission';
import { useProblem } from '../hooks/use-problem';
import { useRunCode } from '../hooks/use-run-code';
import { useSubmission } from '../hooks/use-submission';
import { getBoilerplate } from '../utils/boilerplates';
import { formatExecutionTime, formatDateTime } from '../utils/format';
import type { Language } from '../types';
import { LANGUAGE_OPTIONS } from '../constants';

const tabs = ['Visible Test Cases', 'Custom Input'] as const;

export function ProblemDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: problem, isLoading, isError } = useProblem(id);
  const runMutation = useRunCode();
  const submitMutation = useCreateSubmission();
  const [language, setLanguage] = useState<Language>('cpp');
  const [code, setCode] = useState(getBoilerplate('cpp'));
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Visible Test Cases');
  const [customInput, setCustomInput] = useState('');
  const [lastRunResults, setLastRunResults] = useState<Array<{ input: string; expectedOutput: string; actualOutput: string; passed: boolean }> | null>(null);
  const [submissionId, setSubmissionId] = useState('');

  const submissionQuery = useSubmission(submissionId);

  useEffect(() => {
    if (submissionQuery.data?.verdict && submissionQuery.data.verdict !== 'Pending') {
      toast.success(`Submission ${submissionQuery.data.verdict.toLowerCase()}`);
    }
  }, [submissionQuery.data?.verdict]);

  const userId = user?._id || user?.id || '';

  const handleRun = async () => {
    if (!problem) {
      return;
    }

    try {
      const results = await runMutation.mutateAsync({
        problemId: problem._id,
        code,
        language,
        customInput,
      });
      setLastRunResults(results);
      toast.success('Code executed');
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Unable to run code');
    }
  };

  const handleSubmit = async () => {
    if (!problem || !userId) {
      toast.error('You must be signed in to submit code');
      return;
    }

    try {
      const submission = await submitMutation.mutateAsync({
        userId,
        problemId: problem._id,
        language,
        code,
      });
      setSubmissionId(submission._id);
      toast.success('Submitting...');
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Unable to submit code');
    }
  };

  const submissionStatus = submissionQuery.data;

  const visibleTestCases = useMemo(() => problem?.visibleTestCases ?? [], [problem]);

  if (isLoading) {
    return <Skeleton className="h-[80vh] w-full rounded-[2rem]" />;
  }

  if (isError || !problem) {
    return <EmptyState title="Problem unavailable" description="Unable to load this problem from the backend." actionLabel="Back to problems" onAction={() => navigate('/problems')} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={problem.title}
        description="Solve in a LeetCode-inspired workspace with live run results and submission polling."
        actions={<StatusPill difficulty={problem.difficulty} />}
      />

      <SplitPane
        left={
          <Card className="space-y-5 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Problem brief</p>
                <h2 className="text-xl font-semibold text-slate-50">{problem.title}</h2>
              </div>
              <StatusPill difficulty={problem.difficulty} />
            </div>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-200">Description</h3>
              <p className="whitespace-pre-line text-sm leading-7 text-slate-300">{problem.statement}</p>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-200">Constraints</h3>
              <p className="whitespace-pre-line text-sm leading-7 text-slate-300">{problem.constraints}</p>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-200">Input / Output</h3>
              <div className="grid gap-3 text-sm text-slate-300 md:grid-cols-2">
                <Card className="p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Input format</p>
                  <p className="mt-2 whitespace-pre-line leading-6">{problem.inputFormat}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Output format</p>
                  <p className="mt-2 whitespace-pre-line leading-6">{problem.outputFormat}</p>
                </Card>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-200">Visible Test Cases</h3>
              <div className="space-y-3">
                {visibleTestCases.map((testCase, index) => (
                  <Card key={`${index}-${testCase.input}`} className="p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Example {index + 1}</p>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold text-slate-400">Input</p>
                        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-2xl bg-slate-950/70 p-4 text-sm text-slate-200">{testCase.input}</pre>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-400">Output</p>
                        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-2xl bg-slate-950/70 p-4 text-sm text-slate-200">{testCase.output}</pre>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </Card>
        }
        right={
          <div className="space-y-4">
            <Card className="space-y-4 p-4 md:p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-100">Language</p>
                  <p className="text-xs text-slate-400">Choose a runtime and boilerplate template</p>
                </div>
                <Select
                  value={language}
                  onChange={(event) => {
                    const nextLanguage = event.target.value as Language;
                    setLanguage(nextLanguage);
                    setCode(getBoilerplate(nextLanguage));
                  }}
                  className="w-full lg:w-56"
                >
                  {LANGUAGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </Card>

            <LanguageEditor value={code} language={language} onChange={setCode} />

            <Card className="space-y-4 p-4 md:p-5">
              <div className="flex flex-wrap items-center gap-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab}
                    variant={activeTab === tab ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </Button>
                ))}
              </div>

              {activeTab === 'Visible Test Cases' ? (
                <div className="space-y-3">
                  {visibleTestCases.map((testCase, index) => (
                    <Card key={index} className="p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Test case {index + 1}</p>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <pre className="overflow-x-auto rounded-2xl bg-slate-950/70 p-4 text-sm text-slate-200">{testCase.input}</pre>
                        <pre className="overflow-x-auto rounded-2xl bg-slate-950/70 p-4 text-sm text-slate-200">{testCase.output}</pre>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-slate-400">Custom input is sent with the run request. If the backend ignores it, the visible test output remains authoritative.</p>
                  <Textarea value={customInput} onChange={(event) => setCustomInput(event.target.value)} placeholder="2 3\n" />
                </div>
              )}
            </Card>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleRun} disabled={runMutation.isPending}>
                {runMutation.isPending ? 'Running...' : 'Run'}
              </Button>
              <Button variant="outline" onClick={handleSubmit} disabled={submitMutation.isPending}>
                {submitMutation.isPending ? 'Submitting...' : 'Submit'}
              </Button>
            </div>

            <Card className="space-y-4 p-4 md:p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-100">Run Results</p>
                  <p className="text-xs text-slate-400">Visible output comparison</p>
                </div>
                {submissionStatus ? <StatusPill verdict={submissionStatus.verdict} /> : null}
              </div>

              {lastRunResults && lastRunResults.length > 0 ? (
                <div className="space-y-3">
                  {lastRunResults.map((result, index) => (
                    <Card key={index} className="space-y-3 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-slate-100">Case {index + 1}</p>
                        <StatusPill verdict={result.passed ? 'Accepted' : 'Wrong Answer'} />
                      </div>
                      <div className="grid gap-3 md:grid-cols-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Expected</p>
                          <pre className="mt-2 overflow-x-auto rounded-2xl bg-slate-950/70 p-3 text-sm text-slate-200">{result.expectedOutput}</pre>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Actual</p>
                          <pre className="mt-2 overflow-x-auto rounded-2xl bg-slate-950/70 p-3 text-sm text-slate-200">{result.actualOutput}</pre>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Input</p>
                          <pre className="mt-2 overflow-x-auto rounded-2xl bg-slate-950/70 p-3 text-sm text-slate-200">{result.input}</pre>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">Run your code to inspect visible-case results.</p>
              )}

              <Card className="space-y-2 p-4">
                <p className="text-sm font-semibold text-slate-100">Custom Output</p>
                {customInput ? (
                  <p className="text-sm text-slate-400">The backend currently ignores custom input, so no custom output is returned yet.</p>
                ) : (
                  <p className="text-sm text-slate-400">Switch to the custom input tab and enter a payload to test request-time custom execution support.</p>
                )}
              </Card>
            </Card>

            <Card className="space-y-3 p-4 md:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-100">Submission status</p>
                  <p className="text-xs text-slate-400">Polled every 2 seconds until verdict changes</p>
                </div>
                {submissionStatus ? <StatusPill verdict={submissionStatus.verdict} /> : null}
              </div>
              {submissionStatus ? (
                <div className="grid gap-3 md:grid-cols-3">
                  <Card className="p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Verdict</p>
                    <p className="mt-2 text-sm text-slate-100">{submissionStatus.verdict}</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Execution time</p>
                    <p className="mt-2 text-sm text-slate-100">{formatExecutionTime(submissionStatus.executionTime)}</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Test cases passed</p>
                    <p className="mt-2 text-sm text-slate-100">{submissionStatus.testCasesPassed}</p>
                  </Card>
                  <Card className="p-4 md:col-span-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Submitted at</p>
                    <p className="mt-2 text-sm text-slate-100">{formatDateTime(submissionStatus.createdAt)}</p>
                  </Card>
                </div>
              ) : (
                <p className="text-sm text-slate-400">Submit code to start polling verdicts.</p>
              )}
            </Card>
          </div>
        }
      />
    </div>
  );
}
