import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingView } from '@/components/ui/loading-view'
import { AlertMessage } from '@/components/ui/alert-message'
import { PatientTable } from './PatientTable'
import { InvitationTable } from './InvitationTable'
import { InvitePatientForm } from './InvitePatientForm'
import { Profile, PatientInvitation } from '@/types'


type Props = {
  patients: Profile[]
  invitations: PatientInvitation[]
  loading: boolean
  error: string
  onLogVisit: (patientId: string) => void
  onSendInvitation: (email: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string; inviteLink?: string }>
  onResendInvitation: (id: string) => Promise<{ success: boolean; error?: string; inviteLink?: string }>
  onCancelInvitation: (id: string) => Promise<{ success: boolean; error?: string }>
}

export function PatientListView({ 
  patients, 
  invitations,
  loading, 
  error,
  onLogVisit,
  onSendInvitation,
  onResendInvitation,
  onCancelInvitation
}: Props) {
  const [activeTab, setActiveTab] = useState('enrolled')
  
  // Invite modal state
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviteFormData, setInviteFormData] = useState({
    email: '',
    firstName: '',
    lastName: ''
  })
  const [inviteFormError, setInviteFormError] = useState('')
  const [sending, setSending] = useState(false)
  const [lastInviteLink, setLastInviteLink] = useState('')
  const [copied, setCopied] = useState(false)

  const pendingInvitations = invitations.filter(i => i.status === 'pending')

  const resetInviteForm = () => {
    setInviteFormData({ email: '', firstName: '', lastName: '' })
    setShowInviteForm(false)
    setInviteFormError('')
    setLastInviteLink('')
  }

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviteFormError('')
    setSending(true)

    const result = await onSendInvitation(
      inviteFormData.email, 
      inviteFormData.firstName, 
      inviteFormData.lastName
    )

    if (result.success) {
      setLastInviteLink(result.inviteLink || '')
      setInviteFormData({ email: '', firstName: '', lastName: '' })
    } else {
      setInviteFormError(result.error || 'An error occurred')
    }

    setSending(false)
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(lastInviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFormChange = (updates: Partial<typeof inviteFormData>) => {
    setInviteFormData(prev => ({ ...prev, ...updates }))
  }

  const handleResend = async (id: string) => {
    const result = await onResendInvitation(id)
    if (result.success && result.inviteLink) {
      await navigator.clipboard.writeText(result.inviteLink)
      alert('Invitation resent! Link copied to clipboard.')
    }
  }

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this invitation?')) return
    await onCancelInvitation(id)
  }

  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Patients" />
        <LoadingView />
      </PageContainer>
    )
  }

  const tabs = [
    { id: 'enrolled', label: 'Enrolled', count: patients.length },
    { id: 'invitations', label: 'Invitations', count: pendingInvitations.length }
  ]

  return (
    <PageContainer>
      <PageHeader
        title="Patients"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        actionLabel="Invite Patient"
        onAction={() => setShowInviteForm(true)}
      />

      <AlertMessage message={error} />

      <InvitePatientForm
        open={showInviteForm}
        formData={inviteFormData}
        error={inviteFormError}
        saving={sending}
        lastInviteLink={lastInviteLink}
        copied={copied}
        onClose={resetInviteForm}
        onChange={handleFormChange}
        onSubmit={handleInviteSubmit}
        onCopyLink={handleCopyLink}
      />

      {activeTab === 'enrolled' && (
        <PatientTable
          patients={patients}
          onLogVisit={onLogVisit}
        />
      )}

      {activeTab === 'invitations' && (
        <InvitationTable
          invitations={invitations}
          onResend={handleResend}
          onCancel={handleCancel}
        />
      )}
    </PageContainer>
  )
}
