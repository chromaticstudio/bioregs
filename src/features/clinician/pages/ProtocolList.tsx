import { ProtocolListView } from '../components/protocols/ProtocolListView'
import { useProtocols } from '../hooks/useProtocols'
import { usePatients } from '../hooks/usePatients'

export function ProtocolList() {
  const {
    protocols,
    peptides,
    loading: protocolsLoading,
    error: protocolsError,
    createProtocol,
    assignPatient,
  } = useProtocols()

  const {
    patients,
    loading: patientsLoading,
    error: patientsError,
  } = usePatients()

  const loading = protocolsLoading || patientsLoading
  const error = protocolsError || patientsError

  return (
    <ProtocolListView
      protocols={protocols}
      peptides={peptides}
      patients={patients || []}
      loading={loading}
      error={error}
      onCreateProtocol={createProtocol}
      onAssignPatient={assignPatient}
    />
  )
}
