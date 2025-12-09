import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Symptom } from '@/types'

export function useSymptoms() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchSymptoms = async () => {
    setLoading(true)
    setError('')

    try {
      const { data, error: fetchError } = await supabase
        .from('symptoms')
        .select('*')
        .order('is_sae', { ascending: true })
        .order('name')

      if (fetchError) throw fetchError

      setSymptoms(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createSymptom = async (name: string, description: string, isSae: boolean) => {
    try {
      const { error } = await supabase
        .from('symptoms')
        .insert({ name, description, is_sae: isSae })

      if (error) throw error

      await fetchSymptoms()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const updateSymptom = async (id: string, name: string, description: string, isSae: boolean) => {
    try {
      const { error } = await supabase
        .from('symptoms')
        .update({ name, description, is_sae: isSae })
        .eq('id', id)

      if (error) throw error

      await fetchSymptoms()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const deleteSymptom = async (id: string) => {
    try {
      const { error } = await supabase
        .from('symptoms')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchSymptoms()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  useEffect(() => {
    fetchSymptoms()
  }, [])

  const regularSymptoms = symptoms.filter(s => !s.is_sae)
  const saeSymptoms = symptoms.filter(s => s.is_sae)

  return {
    symptoms,
    regularSymptoms,
    saeSymptoms,
    loading,
    error,
    createSymptom,
    updateSymptom,
    deleteSymptom,
    refresh: fetchSymptoms
  }
}
