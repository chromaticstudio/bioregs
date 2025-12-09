import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { AlertMessage } from '@/components/ui/alert-message'
import { AuthLayout } from '../layout/AuthLayout'

type Props = {
  onLogin: (email: string, password: string) => Promise<void>
  onNavigateToRegister: () => void
  onNavigateToForgotPassword: () => void
}

export function LoginForm({ onLogin, onNavigateToRegister, onNavigateToForgotPassword }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await onLogin(email, password)
    } catch (err: any) {
      setError(err.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to your account"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AlertMessage message={error} />

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </Field>

        <Field>
          <div className="flex justify-between">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Button
              type="button"
              onClick={onNavigateToForgotPassword}
              variant="text"
            >
              Forgot password?
            </Button>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </Field>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      

      <div className="text-center text-sm mt-2">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Button
          type="button"
          onClick={onNavigateToRegister}
          variant="text"
        >
          Sign up
        </Button>
      </div>
    </AuthLayout>
  )
}
