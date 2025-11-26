import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export function useLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn } = useAuth()

  const login = async () => {
    setError('')
    setLoading(true)

    const { error: signInError } = await signIn(email, password)
    
    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return { success: false, error: signInError.message }
    }
    
    setLoading(false)
    return { success: true }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    login,
  }
}
