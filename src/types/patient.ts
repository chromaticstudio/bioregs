import { UserRole } from './shared'

// Patient demographics types
export type RaceEthnicity =
  | 'american_indian'
  | 'asian'
  | 'black'
  | 'white'
  | 'pacific_islander'
  | 'middle_eastern'
  | 'hispanic_latino'
  | 'other'

export type Sex = 
  | 'male' 
  | 'female' 
  | 'other' 
  | 'prefer_not_to_say'

export type PhoneVerification = {
  id: string
  phone_number: string
  verification_code: string
  expires_at: string
  verified: boolean
  verified_at?: string
  created_at: string
}

// Patient profile (extends base Profile)
export type PatientProfile = {
  id: string
  first_name: string
  last_name: string
  role: UserRole
  email?: string
  created_at: string
  // Demographics
  phone_number?: string
  phone_verified?: boolean
  date_of_birth?: string
  sex?: Sex
  height_cm?: number
  weight_kg?: number
  race_ethnicity?: RaceEthnicity[]
  // Address
  address_line1?: string
  address_line2?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  // Consent tracking
  hipaa_consent?: boolean
  hipaa_consent_date?: string
  data_sharing_consent?: boolean
  data_sharing_consent_date?: string
  onboarding_completed?: boolean
  onboarding_completed_at?: string
  // Optional - only populated when explicitly joined
  protocols?: Array<{
    id: string
    status: string
    peptide: {
      name: string
    }
  }>
}

// Patient invitation types
export type InviteStatus = 'pending' | 'accepted' | 'declined' | 'cancelled'

export type PatientInvitation = {
  id: string
  email: string
  first_name: string
  last_name: string
  clinician_id: string
  status: InviteStatus
  token: string
  created_at: string
  phone_number?: string
  accepted_at?: string
}

// Patient registration form types
export type PatientRegistrationStep1 = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export type PatientRegistrationStep2 = {
  phoneNumber: string
  verificationCode: string
}

export type PatientRegistrationStep3 = {
  dateOfBirth: string
  sex: Sex
  heightFeet: string
  heightInches: string
  weightLbs: string
  raceEthnicity: RaceEthnicity[]
}

export type PatientRegistrationStep4 = {
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  country: string
}

export type PatientRegistrationStep5 = {
  hipaaConsent: boolean
  dataSharingConsent: boolean
}

// Patient check-in types
export type CheckIn = {
  id: string
  protocol_id: string
  patient_id: string
  dose_taken_at: string
  notes: string | null
  is_end_of_cycle: boolean | null
  created_at: string
}

export type CheckInFormData = {
  doseTime: string
  symptomRatings: Record<string, number>
  notes: string
  adverseEffects: string
  isEndOfCycle: boolean
}
