import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingView } from '@/components/ui/loading-view'
import { AlertMessage } from '@/components/ui/alert-message'
import { VisitLogForm } from './VisitLogForm'
import { Symptom, Profile } from '@/types'
import { VisitFormData } from '@/types'

interface Props {
  patient: Profile | null
  symptoms: Symptom[]
  loading: boolean
  submitting: boolean
  error: string
  success: boolean
  formData: VisitFormData
  onFormChange: (updates: Partial<VisitFormData>) => void
  onSymptomGrade: (symptomId: string, grade: number) => void
  onSubmit: () => Promise<{ success: boolean; error?: string }>
  onBack: () => void
}

export function VisitLogView({
  patient,
  symptoms,
  loading,
  submitting,
  error,
  success,
  formData,
  onFormChange,
  onSymptomGrade,
  onSubmit,
  onBack,
}: Props) {
  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Log Visit"  onBack={onBack} />
        <LoadingView />
      </PageContainer>
    )
  }

  if (!patient) {
    return (
      <PageContainer>
        <PageHeader title="Log Visit" onBack={onBack} />
        <p className="text-muted-foreground">Patient not found</p>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader 
        title={`Log Visit: ${patient.first_name} ${patient.last_name}`}
        onBack={onBack}
      />

      <AlertMessage message={error} />
      {success && <AlertMessage message="Visit logged successfully!" variant='success' />}

      <VisitLogForm
        symptoms={symptoms}
        formData={formData}
        submitting={submitting}
        onFormChange={onFormChange}
        onSymptomGrade={onSymptomGrade}
        onSubmit={onSubmit}
      />
    </PageContainer>
  )
}
