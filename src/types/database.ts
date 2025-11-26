import type { UserRole, ProtocolStatus } from './shared'

// Core entities with optional joined data
export type Peptide = {
  id: string
  name: string
  description: string | null
  dosage_amount: string
  dosage_unit: string
  time_of_day: string | null
  created_at: string
  // Optional - only populated when explicitly joined
  symptoms?: Symptom[]
}

export type Symptom = {
  id: string
  name: string
  description: string | null
  is_sae: boolean
  created_at: string
}

export type Profile = {
  id: string
  first_name: string
  last_name: string
  role: UserRole
  email?: string
  created_at: string
  // Optional - only populated when explicitly joined
  protocols?: Array<{
    id: string
    status: string
    peptide: {
      name: string
    }
  }>
}

export type Protocol = {
  id: string
  // Foreign keys (always present)
  peptide_id: string
  clinician_id: string
  patient_id: string | null
  // Protocol details
  frequency: string
  duration: string
  notes: string | null
  status: ProtocolStatus
  created_at: string
  // Optional joined data - only populated when explicitly fetched
  peptide?: {
    id: string
    name: string
    description: string | null
    dosage_amount: string
    dosage_unit: string
    time_of_day: string | null
  }
  patient?: {
    first_name: string
    last_name: string
  }
}

export type CheckIn = {
  id: string
  protocol_id: string
  patient_id: string
  dose_taken_at: string
  notes: string | null
  is_end_of_cycle: boolean | null
  created_at: string
}

export type Visit = {
  id: string
  patient_id: string
  clinician_id: string
  protocol_id: string | null
  visit_date: string
  notes: string | null
  protocol_update: string | null
  created_at: string
}

// Join table
export type PeptideSymptom = {
  id: string
  peptide_id: string
  symptom_id: string
  created_at: string
}
