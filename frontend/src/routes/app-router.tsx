import { Navigate, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AppLayout } from '../layouts/app-layout';
import { ProtectedRoute } from './protected-route';
import { LoginPage } from '../pages/login-page';
import { RegisterPage } from '../pages/register-page';
import { ProblemsPage } from '../pages/problems-page';
import { ProblemDetailPage } from '../pages/problem-detail-page';
import { ProblemSubmissionsPage } from '../pages/problem-submissions-page';
import { ProfilePage } from '../pages/profile-page';
import { LeaderboardPage } from '../pages/leaderboard-page';
import { NotFoundPage } from '../pages/not-found-page';
import { useAuth } from '../hooks/use-auth';

function AuthRedirect({ children }: { children: ReactNode }) {
  const { isAuthenticated, isHydrating } = useAuth();

  if (isHydrating) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/problems" replace />;
  }

  return children;
}

export function AppRouter() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AuthRedirect>
            <LoginPage />
          </AuthRedirect>
        }
      />
      <Route
        path="/register"
        element={
          <AuthRedirect>
            <RegisterPage />
          </AuthRedirect>
        }
      />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/problems" replace />} />
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/problems/:id" element={<ProblemDetailPage />} />
          <Route path="/problems/:id/submissions" element={<ProblemSubmissionsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
