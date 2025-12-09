// Peptide types
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

// Symptom types
export type Symptom = {
  id: string
  name: string
  description: string | null
  is_sae: boolean
  created_at: string
}

// Join table
export type PeptideSymptom = {
  id: string
  peptide_id: string
  symptom_id: string
  created_at: string
}
