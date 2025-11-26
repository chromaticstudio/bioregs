import { VisitLogView } from '../components/visits/VisitLogView'
import { useVisitLog } from '../hooks/useVisitLog'

interface Props {
  patientId: string
  onBack: () => void
}

export function VisitLog({ patientId, onBack }: Props) {
  const {
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
  } = useVisitLog(patientId)

  return (
    <VisitLogView
      patient={patient}
      symptoms={symptoms}
      loading={loading}
      submitting={submitting}
      error={error}
      success={success}
      formData={formData}
      onFormChange={updateFormData}
      onSymptomGrade={setSymptomGrade}
      onSubmit={submitVisit}
      onBack={onBack}
    />
  )
}
