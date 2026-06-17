import type { ReactNode } from 'react';
import { Card } from './ui/card';

export function AppShell({ children }: { children: ReactNode }) {
  return <Card className="p-4 md:p-6">{children}</Card>;
}
