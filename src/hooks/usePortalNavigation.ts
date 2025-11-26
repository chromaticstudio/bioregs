import { useState, useCallback } from 'react'
import { PortalView } from '@/types/shared'
import { LayoutDashboard, Users, Pill, Activity, FileText, ClipboardCheck, LucideIcon } from 'lucide-react'

type NavItem = {
  title: string
  icon: LucideIcon
  active: boolean
  onClick?: () => void
}

type PortalState = {
  currentPage: string
  selectedPatientId: string | null
  showPatientCheckIn: boolean 
}

export function usePortalNavigation(portal: PortalView) {
  const [state, setState] = useState<PortalState>({
    currentPage: 'dashboard',
    selectedPatientId: null,
    showPatientCheckIn: false
  })

  const navigateTo = useCallback((page: string) => {
    setState(prev => ({ ...prev, currentPage: page }))
  }, [])

  const logVisit = useCallback((patientId: string) => {
    setState({ currentPage: 'visit-log', selectedPatientId: patientId, showPatientCheckIn: false })
  }, [])

  const backToPatients = useCallback(() => {
    setState({ currentPage: 'patients', selectedPatientId: null, showPatientCheckIn: false })
  }, [])

  // NEW - simple setter for check-in visibility
  const setShowCheckIn = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showPatientCheckIn: show }))
  }, [])

  const getNavItems = useCallback((): NavItem[] => {
    const { currentPage, showPatientCheckIn } = state

    switch (portal) {
      case 'admin':
        return [
          { title: 'Dashboard', icon: LayoutDashboard, active: currentPage === 'dashboard', onClick: () => navigateTo('dashboard') },
          { title: 'Users', icon: Users, active: currentPage === 'users', onClick: () => navigateTo('users') },
          { title: 'Peptides', icon: Pill, active: currentPage === 'peptides', onClick: () => navigateTo('peptides') },
          { title: 'Symptoms', icon: Activity, active: currentPage === 'symptoms', onClick: () => navigateTo('symptoms') }
        ]
      
      case 'clinician':
        return [
          { title: 'Dashboard', icon: LayoutDashboard, active: currentPage === 'dashboard', onClick: () => navigateTo('dashboard') },
          { title: 'Protocols', icon: FileText, active: currentPage === 'protocols', onClick: () => navigateTo('protocols') },
          { title: 'Patients', icon: Users, active: currentPage === 'patients', onClick: () => navigateTo('patients') }
        ]
      
      case 'patient': {
        const baseItems = [
          { title: 'Dashboard', icon: LayoutDashboard, active: currentPage === 'dashboard' && !showPatientCheckIn, onClick: () => navigateTo('dashboard') },
          { title: 'Peptides', icon: Pill, active: currentPage === 'peptides' && !showPatientCheckIn, onClick: () => navigateTo('peptides') }
        ]

        // Only show Check-In when boolean is true
        if (showPatientCheckIn) {
          baseItems.push({
            title: 'Check-In',
            icon: ClipboardCheck,
            active: true
          })
        }

        return baseItems
      }
      
      default:
        return []
    }
  }, [portal, state, navigateTo])

  return {
    currentPage: state.currentPage,
    selectedPatientId: state.selectedPatientId,
    navItems: getNavItems(),
    navigateTo,
    logVisit,
    backToPatients,
    setShowCheckIn
  }
}
