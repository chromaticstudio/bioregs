import { SymptomManagementView } from '../components/symptoms/SymptomManagementView'
import { useSymptoms } from '../hooks/useSymptoms'

export function SymptomManagement() {
  const {
    symptoms,
    loading,
    error,
    createSymptom,
    updateSymptom,
    deleteSymptom,
  } = useSymptoms()

  return (
    <SymptomManagementView
      symptoms={symptoms}
      loading={loading}
      error={error}
      onCreateSymptom={createSymptom}
      onUpdateSymptom={updateSymptom}
      onDeleteSymptom={deleteSymptom}
    />
  )
}
