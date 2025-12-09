export type UserRole = 'admin' | 'clinician' | 'patient'
export type PortalView = 'admin' | 'clinician' | 'patient'

export const PORTAL_LABELS: Record<PortalView, string> = {
  admin: 'Admin Portal',
  clinician: 'Clinician Portal',
  patient: 'Patient Portal'
}

// Base profile type (used by all user types)
export type Profile = {
  id: string
  first_name: string
  last_name: string
  role: UserRole
  email?: string
  created_at: string
}
