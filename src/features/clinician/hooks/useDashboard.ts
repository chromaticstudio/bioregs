import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useDashboard() {
  const [stats, setStats] = useState({
    activeProtocols: 0,
    activePatients: 0,
    pendingVisits: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { count: protocolCount } = await supabase
        .from('protocols')
        .select('*', { count: 'exact', head: true })
        .eq('clinician_id', user.id)
        .eq('status', 'active')

      // Count unique patients with protocols from this clinician
      const { data: patientData } = await supabase
        .from('protocols')
        .select('patient_id')
        .eq('clinician_id', user.id)
        .not('patient_id', 'is', null)

      const uniquePatients = new Set(patientData?.map(p => p.patient_id) || [])

      setStats({
        activeProtocols: protocolCount || 0,
        activePatients: uniquePatients.size,
        pendingVisits: 0,
      })
    } catch (err) {
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  return { stats, loading }
}
