import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { Card, CardContent } from '@/components/ui/card'
import { AlertMessage } from '@/components/ui/alert-message'
import { PatientRegistrationStep2 } from '@/types'

type Props = {
  data: PatientRegistrationStep2
  onChange: (data: PatientRegistrationStep2) => void
  phoneVerified: boolean
  verificationSent: boolean
  onSendCode: () => void
  onVerifyCode: () => void
}

export function Step2PhoneVerification({
  data,
  onChange,
  phoneVerified,
  verificationSent,
  onSendCode,
  onVerifyCode,
}: Props) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <Field>
          <FieldLabel htmlFor="phoneNumber">Phone Number *</FieldLabel>
          <Input
            id="phoneNumber"
            type="tel"
            value={data.phoneNumber}
            onChange={(e) => onChange({ ...data, phoneNumber: e.target.value })}
            placeholder="+1 (555) 123-4567"
            required
            disabled={phoneVerified}
            autoComplete="tel"
          />
        </Field>

        {!verificationSent && !phoneVerified && (
          <Button
            type="button"
            onClick={onSendCode}
            variant="outline"
            className="w-full"
          >
            Send Verification Code
          </Button>
        )}

        {verificationSent && !phoneVerified && (
          <>
            <Field>
              <FieldLabel htmlFor="verificationCode">Verification Code *</FieldLabel>
              <Input
                id="verificationCode"
                value={data.verificationCode}
                onChange={(e) => onChange({ ...data, verificationCode: e.target.value })}
                placeholder="123456"
                required
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground mt-1">
                For testing, use code: 123456
              </p>
            </Field>

            <Button
              type="button"
              onClick={onVerifyCode}
              variant="outline"
              className="w-full"
            >
              Verify Code
            </Button>
          </>
        )}

        {phoneVerified && (
          <AlertMessage
            message="Phone number verified successfully"
            variant="success"
          />
        )}
      </CardContent>
    </Card>
  )
}
