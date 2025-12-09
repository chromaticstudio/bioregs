import { PortalView } from '@/types/shared'

// Admin
import { Dashboard as AdminDashboard } from '@/features/admin/pages/Dashboard'
import { UserManagement } from '@/features/admin/pages/UserManagement'
import { PeptideManagement } from '@/features/admin/pages/PeptideManagement'
import { SymptomManagement } from '@/features/admin/pages/SymptomManagement'

// Clinician
import { Dashboard as ClinicianDashboard } from '@/features/clinician/pages/Dashboard'
import { ProtocolList } from '@/features/clinician/pages/ProtocolList'
import { PatientList } from '@/features/clinician/pages/PatientList'
import { VisitLog } from '@/features/clinician/pages/VisitLog'

// Patient
import { Dashboard as PatientDashboard } from '@/features/patient/pages/Dashboard'
import { Peptides } from '@/features/patient/pages/Peptides'

type Props = {
  portal: PortalView
  currentPage: string
  selectedPatientId: string | null
  onNavigate: (page: string) => void
  onLogVisit: (patientId: string) => void
  onBackToPatients: () => void
  onSetShowCheckIn?: (show: boolean) => void
}

export function PortalRouter({ 
  portal, 
  currentPage, 
  selectedPatientId,
  onNavigate,
  onLogVisit,
  onBackToPatients,
  onSetShowCheckIn
}: Props) {
  // Admin Portal
  if (portal === 'admin') {
    switch (currentPage) {
      case 'users': return <UserManagement />
      case 'peptides': return <PeptideManagement />
      case 'symptoms': return <SymptomManagement />
      default: return <AdminDashboard onNavigate={onNavigate} />
    }
  }

  // Clinician Portal
  if (portal === 'clinician') {
    switch (currentPage) {
      case 'protocols': return <ProtocolList />
      case 'patients': return <PatientList onLogVisit={onLogVisit} />
      case 'visit-log': 
        return selectedPatientId ? (
          <VisitLog patientId={selectedPatientId} onBack={onBackToPatients} />
        ) : null
      default: return <ClinicianDashboard onNavigate={onNavigate} />
    }
  }

  // Patient Portal
  switch (currentPage) {
    case 'peptides': return <Peptides onSetShowCheckIn={onSetShowCheckIn} />
    default: return <PatientDashboard onSetShowCheckIn={onSetShowCheckIn} />
  }
}
