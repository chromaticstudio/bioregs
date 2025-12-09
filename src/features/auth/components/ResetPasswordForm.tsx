import { FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { AlertMessage } from '@/components/ui/alert-message'
import { AuthLayout } from '../layout/AuthLayout'

type Props = {
  password: string
  setPassword: (password: string) => void
  confirmPassword: string
  setConfirmPassword: (password: string) => void
  loading: boolean
  error: string
  success: boolean
  validSession: boolean
  onSubmit: (e: FormEvent) => void
  onRequestNewLink: () => void
}

export function ResetPasswordForm({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  loading,
  error,
  success,
  validSession,
  onSubmit,
  onRequestNewLink,
}: Props) {
  if (success) {
    return (
      <AuthLayout
        title="Password updated!"
        description="Redirecting to login..."
      >
        <div />
      </AuthLayout>
    )
  }

  if (!validSession) {
    return (
      <AuthLayout
        title="Invalid or expired link"
        description="This password reset link is invalid or has expired."
      >
        <AlertMessage message={error} />
        <Button onClick={onRequestNewLink} className="w-full">
          Request New Reset Link
        </Button>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Set new password"
      description="Enter your new password below"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <AlertMessage message={error} />

        <Field>
          <FieldLabel htmlFor="password">New Password</FieldLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </Field>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
      </form>
    </AuthLayout>
  )
}
