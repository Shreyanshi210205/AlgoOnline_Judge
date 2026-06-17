import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Code2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { useAuth } from '../hooks/use-auth';
import { toast } from 'sonner';

const loginSchema = z.object({
  username: z.string().min(3, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/problems', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (values: LoginForm) => {
    try {
      await login(values);
      toast.success('Logged in successfully');
      navigate('/problems', { replace: true });
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Unable to log in');
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-120px)] items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur">
        <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">
          <Code2 className="h-4 w-4" />
          LeetCode-style judge workspace
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-50 md:text-6xl">Solve, submit, and climb the board.</h1>
          <p className="max-w-xl text-base leading-7 text-slate-400 md:text-lg">
            A production-ready frontend for the Online Judge platform with protected routes, live submission polling, Monaco-powered coding, and real API integration.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ['Problems', 'Search, filter, and solve challenges'],
            ['Run', 'Test code against visible cases'],
            ['Submit', 'Poll verdicts every 2 seconds'],
          ].map(([title, text]) => (
            <Card key={title} className="p-5">
              <p className="text-sm font-semibold text-slate-100">{title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      <Card className="p-8">
        <div className="mb-8 space-y-2">
          <h2 className="text-2xl font-semibold text-slate-50">Sign in</h2>
          <p className="text-sm text-slate-400">The current backend authenticates with username and password.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">Username</label>
            <Input placeholder="your-username" {...register('username')} />
            {errors.username ? <p className="text-sm text-rose-300">{errors.username.message}</p> : null}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">Password</label>
            <Input type="password" placeholder="••••••••" {...register('password')} />
            {errors.password ? <p className="text-sm text-rose-300">{errors.password.message}</p> : null}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log in'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="mt-6 text-sm text-slate-400">
          New here?{' '}
          <Link to="/register" className="text-cyan-300 hover:text-cyan-200">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
}
