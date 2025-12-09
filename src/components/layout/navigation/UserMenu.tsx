import { useAuth } from '@/contexts/AuthContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

export function UserMenu() {
  const { user, signOut } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-accent px-3 py-2 rounded-md transition-colors">
        <div className="text-right">
          <div className="text-sm font-medium">
            {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
          </div>
          <div className="text-xs text-muted-foreground">
            {user?.email}
          </div>
        </div>
        <ChevronDown className="text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="text-muted-foreground">
          Profile Settings (Coming Soon)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        
        {/* Theme Section */}
        <div className="px-2 py-2">
          <p className="text-sm font-medium mb-2">Theme</p>
          <ThemeToggle />
        </div>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
