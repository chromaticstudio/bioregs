import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingView } from '@/components/ui/loading-view'
import { AlertMessage } from '@/components/ui/alert-message'
import {
  Card,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { CheckInForm } from './CheckInForm'
import { Symptom, Protocol } from '@/types'
import { CheckInFormData } from '@/types'

interface Props {
  symptoms: Symptom[]
  saeSymptoms: Symptom[]
  protocol: Protocol | null
  loading: boolean
  submitting: boolean
  error: string
  success: boolean
  formData: CheckInFormData
  onFormChange: (updates: Partial<CheckInFormData>) => void
  onSymptomRating: (symptomId: string, rating: number) => void
  onSubmit: () => Promise<{ success: boolean; error?: string }>
  onBack?: () => void
}

export function CheckInView({
  symptoms,
  saeSymptoms,
  protocol,
  loading,
  submitting,
  error,
  success,
  formData,
  onFormChange,
  onSymptomRating,
  onSubmit,
  onBack,
}: Props) {
  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Daily Check-In"  onBack={onBack} />
        <LoadingView />
      </PageContainer>
    )
  }

  if (!protocol) {
    return (
      <PageContainer>
        <PageHeader title="Daily Check-In" onBack={onBack} />
        <Card>
          <CardHeader>
            <CardDescription>No active protocol assigned. Please contact your clinician.</CardDescription>
          </CardHeader>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader title="Daily Check-In" onBack={onBack} />

      <AlertMessage message={error} />
      {success && <AlertMessage message="Check-in submitted successfully!" />}

      <CheckInForm
        symptoms={symptoms}
        saeSymptoms={saeSymptoms}
        protocol={protocol}
        formData={formData}
        submitting={submitting}
        onFormChange={onFormChange}
        onSymptomRating={onSymptomRating}
        onSubmit={onSubmit}
      />
    </PageContainer>
  )
}
