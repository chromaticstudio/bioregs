import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, ArrowLeft } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePortal } from '@/contexts/PortalContext'
import { PORTAL_LABELS } from '@/types/shared'

type Tab = {
  id: string
  label: string
  count?: number
}

type Props = {
  title: string
  tabs?: Tab[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  actionLabel?: string
  onAction?: () => void
  actionIcon?: ReactNode
  onBack?: () => void
}

export function PageHeader({
  title,
  tabs,
  activeTab,
  onTabChange,
  actionLabel,
  onAction,
  actionIcon = <Plus />,
  onBack
}: Props) {
  const { currentPortal } = usePortal()

  return (
    <div className="absolute top-20 z-10 border-b bg-background px-6 -mt-6 w-full">
      <div className="flex items-center justify-between h-14">
        <div className="flex gap-3 items-center h-full">
          <SidebarTrigger />
          {onBack && (
            <Button 
              onClick={onBack}
              variant="ghost" 
              size="icon"
              className="rounded-full"
            >
              <ArrowLeft />
            </Button>
          )}
          
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">{PORTAL_LABELS[currentPortal]}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
                    
          {tabs && tabs.length > 0 && (
            <Tabs value={activeTab} onValueChange={onTabChange}>
              <TabsList>
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                  >
                    {tab.label}
                    {tab.count !== undefined && (
                      <span className="ml-1.5 text-xs text-muted-foreground">
                        ({tab.count})
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
        </div>

        {actionLabel && onAction && (
          <div className="flex items-center">
            <Button onClick={onAction} size="sm">
              {actionIcon}
              {actionLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
