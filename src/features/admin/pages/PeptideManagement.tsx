import { PeptideManagementView } from '../components/peptides/PeptideManagementView'
import { usePeptides } from '../hooks/usePeptides'

export function PeptideManagement() {
  const {
    peptides,
    symptoms,
    loading,
    error,
    createPeptide,
    updatePeptide,
    deletePeptide,
  } = usePeptides()

  return (
    <PeptideManagementView
      peptides={peptides}
      symptoms={symptoms}
      loading={loading}
      error={error}
      onCreatePeptide={createPeptide}
      onUpdatePeptide={updatePeptide}
      onDeletePeptide={deletePeptide}
    />
  )
}
