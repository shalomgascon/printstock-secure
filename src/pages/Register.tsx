import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, PasswordInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createUserSchema, CreateUserFormData } from '@/lib/validation';
import { authApi } from '@/lib/api';
import { checkPasswordStrength } from '@/lib/security';

export default function Register() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'staff',
    },
  });

  const password = watch('password', '');
  const passwordStrength = password ? checkPasswordStrength(password) : null;

  const getStrengthColor = (score: number) => {
    if (score < 30) return 'bg-destructive';
    if (score < 60) return 'bg-warning';
    return 'bg-success';
  };

  const getStrengthLabel = (score: number) => {
    if (score < 30) return 'Weak';
    if (score < 60) return 'Fair';
    if (score < 80) return 'Good';
    return 'Strong';
  };

  const onSubmit = async (data: CreateUserFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    const result = await authApi.register(data.name, data.email, data.password, data.role);

    setIsSubmitting(false);

    if (result.error) {
      setSubmitError(result.error);
      return;
    }

    setSubmitSuccess(`User "${data.name}" registered successfully as ${data.role}.`);
    reset();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/users')}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Register New User
          </h1>
          <p className="text-muted-foreground">
            Create a new account for a staff member or manager
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-lg rounded-xl border border-border bg-card p-6 shadow-sm">
        {/* Success message */}
        {submitSuccess && (
          <div className="mb-6 flex items-center gap-3 rounded-lg bg-success/10 border border-success/20 p-4 text-success">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{submitSuccess}</p>
          </div>
        )}

        {/* Error message */}
        {submitError && (
          <div className="mb-6 flex items-center gap-3 rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="e.g. Juan Dela Cruz"
              error={errors.name?.message}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@printflow.ph"
              autoComplete="off"
              error={errors.email?.message}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register('role')}
            >
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              placeholder="Create a strong password"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}

            {/* Password strength meter */}
            {passwordStrength && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength.score)}`}
                      style={{ width: `${passwordStrength.score}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground min-w-[3rem]">
                    {getStrengthLabel(passwordStrength.score)}
                  </span>
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <ul className="space-y-0.5">
                    {passwordStrength.feedback.map((tip, i) => (
                      <li key={i} className="text-xs text-muted-foreground">
                        • {tip}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Re-enter password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-11"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span>Creating account...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Register User</span>
              </div>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
