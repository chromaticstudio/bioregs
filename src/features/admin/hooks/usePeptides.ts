import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Peptide, Symptom } from '@/types'

export function usePeptides() {
  const [peptides, setPeptides] = useState<Peptide[]>([])
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPeptides = async () => {
    setLoading(true)
    setError('')

    try {
      // UPDATED: Join peptide_symptoms and symptoms
      const { data: peptidesData, error: peptidesError } = await supabase
        .from('peptides')
        .select(`
          *,
          peptide_symptoms (
            symptom:symptoms (
              id,
              name,
              description,
              is_sae
            )
          )
        `)
        .order('name')

      if (peptidesError) throw peptidesError

      // Transform the data to match our Peptide type
      const transformedPeptides = peptidesData?.map(peptide => ({
        ...peptide,
        symptoms: peptide.peptide_symptoms
          ?.map((ps: any) => ps.symptom)
          .filter((s: any) => s !== null) || []
      })) || []

      const { data: symptomsData, error: symptomsError } = await supabase
        .from('symptoms')
        .select('*')
        .order('name')

      if (symptomsError) throw symptomsError

      setPeptides(transformedPeptides)
      setSymptoms(symptomsData || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createPeptide = async (name: string, description: string, dosage_amount: string, dosage_unit: string, time_of_day: string, symptomIds: string[]) => {
    try {
      const { data: peptide, error: peptideError } = await supabase
        .from('peptides')
        .insert({
          name,
          description,
          dosage_amount,
          dosage_unit,
          time_of_day: time_of_day || null
        })
        .select()
        .single()

      if (peptideError) throw peptideError

      if (symptomIds.length > 0) {
        const relations = symptomIds.map(symptomId => ({
          peptide_id: peptide.id,
          symptom_id: symptomId
        }))

        const { error: relationsError } = await supabase
          .from('peptide_symptoms')
          .insert(relations)

        if (relationsError) throw relationsError
      }

      await fetchPeptides()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const updatePeptide = async (id: string, name: string, description: string, dosage_amount: string, dosage_unit: string, time_of_day: string, symptomIds: string[]) => {
    try {
      const { error: peptideError } = await supabase
        .from('peptides')
        .update({
          name,
          description,
          dosage_amount,
          dosage_unit,
          time_of_day: time_of_day || null
        })
        .eq('id', id)

      if (peptideError) throw peptideError

      const { error: deleteError } = await supabase
        .from('peptide_symptoms')
        .delete()
        .eq('peptide_id', id)

      if (deleteError) throw deleteError

      if (symptomIds.length > 0) {
        const relations = symptomIds.map(symptomId => ({
          peptide_id: id,
          symptom_id: symptomId
        }))

        const { error: relationsError } = await supabase
          .from('peptide_symptoms')
          .insert(relations)

        if (relationsError) throw relationsError
      }

      await fetchPeptides()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const deletePeptide = async (id: string) => {
    try {
      const { error } = await supabase
        .from('peptides')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchPeptides()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  useEffect(() => {
    fetchPeptides()
  }, [])

  // Only return non-SAE symptoms for peptide associations
  const availableSymptoms = symptoms.filter(s => !s.is_sae)

  return {
    peptides,
    symptoms: availableSymptoms,
    loading,
    error,
    createPeptide,
    updatePeptide,
    deletePeptide,
    refresh: fetchPeptides
  }
}