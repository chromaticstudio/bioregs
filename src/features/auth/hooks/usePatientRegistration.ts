import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import {
  PatientRegistrationStep1,
  PatientRegistrationStep2,
  PatientRegistrationStep3,
  PatientRegistrationStep4,
  PatientRegistrationStep5,
  RaceEthnicity,
  PatientInvitation,
} from '@/types'

export function usePatientRegistration(initialData?: Partial<PatientRegistrationStep1>) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [invitation, setInvitation] = useState<PatientInvitation | null>(null)
  const [checkingInvitation, setCheckingInvitation] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)

  const { signUp } = useAuth()

  // Step 1: Account Information
  const [step1, setStep1] = useState<PatientRegistrationStep1>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    password: '',
    confirmPassword: '',
  })

  // Step 2: Phone Verification
  const [step2, setStep2] = useState<PatientRegistrationStep2>({
    phoneNumber: '',
    verificationCode: '',
  })
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)

  // Step 3: Demographics (US units)
  const [step3, setStep3] = useState({
    dateOfBirth: '',
    sex: 'prefer_not_to_say' as PatientRegistrationStep3['sex'],
    heightFeet: '',
    heightInches: '',
    weightLbs: '',
    raceEthnicity: [] as RaceEthnicity[],
  })

  // Step 4: Address
  const [step4, setStep4] = useState<PatientRegistrationStep4>({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  })

  // Step 5: Consent
  const [step5, setStep5] = useState<PatientRegistrationStep5>({
    hipaaConsent: false,
    dataSharingConsent: false,
  })

  const totalSteps = 5

  // Check for invitation token on mount
  useEffect(() => {
    const checkInvitation = async () => {
      const params = new URLSearchParams(window.location.search)
      const token = params.get('token')

      if (token) {
        try {
          const { data, error } = await supabase
            .from('patient_invitations')
            .select('*')
            .eq('token', token)
            .eq('status', 'pending')
            .single()

          if (data && !error) {
            setInvitation(data)
            // Pre-populate step 1 with invitation data
            setStep1(prev => ({
              ...prev,
              firstName: data.first_name,
              lastName: data.last_name,
              email: data.email,
            }))
          }
        } catch (err) {
          console.error('Error checking invitation:', err)
        }
      }

      setCheckingInvitation(false)
    }

    checkInvitation()
  }, [])

  // Validation helpers
  const validateStep = (step: number): string | null => {
    if (step === 1) {
      if (!step1.firstName || !step1.lastName || !step1.email || !step1.password) {
        return 'Please fill in all required fields'
      }
      if (step1.password !== step1.confirmPassword) {
        return 'Passwords do not match'
      }
      if (step1.password.length < 8) {
        return 'Password must be at least 8 characters'
      }
    }

    if (step === 2) {
      if (!step2.phoneNumber) {
        return 'Please enter your phone number'
      }
      if (!phoneVerified) {
        return 'Please verify your phone number'
      }
    }

    if (step === 3) {
      if (!step3.dateOfBirth || !step3.sex || !step3.heightFeet || !step3.weightLbs) {
        return 'Please fill in all required fields'
      }
      if (step3.raceEthnicity.length === 0) {
        return 'Please select at least one race/ethnicity option'
      }
    }

    if (step === 4) {
      if (!step4.addressLine1 || !step4.city || !step4.state || !step4.postalCode || !step4.country) {
        return 'Please fill in all required address fields'
      }
    }

    if (step === 5) {
      if (!step5.hipaaConsent) {
        return 'You must consent to HIPAA authorization to continue'
      }
      if (!step5.dataSharingConsent) {
        return 'You must acknowledge data sharing to continue'
      }
    }

    return null
  }

  const handleNextStep = () => {
    const validationError = validateStep(currentStep)
    if (validationError) {
      setError(validationError)
      return false
    }

    setError('')
    setCurrentStep(currentStep + 1)
    return true
  }

  const handlePreviousStep = () => {
    setError('')
    setCurrentStep(currentStep - 1)
  }

  const handleSendVerificationCode = async () => {
    setError('')
    // TODO: Implement actual SMS sending via SendGrid or Twilio
    console.log('Sending verification code to:', step2.phoneNumber)
    setVerificationSent(true)
    console.log('Development mode: Use code "123456" to verify')
  }

  const handleVerifyCode = () => {
    setError('')
    // TODO: Implement actual verification
    if (step2.verificationCode === '123456' || step2.verificationCode.length === 6) {
      setPhoneVerified(true)
      setError('')
    } else {
      setError('Invalid verification code. (Use "123456" for testing)')
    }
  }

  const handleRaceEthnicityChange = (value: RaceEthnicity, checked: boolean) => {
    setStep3({
      ...step3,
      raceEthnicity: checked
        ? [...step3.raceEthnicity, value]
        : step3.raceEthnicity.filter((v) => v !== value),
    })
  }

  // Convert US units to metric for storage
  const convertToMetric = () => {
    const feet = parseFloat(step3.heightFeet) || 0
    const inches = parseFloat(step3.heightInches) || 0
    const totalInches = feet * 12 + inches
    const heightCm = (totalInches * 2.54).toFixed(2)

    const weightKg = (parseFloat(step3.weightLbs) * 0.453592).toFixed(2)

    return { heightCm, weightKg }
  }

  const register = async () => {
    setError('')
    setLoading(true)

    try {
      const { heightCm, weightKg } = convertToMetric()

      // Step 1: Create Supabase auth user
      const { data: authData, error: signUpError } = await signUp(
        step1.email,
        step1.password,
        step1.firstName,
        step1.lastName
      )

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return { success: false, error: signUpError.message }
      }

      // Get the user ID from the auth response
      const userId = authData?.user?.id

      if (!userId) {
        setError('Failed to create user account')
        setLoading(false)
        return { success: false, error: 'Failed to create user account' }
      }

      // Step 2: Update profile with demographics and address
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          clinician_id: invitation?.clinician_id || null,
          phone_number: step2.phoneNumber,
          phone_verified: true,
          date_of_birth: step3.dateOfBirth,
          sex: step3.sex,
          height_cm: parseFloat(heightCm),
          weight_kg: parseFloat(weightKg),
          race_ethnicity: step3.raceEthnicity,
          address_line1: step4.addressLine1,
          address_line2: step4.addressLine2 || null,
          city: step4.city,
          state: step4.state,
          postal_code: step4.postalCode,
          country: step4.country,
          hipaa_consent: step5.hipaaConsent,
          hipaa_consent_date: step5.hipaaConsent ? new Date().toISOString() : null,
          data_sharing_consent: step5.dataSharingConsent,
          data_sharing_consent_date: step5.dataSharingConsent ? new Date().toISOString() : null,
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq('id', userId)

      if (profileError) {
        console.error('Error updating profile:', profileError)
        setError('Account created but failed to save demographics')
        setLoading(false)
        return { success: false, error: 'Failed to save demographics' }
      }

      // Step 3: If this was an invitation, mark it as accepted
      if (invitation) {
        await supabase
          .from('patient_invitations')
          .update({
            status: 'accepted',
            accepted_at: new Date().toISOString(),
          })
          .eq('id', invitation.id)
      }

      setSuccess(true)
      setLoading(false)
      return { success: true }
    } catch (err: any) {
      console.error('Registration error:', err)
      setError(err.message || 'Failed to complete registration')
      setLoading(false)
      return { success: false, error: err.message }
    }
  }

  return {
    // State
    error,
    loading,
    success,
    invitation,
    checkingInvitation,
    currentStep,
    totalSteps,
    // Step data
    step1,
    step2,
    step3,
    step4,
    step5,
    // Step update functions
    setStep1,
    setStep2,
    setStep3,
    setStep4,
    setStep5,
    // Phone verification
    phoneVerified,
    verificationSent,
    handleSendVerificationCode,
    handleVerifyCode,
    // Navigation
    handleNextStep,
    handlePreviousStep,
    // Helpers
    handleRaceEthnicityChange,
    // Registration
    register,
  }
}
