import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { AppLayout } from './AppLayout'
import { PortalRouter } from './PortalRouter'
import { usePortalNavigation } from '@/hooks/usePortalNavigation'
import { UserRole, PortalView } from '@/types/shared'
import { PortalProvider } from '@/contexts/PortalContext'
import { Auth } from '@/features/auth/pages/Auth'
import { LoadingView } from '@/components/ui/loading-view'

function AuthenticatedApp() {
  const { user } = useAuth()
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [currentPortal, setCurrentPortal] = useState<PortalView | null>(null)

  // Fetch user's role
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (data && !error) {
        setUserRole(data.role)
        setCurrentPortal(data.role as PortalView)
      }
    }

    fetchUserRole()
  }, [user])

  const navigation = usePortalNavigation(currentPortal || 'patient')

  if (!userRole || !currentPortal) {
    return <LoadingView />
  }

  return (
    <AppLayout
      currentPortal={currentPortal}
      userRole={userRole}
      onPortalChange={setCurrentPortal}
      navItems={navigation.navItems}
    >
      <PortalProvider currentPortal={currentPortal}>
        <PortalRouter
          portal={currentPortal}
          currentPage={navigation.currentPage}
          selectedPatientId={navigation.selectedPatientId}
          onNavigate={navigation.navigateTo}
          onLogVisit={navigation.logVisit}
          onBackToPatients={navigation.backToPatients}
          onSetShowCheckIn={navigation.setShowCheckIn} 
        />
      </PortalProvider>
    </AppLayout>
  )
}

export function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingView />
  }

  return user ? <AuthenticatedApp /> : <Auth />
}
