import { InviteStatus } from './shared'

// Form state types (camelCase for React state)
export type CheckInFormData = {
  doseTime: string
  symptomRatings: Record<string, number>
  notes: string
  adverseEffects: string
  isEndOfCycle: boolean
}

export type VisitFormData = {
  symptomGrades: Record<string, number>
  adverseEffects: string
  significantAdverseEffects: string[]
  protocolUpdate: string
  notes: string
}

export type PatientInviteFormData = {
  id: string
  email: string
  first_name: string
  last_name: string
  clinician_id: string
  status: InviteStatus
  token: string
  created_at: string
}
