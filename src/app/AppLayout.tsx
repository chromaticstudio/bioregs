import { ReactNode } from 'react'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { TopNav } from '@/components/layout/TopNav'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { UserRole, PortalView } from '@/types/shared'
import { LucideIcon } from 'lucide-react'

type NavItem = {
  title: string
  icon: LucideIcon
  active: boolean
  onClick?: () => void
}

type Props = {
  currentPortal: PortalView
  userRole: UserRole
  onPortalChange: (portal: PortalView) => void
  navItems: NavItem[]
  children: ReactNode
}

export function AppLayout({
  currentPortal,
  userRole,
  onPortalChange,
  navItems,
  children,
}: Props) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar navItems={navItems} />
        
        <SidebarInset className="flex-1 flex flex-col">
          <TopNav
            currentPortal={currentPortal}
            userRole={userRole}
            onPortalChange={onPortalChange}
          />
          
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
