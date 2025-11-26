import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingView } from '@/components/ui/loading-view'
import { ErrorAlert } from '@/components/ui/error-alert'
import { SuccessAlert } from '@/components/ui/success-alert'
import { VisitLogForm } from './VisitLogForm'
import type { Symptom, Profile } from '@/types/database'
import type { VisitFormData } from '@/types/forms'

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

      <ErrorAlert message={error} />
      {success && <SuccessAlert message="Visit logged successfully!" />}

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
