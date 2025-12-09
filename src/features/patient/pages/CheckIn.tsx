import { CheckInView } from '../components/checkin/CheckInView'
import { useCheckIn } from '../hooks/useCheckIn'

interface Props {
  protocolId: string
  onBack: () => void
}

export function CheckIn({ protocolId, onBack }: Props) {
  const {
    protocol,
    symptoms,
    saeSymptoms,
    loading,
    submitting,
    error,
    success,
    formData,
    updateFormData,
    setSymptomRating,
    submitCheckIn,
  } = useCheckIn(protocolId)

  return (
    <CheckInView
      protocol={protocol}
      symptoms={symptoms}
      saeSymptoms={saeSymptoms}
      loading={loading}
      submitting={submitting}
      error={error}
      success={success}
      formData={formData}
      onFormChange={updateFormData}
      onSymptomRating={setSymptomRating}
      onSubmit={submitCheckIn}
      onBack={onBack}
    />
  )
}
