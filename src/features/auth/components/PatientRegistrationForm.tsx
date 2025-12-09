import { Button } from '@/components/ui/button'
import { AlertMessage } from '@/components/ui/alert-message'
import { Progress } from '@/components/ui/progress'
import { AuthLayout } from '../layout/AuthLayout'
import { PatientRegistrationStep1 } from '@/types'
import { usePatientRegistration } from '../hooks/usePatientRegistration'
import { Step1AccountInfo } from './registration-steps/Step1AccountInfo'
import { Step2PhoneVerification } from './registration-steps/Step2PhoneVerification'
import { Step3Demographics } from './registration-steps/Step3Demographics'
import { Step4Address } from './registration-steps/Step4Address'
import { Step5Consent } from './registration-steps/Step5Consent'

type Props = {
  onNavigateToLogin: () => void
  initialData?: Partial<PatientRegistrationStep1>
}

export function PatientRegistrationForm({ onNavigateToLogin, initialData }: Props) {
  const {
    // State
    error,
    loading,
    success,
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
  } = usePatientRegistration(initialData)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await register()
  }

  if (checkingInvitation) {
    return (
      <AuthLayout title="Patient Registration" description="Loading...">
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Checking invitation...</div>
        </div>
      </AuthLayout>
    )
  }

  if (success) {
    return (
      <AuthLayout title="Registration Complete" description="Welcome to BioRegs!">
        <div className="space-y-4">
          <AlertMessage
            message="Your account has been created successfully! Please check your email to verify your account."
            variant="success"
          />
          <Button onClick={onNavigateToLogin} className="w-full">
            Continue to Sign In
          </Button>
        </div>
      </AuthLayout>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1AccountInfo data={step1} onChange={setStep1} />
      case 2:
        return (
          <Step2PhoneVerification
            data={step2}
            onChange={setStep2}
            phoneVerified={phoneVerified}
            verificationSent={verificationSent}
            onSendCode={handleSendVerificationCode}
            onVerifyCode={handleVerifyCode}
          />
        )
      case 3:
        return (
          <Step3Demographics
            data={step3}
            onChange={setStep3}
            onRaceEthnicityChange={handleRaceEthnicityChange}
          />
        )
      case 4:
        return <Step4Address data={step4} onChange={setStep4} />
      case 5:
        return <Step5Consent data={step5} onChange={setStep5} />
      default:
        return null
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Account Information'
      case 2:
        return 'Phone Verification'
      case 3:
        return 'Demographics'
      case 4:
        return 'Address'
      case 5:
        return 'Consent & Authorization'
      default:
        return ''
    }
  }

  return (
    <AuthLayout
      title="Patient Registration"
      description={`Step ${currentStep} of ${totalSteps}: ${getStepTitle()}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AlertMessage message={error} />

        <Progress value={(currentStep / totalSteps) * 100} />

        {renderStep()}

        <div className="flex gap-2">
          {currentStep > 1 && (
            <Button
              type="button"
              onClick={handlePreviousStep}
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              Previous
            </Button>
          )}

          {currentStep < totalSteps ? (
            <Button type="button" onClick={handleNextStep} className="flex-1">
              Next
            </Button>
          ) : (
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Completing registration...' : 'Complete Registration'}
            </Button>
          )}
        </div>
      </form>

      {currentStep === 1 && (
        <div className="text-center text-sm mt-4">
          <span className="text-muted-foreground">Already have an account? </span>
          <Button type="button" onClick={onNavigateToLogin} variant="text">
            Sign in
          </Button>
        </div>
      )}
    </AuthLayout>
  )
}
