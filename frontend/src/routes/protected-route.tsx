import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { Skeleton } from '../components/ui/skeleton';

export function ProtectedRoute() {
  const { isAuthenticated, isHydrating } = useAuth();
  const location = useLocation();

  if (isHydrating) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-24 w-full rounded-3xl" />
        <Skeleton className="h-[70vh] w-full rounded-3xl" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
