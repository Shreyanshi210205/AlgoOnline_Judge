import { Info } from 'lucide-react';
import { Card } from './card';
import { Button } from './button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center gap-4 p-10 text-center">
      <div className="rounded-2xl bg-cyan-500/10 p-4 text-cyan-300">
        <Info className="h-6 w-6" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        <p className="max-w-md text-sm leading-6 text-slate-400">{description}</p>
      </div>
      {actionLabel ? <Button onClick={onAction}>{actionLabel}</Button> : null}
    </Card>
  );
}
