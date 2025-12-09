import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Protocol } from '@/types'

export function useProtocols() {
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Fetch protocols assigned to this patient with peptide info
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
        .eq('patient_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (protocolsError) throw protocolsError

      // Format protocols with peptide data
      const formattedProtocols = (protocolsData || []).map(p => ({
        ...p,
        peptide: Array.isArray(p.peptide) ? p.peptide[0] : p.peptide
      })) as Protocol[]

      setProtocols(formattedProtocols)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    protocols,
    loading,
    error,
    refresh: fetchData
  }
}
