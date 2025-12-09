import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Protocol, CheckIn } from '@/types'

type DashboardStats = {
  totalCheckIns: number
  currentStreak: number
  checkInsThisWeek: number
  adherenceRate: number
}

type SymptomRating = {
  check_in_id: string
  symptom_id: string
  rating: number
  created_at: string
  symptom: {
    name: string
  }
}

export function useDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [activeProtocol, setActiveProtocol] = useState<Protocol | null>(null)
  const [recentCheckIns, setRecentCheckIns] = useState<CheckIn[]>([])
  const [symptomRatings, setSymptomRatings] = useState<SymptomRating[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalCheckIns: 0,
    currentStreak: 0,
    checkInsThisWeek: 0,
    adherenceRate: 0
  })

  useEffect(() => {
    if (!user) return

    const fetchDashboardData = async () => {
      setLoading(true)

      // Fetch active protocol
      const { data: protocolData } = await supabase
        .from('protocols')
        .select(`
          *,
          peptide:peptides(*)
        `)
        .eq('patient_id', user.id)
        .eq('status', 'active')
        .single()

      setActiveProtocol(protocolData)

      // Fetch recent check-ins (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: checkInsData } = await supabase
        .from('check_ins')
        .select('*')
        .eq('patient_id', user.id)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })

      if (checkInsData) {
        setRecentCheckIns(checkInsData)
        calculateStats(checkInsData)

        // Fetch symptom ratings for these check-ins
        const checkInIds = checkInsData.map(ci => ci.id)
        
        if (checkInIds.length > 0) {
          const { data: ratingsData } = await supabase
            .from('symptom_ratings')
            .select(`
              *,
              symptom:symptoms(name)
            `)
            .in('check_in_id', checkInIds)
            .order('created_at', { ascending: true })

          if (ratingsData) {
            setSymptomRatings(ratingsData as SymptomRating[])
          }
        }
      }

      setLoading(false)
    }

    fetchDashboardData()
  }, [user])

  const calculateStats = (checkIns: CheckIn[]) => {
    const totalCheckIns = checkIns.length

    // Calculate check-ins this week
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const checkInsThisWeek = checkIns.filter(
      (ci) => new Date(ci.created_at) >= oneWeekAgo
    ).length

    // Calculate current streak (consecutive days with check-ins)
    let currentStreak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)
      
      const hasCheckIn = checkIns.some((ci) => {
        const ciDate = new Date(ci.created_at)
        ciDate.setHours(0, 0, 0, 0)
        return ciDate.getTime() === checkDate.getTime()
      })

      if (hasCheckIn) {
        currentStreak++
      } else if (i > 0) {
        // Allow missing today if checking later in the day
        break
      }
    }

    // Calculate adherence rate (% of days with check-ins in last 30 days)
    const adherenceRate = totalCheckIns > 0 
      ? Math.round((totalCheckIns / 30) * 100)
      : 0

    setStats({
      totalCheckIns,
      currentStreak,
      checkInsThisWeek,
      adherenceRate
    })
  }

  return {
    loading,
    activeProtocol,
    recentCheckIns,
    symptomRatings,
    stats
  }
}