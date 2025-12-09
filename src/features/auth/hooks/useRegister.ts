import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { PatientInvitation } from '@/types'

export function useRegister() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [invitation, setInvitation] = useState<PatientInvitation | null>(null)
  const [checkingInvitation, setCheckingInvitation] = useState(true)

  const { signUp } = useAuth()

  // Check for invitation token on mount
  useEffect(() => {
    const checkInvitation = async () => {
      const params = new URLSearchParams(window.location.search)
      const token = params.get('token')

      if (token) {
        try {
          const { data, error } = await supabase
            .from('patient_invitations')
            .select('*')
            .eq('token', token)
            .eq('status', 'pending')
            .single()

          if (data && !error) {
            setInvitation(data)
            setEmail(data.email)
            setFirstName(data.first_name)
            setLastName(data.last_name)
          }
        } catch (err) {
          console.error('Error checking invitation:', err)
        }
      }

      setCheckingInvitation(false)
    }

    checkInvitation()
  }, [])

  const register = async () => {
    setError('')
    setLoading(true)

    const { error: signUpError } = await signUp(email, password, firstName, lastName)
    
    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return { success: false, error: signUpError.message }
    }

    // If this was an invitation, mark it as accepted
    if (invitation) {
      await supabase
        .from('patient_invitations')
        .update({ 
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', invitation.id)
    }
    
    setSuccess(true)
    setLoading(false)
    return { success: true }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    error,
    loading,
    success,
    invitation,
    checkingInvitation,
    register,
  }
}
