import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { useAuth } from '../hooks/use-auth';
import { toast } from 'sonner';

const registerSchema = z
  .object({
    username: z.string().min(3, 'Username is required'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { register: registerAccount } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterForm) => {
    try {
      await registerAccount(values);
      toast.success('Account created successfully');
      navigate('/login');
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Unable to create account');
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-120px)] items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <Card className="p-8">
        <div className="mb-8 space-y-2">
          <div className="inline-flex items-center gap-3 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
            <ShieldCheck className="h-4 w-4" />
            Start competing in minutes
          </div>
          <h1 className="text-3xl font-semibold text-slate-50">Create your account</h1>
          <p className="text-sm text-slate-400">Register once and keep your progress, ratings, and submissions in sync.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">Username</label>
            <Input placeholder="coder123" {...register('username')} />
            {errors.username ? <p className="text-sm text-rose-300">{errors.username.message}</p> : null}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">Email</label>
            <Input type="email" placeholder="you@example.com" {...register('email')} />
            {errors.email ? <p className="text-sm text-rose-300">{errors.email.message}</p> : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Password</label>
              <Input type="password" placeholder="••••••••" {...register('password')} />
              {errors.password ? <p className="text-sm text-rose-300">{errors.password.message}</p> : null}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Confirm password</label>
              <Input type="password" placeholder="••••••••" {...register('confirmPassword')} />
              {errors.confirmPassword ? <p className="text-sm text-rose-300">{errors.confirmPassword.message}</p> : null}
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="mt-6 text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-300 hover:text-cyan-200">
            Log in
          </Link>
        </p>
      </Card>

      <section className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-slate-50">Built for serious practice</h2>
          <p className="max-w-xl text-base leading-7 text-slate-400">
            The frontend connects to your existing backend, shows live verdict polling, and provides the split editor layout expected in modern judge platforms.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            'Protected navigation with token persistence',
            'Monaco editor with language switching',
            'Run and submit flows backed by real APIs',
            'Responsive, dark-mode-ready dashboards',
          ].map((item) => (
            <Card key={item} className="p-5">
              <p className="text-sm leading-6 text-slate-300">{item}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
