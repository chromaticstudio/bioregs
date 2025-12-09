import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [validSession, setValidSession] = useState(false)

  useEffect(() => {
    // Check if we have a valid session from the password reset link
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        setValidSession(true)
      } else {
        setError('Invalid or expired reset link. Please request a new one.')
      }
    }

    checkSession()
  }, [])

  const resetPassword = async () => {
    if (!validSession) {
      setError('Invalid or expired reset link. Please request a new one.')
      return { success: false, error: 'Invalid session' }
    }

    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return { success: false, error: 'Passwords do not match' }
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return { success: false, error: 'Password must be at least 6 characters' }
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error

      // Sign out after password reset
      await supabase.auth.signOut()

      setSuccess(true)
      return { success: true }
    } catch (err: any) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    success,
    validSession,
    resetPassword,
  }
}
