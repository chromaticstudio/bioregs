import { useTheme } from '@/contexts/ThemeContext'
import { ButtonGroup } from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'
import { Monitor, Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <ButtonGroup>
      <Button 
        variant={theme === 'system' ? 'outline' : 'secondary'}
        size="sm"
        onClick={() => setTheme('system')}
        aria-label="System theme"
      >
        <Monitor />
      </Button>
      <Button 
        variant={theme === 'light' ? 'outline' : 'secondary'}
        size="sm"
        onClick={() => setTheme('light')}
        aria-label="Light theme"
      >
        <Sun />
      </Button>
      <Button 
        variant={theme === 'dark' ? 'outline' : 'secondary'}
        size="sm"
        onClick={() => setTheme('dark')}
        aria-label="Dark theme"
      >
        <Moon />
      </Button>
    </ButtonGroup>
  )
}
