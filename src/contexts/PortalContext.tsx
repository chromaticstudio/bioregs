import { createContext, useContext, ReactNode } from 'react'
import { PortalView } from '@/types/shared'

type PortalContextType = {
  currentPortal: PortalView
}

const PortalContext = createContext<PortalContextType | null>(null)

export function PortalProvider({ 
  currentPortal, 
  children 
}: { 
  currentPortal: PortalView
  children: ReactNode 
}) {
  return (
    <PortalContext.Provider value={{ currentPortal }}>
      {children}
    </PortalContext.Provider>
  )
}

export function usePortal() {
  const context = useContext(PortalContext)
  if (!context) {
    throw new Error('usePortal must be used within PortalProvider')
  }
  return context
}
