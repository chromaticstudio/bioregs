import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Symptom, Protocol, CheckInFormData } from '@/types'

function getCurrentRoundedDateTime(): string {
  const now = new Date()
  const minutes = now.getMinutes()
  
  // Round DOWN to nearest 30 minutes
  const roundedMinutes = minutes >= 30 ? 30 : 0
  now.setMinutes(roundedMinutes)
  now.setSeconds(0)
  now.setMilliseconds(0)
  
  // Return in ISO format (YYYY-MM-DDTHH:MM)
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const mins = String(now.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day}T${hours}:${mins}`
}

export function useCheckIn(protocolId?: string) {
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [saeSymptoms, setSaeSymptoms] = useState<Symptom[]>([])
  const [protocol, setProtocol] = useState<Protocol | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<CheckInFormData>({
    doseTime: getCurrentRoundedDateTime(), 
    symptomRatings: {},
    notes: '',
    adverseEffects: '',
    isEndOfCycle: false,
  })

  useEffect(() => {
    fetchData()
  }, [protocolId])

  const fetchData = async () => {
    try {
      setLoading(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let query = supabase
        .from('protocols')
        .select(`
          *,
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

      if (protocolId) {
        query = query.eq('id', protocolId)
      }

      const { data: protocolData, error: protocolError } = await query.single()

      if (protocolError && protocolError.code !== 'PGRST116') {
        throw protocolError
      }

      if (protocolData) {
        // Cast directly to Protocol type - no transformation needed
        setProtocol(protocolData as Protocol)

        const peptide = protocolData.peptide as any

        // Fetch symptoms associated with this peptide
        const { data: peptideSymptoms, error: peptideSymptomsError } = await supabase
          .from('peptide_symptoms')
          .select(`
            symptom:symptoms!peptide_symptoms_symptom_id_fkey (
              id,
              name,
              description,
              is_sae,
              created_at
            )
          `)
          .eq('peptide_id', peptide.id)

        if (peptideSymptomsError) throw peptideSymptomsError

        const protocolSymptoms = peptideSymptoms
          ?.map(ps => ps.symptom as unknown as Symptom)
          .filter(s => s && !s.is_sae) || []

        setSymptoms(protocolSymptoms)

        // Fetch SAE symptoms (global for all protocols)
        const { data: saeData, error: saeError } = await supabase
          .from('symptoms')
          .select('*')
          .eq('is_sae', true)
          .order('name')

        if (saeError) throw saeError
        setSaeSymptoms(saeData || [])
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (updates: Partial<CheckInFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const setSymptomRating = (symptomId: string, rating: number) => {
    setFormData(prev => ({
      ...prev,
      symptomRatings: {
        ...prev.symptomRatings,
        [symptomId]: rating,
      },
    }))
  }

  const submitCheckIn = async () => {
    setSubmitting(true)
    setError('')

    try {
      if (!protocol) throw new Error('No active protocol')

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: checkIn, error: checkInError } = await supabase
        .from('check_ins')
        .insert({
          patient_id: user.id,
          protocol_id: protocol.id,
          dose_taken_at: new Date(formData.doseTime).toISOString(),
          dosage_amount: protocol.peptide?.dosage_amount || '', // Use peptide's dosage
          notes: formData.notes || null,
          is_end_of_cycle: formData.isEndOfCycle,
        })
        .select()
        .single()

      if (checkInError) throw checkInError

      const symptomRatingPromises = Object.entries(formData.symptomRatings).map(
        ([symptomId, rating]) =>
          supabase.from('symptom_ratings').insert({
            check_in_id: checkIn.id,
            symptom_id: symptomId,
            rating: rating,
          })
      )

      await Promise.all(symptomRatingPromises)

      if (formData.adverseEffects) {
        await supabase.from('adverse_effects').insert({
          check_in_id: checkIn.id,
          description: formData.adverseEffects,
          is_significant: false,
        })
      }

      setSuccess(true)
      setFormData({
        doseTime: getCurrentRoundedDateTime(),
        symptomRatings: {},
        notes: '',
        adverseEffects: '',
        isEndOfCycle: false,
      })

      setTimeout(() => setSuccess(false), 3000)
      return { success: true }
    } catch (err: any) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setSubmitting(false)
    }
  }

  return {
    symptoms,
    saeSymptoms,
    protocol,
    loading,
    submitting,
    error,
    success,
    formData,
    updateFormData,
    setSymptomRating,
    submitCheckIn,
  }
}
