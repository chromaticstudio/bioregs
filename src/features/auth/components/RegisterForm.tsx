import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { AlertMessage } from '@/components/ui/alert-message'
import { AuthLayout } from '../layout/AuthLayout'

type Props = {
  firstName?: string
  lastName?: string
  email?: string
  onRegister: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean, error?: string, needsConfirmation?: boolean }>
  onNavigateToLogin: () => void
}

export function RegisterForm({ firstName: initialFirstName = '', lastName: initialLastName = '', email: initialEmail = '', onRegister, onNavigateToLogin }: Props) {
  const [firstName, setFirstName] = useState(initialFirstName)
  const [lastName, setLastName] = useState(initialLastName)
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)

  // Update form fields when invitation data arrives
  useEffect(() => {
    if (initialFirstName) setFirstName(initialFirstName)
  }, [initialFirstName])

  useEffect(() => {
    if (initialLastName) setLastName(initialLastName)
  }, [initialLastName])

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail)
  }, [initialEmail])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      const result = await onRegister(email, password, firstName, lastName)
      
      if (result.success) {
        setSuccess(true)
        setNeedsConfirmation(result.needsConfirmation || false)
      } else if (result.error) {
        setError(result.error)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create an account"
      description="Get started with BioRegs"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AlertMessage message={error} />
        <AlertMessage 
          variant="success"
          message={success ? (needsConfirmation ? "Please check your email" : "Account created!") : undefined}
          description={success ? (needsConfirmation 
            ? `We've sent a confirmation link to ${email}. Click the link to activate your account.`
            : "Your account has been created and you're ready to get started."
          ) : undefined}
        />

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="firstName">First Name</FieldLabel>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              required
              autoComplete="given-name"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              required
              autoComplete="family-name"
            />
          </Field>
        </div>

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
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />
        </Field>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <div className="text-center text-sm mt-2">
        <span className="text-muted-foreground">Already have an account? </span>
        <Button
          type="button"
          onClick={onNavigateToLogin}
          variant="text"
        >
          Sign in
        </Button>
      </div>
    </AuthLayout>
  )
}
