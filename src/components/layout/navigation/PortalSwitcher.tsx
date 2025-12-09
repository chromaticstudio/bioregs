import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Check } from 'lucide-react'
import { UserRole, PortalView, PORTAL_LABELS } from '@/types/shared'

type Props = {
  currentPortal: PortalView
  userRole: UserRole
  onPortalChange: (portal: PortalView) => void
}

export function PortalSwitcher({ currentPortal, userRole, onPortalChange }: Props) {
  const currentLabel = PORTAL_LABELS[currentPortal]

  // Only admins can switch portals
  if (userRole !== 'admin') {
    return (
      <span className="text-sm font-medium text-muted-foreground">
        {currentLabel}
      </span>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-accent px-3 py-2 rounded-md transition-colors">
        <span className="text-sm font-medium">{currentLabel}</span>
        <ChevronDown className="text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {(Object.entries(PORTAL_LABELS) as [PortalView, string][]).map(([role, label]) => (
          <DropdownMenuItem
            key={role}
            onClick={() => onPortalChange(role)}
            className="flex items-center justify-between"
          >
            {label}
            {currentPortal === role && <Check />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
