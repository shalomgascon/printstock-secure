import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Printer, Shield, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, PasswordInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema, LoginFormData } from '@/lib/validation';
import { cn } from '@/lib/utils';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: authLoading, error: authError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect if already authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse-soft">
          <Printer className="h-12 w-12 text-primary" />
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    const result = await login(data);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
              <Printer className="h-7 w-7 text-accent-foreground" />
            </div>
            <span className="font-display font-bold text-2xl">PrintFlow</span>
          </div>

          <div className="space-y-6 max-w-md">
            <h1 className="text-4xl font-display font-bold leading-tight">
              Secure Inventory Management for Your Printing Business
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              Streamline your operations with our comprehensive inventory system designed specifically for Philippine printing shops.
            </p>
            
            <div className="flex items-center gap-3 p-4 rounded-lg bg-primary-foreground/10 backdrop-blur-sm">
              <Shield className="h-6 w-6 text-accent" />
              <div>
                <p className="font-medium">Enterprise Security</p>
                <p className="text-sm text-primary-foreground/70">
                  Industry-standard encryption and security practices
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-primary-foreground/60">
            © 2024 PrintFlow. Built with security in mind.
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Printer className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-2xl text-foreground">
              PrintFlow
            </span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-display font-bold text-foreground">
              Welcome back
            </h2>
            <p className="mt-2 text-muted-foreground">
              Sign in to access your inventory system
            </p>
          </div>

          {/* Error message */}
          {authError && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{authError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="text-sm font-medium text-primary hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset functionality would be implemented here');
                  }}
                >
                  Forgot password?
                </a>
              </div>
              <PasswordInput
                id="password"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>Sign in securely</span>
                </div>
              )}
            </Button>
          </form>

          {/* Backend info */}
          <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
            <p className="text-sm font-medium text-foreground">
              Login Information
            </p>
            <p className="text-xs text-muted-foreground">
              Use your registered credentials to sign in. Contact your administrator if you need an account.
            </p>
          </div>

          {/* Security notice */}
          <div className="flex items-start gap-3 text-xs text-muted-foreground">
            <Shield className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>
              This system implements secure login practices including rate limiting, 
              session management, and input validation to protect your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
