import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { LoginForm } from '../components/LoginForm'
import { RegisterForm } from '../components/RegisterForm'
import { PatientRegistrationForm } from '../components/PatientRegistrationForm'
import { ForgotPasswordForm } from '../components/ForgotPasswordForm'
import { ResetPasswordForm } from '../components/ResetPasswordForm'

type AuthView = 'login' | 'register' | 'forgot-password' | 'reset-password'

export function Auth() {
  const { signIn, signUp, resetPassword, updatePassword } = useAuth()

  // Check URL params to determine initial view
  const [view, setView] = useState<AuthView>(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('token')) return 'register'
    return 'login'
  })

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotError, setForgotError] = useState('')
  const [forgotSuccess, setForgotSuccess] = useState(false)

  // Reset password state
  const [resetPassword_password, setResetPassword_password] = useState('')
  const [resetConfirmPassword, setResetConfirmPassword] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetError, setResetError] = useState('')
  const [resetSuccess, setResetSuccess] = useState(false)
  const [validSession, setValidSession] = useState(true)

  const handleLogin = async (email: string, password: string) => {
    const { error } = await signIn(email, password)
    if (error) throw new Error(error.message)
  }

  const handleRegister = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    const { error } = await signUp(email, password, firstName, lastName)
    if (error) throw new Error(error.message)
  }

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotError('')
    setForgotLoading(true)

    const { error } = await resetPassword(forgotEmail)
    
    if (error) {
      setForgotError(error.message)
    } else {
      setForgotSuccess(true)
    }
    
    setForgotLoading(false)
  }

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetError('')

    if (resetPassword_password !== resetConfirmPassword) {
      setResetError('Passwords do not match')
      return
    }

    if (resetPassword_password.length < 8) {
      setResetError('Password must be at least 8 characters')
      return
    }

    setResetLoading(true)

    const { error } = await updatePassword(resetPassword_password)
    
    if (error) {
      setResetError(error.message)
      if (error.message.includes('session')) {
        setValidSession(false)
      }
    } else {
      setResetSuccess(true)
      // Redirect to login after 2 seconds
      setTimeout(() => setView('login'), 2000)
    }
    
    setResetLoading(false)
  }

  const handleRequestNewLink = () => {
    setView('forgot-password')
    setForgotSuccess(false)
    setForgotEmail('')
    setResetError('')
  }

  // Render appropriate form based on view
  switch (view) {
    case 'register':
      // Check if this is a patient invitation (has token param)
      const hasToken = new URLSearchParams(window.location.search).get('token')

      // If there's a token, show the full patient registration form
      if (hasToken) {
        return (
          <PatientRegistrationForm
            onNavigateToLogin={() => setView('login')}
          />
        )
      }

      // Otherwise show the simple register form (for clinicians/admins)
      return (
        <RegisterForm
          onRegister={handleRegister}
          onNavigateToLogin={() => setView('login')}
        />
      )
    
    case 'forgot-password':
      return (
        <ForgotPasswordForm
          email={forgotEmail}
          setEmail={setForgotEmail}
          loading={forgotLoading}
          error={forgotError}
          success={forgotSuccess}
          onSubmit={handleForgotPasswordSubmit}
          onBackToLogin={() => {
            setView('login')
            setForgotSuccess(false)
            setForgotEmail('')
            setForgotError('')
          }}
        />
      )
    
    case 'reset-password':
      return (
        <ResetPasswordForm
          password={resetPassword_password}
          setPassword={setResetPassword_password}
          confirmPassword={resetConfirmPassword}
          setConfirmPassword={setResetConfirmPassword}
          loading={resetLoading}
          error={resetError}
          success={resetSuccess}
          validSession={validSession}
          onSubmit={handleResetPasswordSubmit}
          onRequestNewLink={handleRequestNewLink}
        />
      )
    
    default:
      return (
        <LoginForm
          onLogin={handleLogin}
          onNavigateToRegister={() => setView('register')}
          onNavigateToForgotPassword={() => setView('forgot-password')}
        />
      )
  }
}
