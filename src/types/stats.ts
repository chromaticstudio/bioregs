export type AdminStats = {
  totalUsers: number
  clinicians: number
  patients: number
  activeProtocols: number
}

export type ClinicianStats = {
  activeProtocols: number
  activePatients: number
  pendingVisits: number
}
