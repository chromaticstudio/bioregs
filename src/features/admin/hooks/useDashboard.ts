import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    clinicians: 0,
    patients: 0,
    activeProtocols: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      
      // Get total users
      const { count: totalCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Get clinicians
      const { count: clinicianCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'clinician')

      // Get patients
      const { count: patientCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'patient')

      // Get active protocols
      const { count: protocolCount } = await supabase
        .from('protocols')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      setStats({
        totalUsers: totalCount || 0,
        clinicians: clinicianCount || 0,
        patients: patientCount || 0,
        activeProtocols: protocolCount || 0,
      })
    } catch (err) {
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  return { stats, loading }
}
