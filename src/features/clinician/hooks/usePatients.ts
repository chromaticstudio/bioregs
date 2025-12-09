import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Profile, PatientInvitation } from '@/types'

export function usePatients() {
  const [patients, setPatients] = useState<Profile[]>([])
  const [invitations, setInvitations] = useState<PatientInvitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPatients = async () => {
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Fetch enrolled patients
      const { data: patientsData, error: patientsError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'patient')
        .order('created_at', { ascending: false })

      if (patientsError) throw patientsError

      // Manually fetch protocols for each patient
      if (patientsData && patientsData.length > 0) {
        const patientIds = patientsData.map(p => p.id)
        
        const { data: protocolsData, error: protocolsError } = await supabase
          .from('protocols')
          .select(`
            id,
            patient_id,
            status,
            peptide:peptides (
              name
            )
          `)
          .in('patient_id', patientIds)

        if (protocolsError) throw protocolsError

        // Attach protocols to patients
        const patientsWithProtocols = patientsData.map(patient => ({
          ...patient,
          protocols: protocolsData?.filter(p => p.patient_id === patient.id) || []
        }))

        setPatients(patientsWithProtocols)
      } else {
        setPatients(patientsData || [])
      }

      // Fetch invitations
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('patient_invitations')
        .select('*')
        .eq('clinician_id', user.id)
        .order('created_at', { ascending: false })

      if (invitationsError) throw invitationsError

      setInvitations(invitationsData || [])
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

      const token = crypto.randomUUID()
      const inviteLink = `${window.location.origin}/register?token=${token}`

      const { error } = await supabase
        .from('patient_invitations')
        .insert({
          email,
          first_name: firstName,
          last_name: lastName,
          clinician_id: user.id,
          token,
          status: 'pending'
        })

      if (error) throw error

      await fetchPatients()
      return { success: true, inviteLink }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const resendInvitation = async (id: string) => {
    try {
      const token = crypto.randomUUID()
      const inviteLink = `${window.location.origin}/register?token=${token}`

      const { error } = await supabase
        .from('patient_invitations')
        .update({ token })
        .eq('id', id)

      if (error) throw error

      await fetchPatients()
      return { success: true, inviteLink }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const cancelInvitation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('patient_invitations')
        .update({ status: 'cancelled' })
        .eq('id', id)

      if (error) throw error

      await fetchPatients()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  return {
    patients,
    invitations,
    loading,
    error,
    sendInvitation,
    resendInvitation,
    cancelInvitation,
    refresh: fetchPatients
  }
}
