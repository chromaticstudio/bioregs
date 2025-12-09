import { FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { AlertMessage } from '@/components/ui/alert-message'
import { AuthLayout } from '../layout/AuthLayout'

type Props = {
  email: string
  setEmail: (email: string) => void
  loading: boolean
  error: string
  success: boolean
  onSubmit: (e: FormEvent) => void
  onBackToLogin: () => void
}

export function ForgotPasswordForm({
  email,
  setEmail,
  loading,
  error,
  success,
  onSubmit,
  onBackToLogin,
}: Props) {
  if (success) {
    return (
      <AuthLayout
        title="Check your email"
        description={`We've sent a password reset link to ${email}`}
      >
        <Button onClick={onBackToLogin} variant="outline" className="w-full">
          Back to Login
        </Button>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset your password"
      description="Enter your email and we'll send you a reset link"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <AlertMessage message={error} />

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </Field>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>
      
      <div className="text-center text-sm mt-2">
        <Button
          type="button"
          onClick={onBackToLogin}
          variant="text"
          className="w-full"
        >
          Back to Login
        </Button>
      </div>
    </AuthLayout>
  )
}
