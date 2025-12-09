import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingView } from '@/components/ui/loading-view'
import { AlertMessage } from '@/components/ui/alert-message'
import { ProtocolForm } from './ProtocolForm'
import { ProtocolTable } from './ProtocolTable'
import { AssignPatientForm } from './AssignPatientForm'
import { Protocol, Peptide, Profile } from '@/types'

interface Props {
  protocols: Protocol[]
  peptides: Peptide[]
  patients: Profile[]
  loading: boolean
  error: string
  onAssignPatient: (protocolId: string, patientId: string) => Promise<{ success: boolean; error?: string }>
  onCreateProtocol: (data: {
    peptide_id: string
    frequency: string
    duration: string
    notes: string
  }) => Promise<{ success: boolean; error?: string }>
}

export function ProtocolListView({ 
  protocols, 
  peptides,
  patients,
  loading, 
  error, 
  onAssignPatient,
  onCreateProtocol 
}: Props) {
  // Create protocol modal state
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createFormData, setCreateFormData] = useState({
    peptide_id: '',
    frequency: '',
    duration: '',
    notes: ''
  })
  const [createFormError, setCreateFormError] = useState('')
  const [creating, setCreating] = useState(false)

  // Assign patient modal state
  const [showAssignForm, setShowAssignForm] = useState(false)
  const [assigningProtocolId, setAssigningProtocolId] = useState<string | null>(null)
  const [selectedPatientId, setSelectedPatientId] = useState('')
  const [assignFormError, setAssignFormError] = useState('')
  const [assigning, setAssigning] = useState(false)

  const resetCreateForm = () => {
    setCreateFormData({
      peptide_id: '',
      frequency: '',
      duration: '',
      notes: ''
    })
    setShowCreateForm(false)
    setCreateFormError('')
  }

  const resetAssignForm = () => {
    setSelectedPatientId('')
    setAssigningProtocolId(null)
    setShowAssignForm(false)
    setAssignFormError('')
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateFormError('')
    setCreating(true)

    const result = await onCreateProtocol(createFormData)

    if (result.success) {
      resetCreateForm()
    } else {
      setCreateFormError(result.error || 'An error occurred')
    }

    setCreating(false)
  }

  const handleAssignClick = (protocolId: string, currentPatientId: string | null) => {
    setAssigningProtocolId(protocolId)
    setSelectedPatientId(currentPatientId || '')
    setShowAssignForm(true)
  }

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!assigningProtocolId || !selectedPatientId) return

    setAssignFormError('')
    setAssigning(true)

    const result = await onAssignPatient(assigningProtocolId, selectedPatientId)

    if (result.success) {
      resetAssignForm()
    } else {
      setAssignFormError(result.error || 'An error occurred')
    }

    setAssigning(false)
  }

  const handleFormChange = (updates: Partial<typeof createFormData>) => {
    setCreateFormData(prev => ({ ...prev, ...updates }))
  }

  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Protocols" />
        <LoadingView />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Protocols"
        actionLabel="Create Protocol"
        onAction={() => setShowCreateForm(true)}
      />

      <AlertMessage message={error} />

      <ProtocolForm
        open={showCreateForm}
        isEditing={false}
        formData={createFormData}
        peptides={peptides}
        error={createFormError}
        saving={creating}
        onClose={resetCreateForm}
        onChange={handleFormChange}
        onSubmit={handleCreateSubmit}
      />

      <AssignPatientForm
        open={showAssignForm}
        patients={patients}
        selectedPatientId={selectedPatientId}
        error={assignFormError}
        saving={assigning}
        onClose={resetAssignForm}
        onPatientChange={setSelectedPatientId}
        onSubmit={handleAssignSubmit}
      />

      <ProtocolTable
        protocols={protocols}
        onAssignPatient={handleAssignClick}
      />
    </PageContainer>
  )
}
