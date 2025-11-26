import { 
  Sidebar, 
  SidebarContent,
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem 
} from '@/components/ui/sidebar'
import { LucideIcon } from 'lucide-react'

type NavItem = {
  title: string
  icon: LucideIcon
  active: boolean
  onClick?: () => void
}

type Props = {
  navItems: NavItem[]
}

export function AppSidebar({ navItems }: Props) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu className="p-4 gap-2">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                onClick={item.onClick}
                isActive={item.active}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
