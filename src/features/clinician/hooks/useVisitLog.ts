import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Symptom, Profile, VisitFormData } from '@/types'

export function useVisitLog(patientId: string) {
  const [patient, setPatient] = useState<Profile | null>(null)
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<VisitFormData>({
    symptomGrades: {},
    adverseEffects: '',
    significantAdverseEffects: [],
    protocolUpdate: '',
    notes: '',
  })

  useEffect(() => {
    fetchData()
  }, [patientId])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Get patient info
      const { data: patientData, error: patientError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role, created_at')
        .eq('id', patientId)
        .single()

      if (patientError) throw patientError

      // Get patient's protocols from this clinician
      const { data: protocolsData, error: protocolsError } = await supabase
        .from('protocols')
        .select(`
          id,
          status,
          peptide_id,
          peptide:peptides!protocols_peptide_id_fkey (
            id,
            name
          )
        `)
        .eq('patient_id', patientId)
        .eq('clinician_id', user.id)

      if (protocolsError) throw protocolsError

      // Get active protocol to fetch its symptoms
      const activeProtocol = protocolsData?.find(p => p.status === 'active')
      
      if (activeProtocol?.peptide_id) {
        // Fetch symptoms for this peptide
        const { data: peptideSymptoms, error: symptomsError } = await supabase
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
          .eq('peptide_id', activeProtocol.peptide_id)

        if (symptomsError) throw symptomsError

        // Extract non-SAE symptoms
        const protocolSymptoms = peptideSymptoms
          ?.map(ps => ps.symptom as unknown as Symptom)
          .filter(s => s && !s.is_sae) || []

        setSymptoms(protocolSymptoms)
      } else {
        // Fallback: get all non-SAE symptoms
        const { data: allSymptoms, error: symptomsError } = await supabase
          .from('symptoms')
          .select('*')
          .eq('is_sae', false)
          .order('name')

        if (symptomsError) throw symptomsError
        setSymptoms(allSymptoms || [])
      }

      // Transform protocols
      const protocols = (protocolsData || []).map((protocol) => {
        const peptideData = protocol.peptide as any
        return {
          id: protocol.id,
          status: protocol.status,
          peptide: peptideData
        }
      })

      setPatient({
        ...patientData,
        protocols
      } as Profile)

    } catch (err: any) {
      console.error('Error fetching visit log data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (updates: Partial<VisitFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const setSymptomGrade = (symptomId: string, grade: number) => {
    setFormData(prev => ({
      ...prev,
      symptomGrades: {
        ...prev.symptomGrades,
        [symptomId]: grade,
      },
    }))
  }

  const submitVisit = async () => {
    setSubmitting(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Get active protocol for patient
      const { data: protocolData } = await supabase
        .from('protocols')
        .select('id')
        .eq('patient_id', patientId)
        .eq('clinician_id', user.id)
        .eq('status', 'active')
        .maybeSingle()

      // Create visit
      const { data: visit, error: visitError } = await supabase
        .from('visits')
        .insert({
          patient_id: patientId,
          clinician_id: user.id,
          protocol_id: protocolData?.id || null,
          visit_date: new Date().toISOString(),
          notes: formData.notes || null,
          protocol_update: formData.protocolUpdate || null,
        })
        .select()
        .single()

      if (visitError) throw visitError

      // Create symptom grades
      const symptomPromises = Object.entries(formData.symptomGrades)
        .filter(([_, grade]) => grade > 0)
        .map(([symptomId, grade]) =>
          supabase.from('visit_symptoms').insert({
            visit_id: visit.id,
            symptom_id: symptomId,
            grade: grade,
          })
        )

      await Promise.all(symptomPromises)

      // Create adverse effects if any
      if (formData.adverseEffects) {
        await supabase.from('visit_adverse_effects').insert({
          visit_id: visit.id,
          description: formData.adverseEffects,
          is_significant: false,
        })
      }

      // Create significant adverse effects
      const saePromises = formData.significantAdverseEffects.map((sae) =>
        supabase.from('visit_adverse_effects').insert({
          visit_id: visit.id,
          description: sae,
          is_significant: true,
        })
      )

      await Promise.all(saePromises)

      setSuccess(true)
      setFormData({
        symptomGrades: {},
        adverseEffects: '',
        significantAdverseEffects: [],
        protocolUpdate: '',
        notes: '',
      })

      setTimeout(() => setSuccess(false), 3000)
      return { success: true }
    } catch (err: any) {
      console.error('Error submitting visit:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setSubmitting(false)
    }
  }

  return {
    patient,
    symptoms,
    loading,
    submitting,
    error,
    success,
    formData,
    updateFormData,
    setSymptomGrade,
    submitVisit,
  }
}
