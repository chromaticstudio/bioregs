import { UserMenu } from './navigation/UserMenu'
import { PortalSwitcher } from './navigation/PortalSwitcher'
import { Logo } from '@/assets/logo'
import { UserRole, PortalView } from '@/types/shared'

type Props = {
  currentPortal: PortalView
  userRole: UserRole
  onPortalChange: (portal: PortalView) => void
}

export function TopNav({ currentPortal, userRole, onPortalChange }: Props) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-14 border-b bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Logo />
        
        <PortalSwitcher 
          currentPortal={currentPortal} 
          userRole={userRole}
          onPortalChange={onPortalChange} 
        />
      </div>
      
      <UserMenu />
    </div>
  )
}
