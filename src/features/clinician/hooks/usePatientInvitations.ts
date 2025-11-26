import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { PatientInviteFormData } from '@/types/forms'

export function usePatientInvitations() {
  const [invitations, setInvitations] = useState<PatientInviteFormData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchInvitations = async () => {
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error: fetchError } = await supabase
        .from('patient_invitations')
        .select('*')
        .eq('clinician_id', user.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setInvitations(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const sendInvitation = async (email: string, firstName: string, lastName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Check if email already invited
      const { data: existing } = await supabase
        .from('patient_invitations')
        .select('id')
        .eq('email', email)
        .eq('clinician_id', user.id)
        .single()

      if (existing) {
        return { success: false, error: 'This email has already been invited' }
      }

      // Create invitation
      const { data: invitation, error: insertError } = await supabase
        .from('patient_invitations')
        .insert({
          clinician_id: user.id,
          email,
          first_name: firstName,
          last_name: lastName,
        })
        .select()
        .single()

      if (insertError) throw insertError

      // TODO: Send actual email here
      // For now, we'll just log the invitation link
      const inviteLink = `${window.location.origin}/register?token=${invitation.token}`
      console.log('📧 Invitation link (copy this for testing):', inviteLink)

      await fetchInvitations()
      return { success: true, inviteLink }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const resendInvitation = async (invitationId: string) => {
    try {
      const invitation = invitations.find(i => i.id === invitationId)
      if (!invitation) throw new Error('Invitation not found')

      // Generate new token
      const { data, error: updateError } = await supabase
        .from('patient_invitations')
        .update({ 
          token: crypto.randomUUID(),
          status: 'pending'
        })
        .eq('id', invitationId)
        .select()
        .single()

      if (updateError) throw updateError

      // TODO: Send actual email here
      const inviteLink = `${window.location.origin}/register?token=${data.token}`
      console.log('📧 Resent invitation link:', inviteLink)

      await fetchInvitations()
      return { success: true, inviteLink }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const cancelInvitation = async (invitationId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('patient_invitations')
        .delete()
        .eq('id', invitationId)

      if (deleteError) throw deleteError

      await fetchInvitations()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  useEffect(() => {
    fetchInvitations()
  }, [])

  return {
    invitations,
    loading,
    error,
    sendInvitation,
    resendInvitation,
    cancelInvitation,
    refresh: fetchInvitations
  }
}
