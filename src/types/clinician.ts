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

export type VisitFormData = {
  symptomGrades: Record<string, number>
  adverseEffects: string
  significantAdverseEffects: string[]
  protocolUpdate: string
  notes: string
}
