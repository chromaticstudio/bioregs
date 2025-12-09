import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingView } from '@/components/ui/loading-view'
import { AlertMessage } from '@/components/ui/alert-message'
import { PeptideForm } from './PeptideForm'
import { PeptideTable } from './PeptideTable'
import { Peptide, Symptom } from '@/types'

type Props = {
  peptides: Peptide[]
  symptoms: Symptom[]
  loading: boolean
  error: string
  onCreatePeptide: (name: string, description: string, dosage_amount: string, dosage_unit: string, time_of_day: string, symptomIds: string[]) => Promise<{ success: boolean; error?: string }>
  onUpdatePeptide: (id: string, name: string, description: string, dosage_amount: string, dosage_unit: string, time_of_day: string, symptomIds: string[]) => Promise<{ success: boolean; error?: string }>
  onDeletePeptide: (id: string) => Promise<{ success: boolean; error?: string }>
}

export function PeptideManagementView({
  peptides,
  symptoms,
  loading,
  error,
  onCreatePeptide,
  onUpdatePeptide,
  onDeletePeptide,
}: Props) {
  const [showForm, setShowForm] = useState(false)
  const [editingPeptide, setEditingPeptide] = useState<Peptide | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dosage_amount: '',
    dosage_unit: '',
    time_of_day: '',
    symptomIds: [] as string[]
  })
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const resetForm = () => {
    setFormData({ name: '', description: '', dosage_amount: '', dosage_unit: '', time_of_day: '', symptomIds: [] })
    setEditingPeptide(null)
    setShowForm(false)
    setFormError('')
  }

  const handleEdit = (peptide: Peptide) => {
    setEditingPeptide(peptide)
    setFormData({
      name: peptide.name,
      description: peptide.description || '',
      dosage_amount: peptide.dosage_amount,
      dosage_unit: peptide.dosage_unit,
      time_of_day: peptide.time_of_day || '',
      symptomIds: (peptide.symptoms ?? []).map(s => s.id)
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setSaving(true)

    const result = editingPeptide
      ? await onUpdatePeptide(editingPeptide.id, formData.name, formData.description, formData.dosage_amount, formData.dosage_unit, formData.time_of_day, formData.symptomIds)
      : await onCreatePeptide(formData.name, formData.description, formData.dosage_amount, formData.dosage_unit, formData.time_of_day, formData.symptomIds)

    if (result.success) {
      resetForm()
    } else {
      setFormError(result.error || 'An error occurred')
    }

    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    const result = await onDeletePeptide(id)
    
    if (!result.success) {
      alert(result.error || 'Failed to delete peptide')
    }
  }

  const handleFormChange = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const toggleSymptom = (symptomId: string) => {
    setFormData(prev => ({
      ...prev,
      symptomIds: prev.symptomIds.includes(symptomId)
        ? prev.symptomIds.filter(id => id !== symptomId)
        : [...prev.symptomIds, symptomId]
    }))
  }

  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Peptides" />
        <LoadingView />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Peptides"
        actionLabel="Add Peptide"
        onAction={() => setShowForm(true)}
      />

      <AlertMessage message={error} />

      <PeptideForm
        open={showForm}
        isEditing={!!editingPeptide}
        formData={formData}
        symptoms={symptoms}
        error={formError}
        saving={saving}
        onClose={resetForm}
        onChange={handleFormChange}
        onToggleSymptom={toggleSymptom}
        onSubmit={handleSubmit}
      />

      <PeptideTable
        peptides={peptides}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </PageContainer>
  )
}
