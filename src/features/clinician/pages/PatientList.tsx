import { PatientListView } from '../components/patients/PatientListView'
import { usePatients } from '../hooks/usePatients'
import { usePatientInvitations } from '../hooks/usePatientInvitations'

export function PatientList({ onLogVisit }: { onLogVisit: (patientId: string) => void }) {
  const {
    patients,
    loading: patientsLoading,
    error: patientsError,
  } = usePatients()

  const {
    invitations,
    loading: invitationsLoading,
    error: invitationsError,
    sendInvitation,
    resendInvitation,
    cancelInvitation,
  } = usePatientInvitations()

  return (
    <PatientListView
      patients={patients}
      invitations={invitations}
      loading={patientsLoading || invitationsLoading}
      error={patientsError || invitationsError}
      onLogVisit={onLogVisit}
      onSendInvitation={sendInvitation}
      onResendInvitation={resendInvitation}
      onCancelInvitation={cancelInvitation}
    />
  )
}
