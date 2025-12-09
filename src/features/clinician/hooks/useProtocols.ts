import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Protocol, Peptide } from '@/types'

export function useProtocols() {
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [peptides, setPeptides] = useState<Peptide[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Fetch protocols with peptide info including dosage
      const { data: protocolsData, error: protocolsError } = await supabase
        .from('protocols')
        .select(`
          id,
          peptide_id,
          clinician_id,
          patient_id,
          frequency,
          duration,
          notes,
          status,
          created_at,
          peptide:peptides!protocols_peptide_id_fkey (
            id,
            name,
            description,
            dosage_amount,
            dosage_unit,
            time_of_day
          )
        `)
        .eq('clinician_id', user.id)
        .order('created_at', { ascending: false })

      if (protocolsError) throw protocolsError

      // Get unique patient IDs
      const patientIds = [...new Set(
        (protocolsData || [])
          .map(p => p.patient_id)
          .filter(Boolean)
      )] as string[]

      // Fetch all patients in one query
      let patientsMap = new Map()
      if (patientIds.length > 0) {
        const { data: patientsData } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', patientIds)

        if (patientsData) {
          patientsData.forEach(p => {
            patientsMap.set(p.id, {
              first_name: p.first_name,
              last_name: p.last_name
            })
          })
        }
      }

      // Map protocols with patient data
      const formattedProtocols = (protocolsData || []).map(p => ({
        ...p,
        peptide: Array.isArray(p.peptide) ? p.peptide[0] : p.peptide,
        patient: p.patient_id ? patientsMap.get(p.patient_id) || null : null
      })) as Protocol[]

      // Fetch peptides for the create form
      const { data: peptidesData, error: peptidesError } = await supabase
        .from('peptides')
        .select('*')
        .order('name')

      if (peptidesError) throw peptidesError

      setProtocols(formattedProtocols)
      setPeptides(peptidesData || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createProtocol = async (data: {
    peptide_id: string
    frequency: string
    duration: string
    notes: string
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error: insertError } = await supabase
        .from('protocols')
        .insert({
          clinician_id: user.id,
          peptide_id: data.peptide_id,
          frequency: data.frequency,
          duration: data.duration,
          notes: data.notes || null,
          status: 'active'
        })

      if (insertError) throw insertError

      await fetchData()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const assignPatient = async (protocolId: string, patientId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('protocols')
        .update({ patient_id: patientId })
        .eq('id', protocolId)

      if (updateError) throw updateError

      await fetchData()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const deleteProtocol = async (id: string) => {
    try {
      const { error } = await supabase
        .from('protocols')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchData()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    protocols,
    peptides,
    loading,
    error,
    createProtocol,
    assignPatient,
    deleteProtocol,
    refresh: fetchData
  }
}
