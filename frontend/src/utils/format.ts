import type { Difficulty, Verdict } from '../types';

export function formatDateTime(value?: string) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function formatExecutionTime(value?: number) {
  if (value === undefined || value === null) {
    return '-';
  }

  return `${value.toFixed(2)} ms`;
}

export function formatDifficulty(difficulty: Difficulty) {
  return difficulty;
}

export function difficultyClass(difficulty: Difficulty) {
  switch (difficulty) {
    case 'Easy':
      return 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30';
    case 'Medium':
      return 'bg-amber-500/15 text-amber-300 ring-amber-500/30';
    case 'Hard':
      return 'bg-rose-500/15 text-rose-300 ring-rose-500/30';
  }
}

export function verdictClass(verdict: Verdict) {
  switch (verdict) {
    case 'Accepted':
      return 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30';
    case 'Wrong Answer':
      return 'bg-amber-500/15 text-amber-300 ring-amber-500/30';
    case 'Compilation Error':
      return 'bg-rose-500/15 text-rose-300 ring-rose-500/30';
    case 'Runtime Error':
      return 'bg-orange-500/15 text-orange-300 ring-orange-500/30';
    case 'Time Limit Exceeded':
      return 'bg-fuchsia-500/15 text-fuchsia-300 ring-fuchsia-500/30';
    case 'Memory Limit Exceeded':
      return 'bg-cyan-500/15 text-cyan-300 ring-cyan-500/30';
    case 'Pending':
      return 'bg-slate-500/15 text-slate-200 ring-slate-500/30';
  }
}
