import { PatientListView } from '../components/patients/PatientListView'
import { usePatients } from '../hooks/usePatients'

export function PatientList({ onLogVisit }: { onLogVisit: (patientId: string) => void }) {
  const {
    patients,
    invitations,
    loading,
    error,
    sendInvitation,
    resendInvitation,
    cancelInvitation,
  } = usePatients()

  return (
    <PatientListView
      patients={patients}
      invitations={invitations}
      loading={loading}
      error={error}
      onLogVisit={onLogVisit}
      onSendInvitation={sendInvitation}
      onResendInvitation={resendInvitation}
      onCancelInvitation={cancelInvitation}
    />
  )
}
