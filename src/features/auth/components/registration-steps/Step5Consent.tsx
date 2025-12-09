import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PatientRegistrationStep5 } from '@/types'

type Props = {
  data: PatientRegistrationStep5
  onChange: (data: PatientRegistrationStep5) => void
}

export function Step5Consent({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">HIPAA Authorization</CardTitle>
          <CardDescription>
            I authorize BioRegs and my healthcare provider to use and disclose my protected
            health information for treatment, payment, and healthcare operations as described
            in the Notice of Privacy Practices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-2">
            <Checkbox
              id="hipaaConsent"
              checked={data.hipaaConsent}
              onCheckedChange={(checked) =>
                onChange({ ...data, hipaaConsent: checked as boolean })
              }
            />
            <Label htmlFor="hipaaConsent" className="font-normal leading-tight">
              I have read and agree to the HIPAA Authorization *
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Data Sharing Acknowledgment</CardTitle>
          <CardDescription>
            I understand that my de-identified health data may be used for research purposes
            and quality improvement initiatives. My personal identifying information will not
            be shared without my explicit consent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-2">
            <Checkbox
              id="dataSharingConsent"
              checked={data.dataSharingConsent}
              onCheckedChange={(checked) =>
                onChange({ ...data, dataSharingConsent: checked as boolean })
              }
            />
            <Label htmlFor="dataSharingConsent" className="font-normal leading-tight">
              I acknowledge and consent to data sharing as described *
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
