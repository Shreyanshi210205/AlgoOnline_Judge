import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export function NotFoundPage() {
  return (
    <div className="grid min-h-[70vh] place-items-center">
      <Card className="max-w-xl p-10 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-cyan-300">404</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-50">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">The route you requested does not exist.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild>
            <Link to="/problems">Go to problems</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
