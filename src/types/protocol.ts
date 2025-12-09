// Protocol status types
export type ProtocolStatus = 'active' | 'completed' | 'paused'

// Protocol types
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
