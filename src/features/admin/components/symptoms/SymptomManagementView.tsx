import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingView } from '@/components/ui/loading-view'
import { AlertMessage } from '@/components/ui/alert-message'
import { SymptomForm } from './SymptomForm'
import { SymptomTable } from './SymptomTable'
import { Symptom } from '@/types'

type Props = {
  symptoms: Symptom[]
  loading: boolean
  error: string
  onCreateSymptom: (name: string, description: string, isSae: boolean) => Promise<{ success: boolean; error?: string }>
  onUpdateSymptom: (id: string, name: string, description: string, isSae: boolean) => Promise<{ success: boolean; error?: string }>
  onDeleteSymptom: (id: string) => Promise<{ success: boolean; error?: string }>
}

export function SymptomManagementView({
  symptoms,
  loading,
  error,
  onCreateSymptom,
  onUpdateSymptom,
  onDeleteSymptom,
}: Props) {
  const [activeTab, setActiveTab] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingSymptom, setEditingSymptom] = useState<Symptom | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_sae: false,
  })
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  // Calculate filtered symptoms
  const regularSymptoms = symptoms.filter(s => !s.is_sae)
  const saeSymptoms = symptoms.filter(s => s.is_sae)

  const tabs = [
    { id: 'all', label: 'All Symptoms', count: symptoms.length },
    { id: 'regular', label: 'Regular', count: regularSymptoms.length },
    { id: 'sae', label: 'SAE', count: saeSymptoms.length },
  ]

  const displayedSymptoms =
    activeTab === 'regular'
      ? regularSymptoms
      : activeTab === 'sae'
      ? saeSymptoms
      : symptoms

  const resetForm = () => {
    setFormData({ name: '', description: '', is_sae: false })
    setEditingSymptom(null)
    setShowForm(false)
    setFormError('')
  }

  const handleCreate = () => {
    setEditingSymptom(null)
    setFormData({ name: '', description: '', is_sae: false })
    setShowForm(true)
  }

  const handleEdit = (symptom: Symptom) => {
    setEditingSymptom(symptom)
    setFormData({
      name: symptom.name,
      description: symptom.description || '',
      is_sae: symptom.is_sae ?? false,
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setSaving(true)

    const result = editingSymptom
      ? await onUpdateSymptom(
          editingSymptom.id,
          formData.name,
          formData.description,
          formData.is_sae
        )
      : await onCreateSymptom(
          formData.name,
          formData.description,
          formData.is_sae
        )

    if (result.success) {
      resetForm()
    } else {
      setFormError(result.error || 'An error occurred')
    }

    setSaving(false)
  }

  // REMOVED confirm() - now handled by SymptomTable with ConfirmDelete dialog
  const handleDelete = async (id: string) => {
    const result = await onDeleteSymptom(id)

    if (!result.success) {
      alert(result.error || 'Failed to delete symptom')
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Symptoms" />
        <LoadingView />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Symptoms"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        actionLabel="Add Symptom"
        onAction={handleCreate}
      />

      <AlertMessage message={error} />

      <SymptomForm
        open={showForm}
        isEditing={!!editingSymptom}
        formData={formData}
        error={formError}
        saving={saving}
        onClose={resetForm}
        onChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
        onSubmit={handleSubmit}
      />

      <SymptomTable
        symptoms={displayedSymptoms}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </PageContainer>
  )
}