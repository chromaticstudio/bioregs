export type ProtocolStatus = 'active' | 'completed' | 'paused'
export type InviteStatus = 'pending' | 'accepted' | 'declined'
export type UserRole = 'admin' | 'clinician' | 'patient'
export type PortalView = 'admin' | 'clinician' | 'patient'

// Simple portal labels
export const PORTAL_LABELS: Record<PortalView, string> = {
  admin: 'Admin Portal',
  clinician: 'Clinician Portal',
  patient: 'Patient Portal'
}
