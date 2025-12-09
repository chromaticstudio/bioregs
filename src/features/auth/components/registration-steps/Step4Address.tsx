import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { Card, CardContent } from '@/components/ui/card'
import { PatientRegistrationStep4 } from '@/types'

type Props = {
  data: PatientRegistrationStep4
  onChange: (data: PatientRegistrationStep4) => void
}

export function Step4Address({ data, onChange }: Props) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <Field>
          <FieldLabel htmlFor="addressLine1">Address Line 1 *</FieldLabel>
          <Input
            id="addressLine1"
            value={data.addressLine1}
            onChange={(e) => onChange({ ...data, addressLine1: e.target.value })}
            placeholder="123 Main St"
            required
            autoComplete="address-line1"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="addressLine2">Address Line 2</FieldLabel>
          <Input
            id="addressLine2"
            value={data.addressLine2}
            onChange={(e) => onChange({ ...data, addressLine2: e.target.value })}
            placeholder="Apt 4B"
            autoComplete="address-line2"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="city">City *</FieldLabel>
            <Input
              id="city"
              value={data.city}
              onChange={(e) => onChange({ ...data, city: e.target.value })}
              placeholder="New York"
              required
              autoComplete="address-level2"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="state">State *</FieldLabel>
            <Input
              id="state"
              value={data.state}
              onChange={(e) => onChange({ ...data, state: e.target.value })}
              placeholder="NY"
              required
              autoComplete="address-level1"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="postalCode">Postal Code *</FieldLabel>
            <Input
              id="postalCode"
              value={data.postalCode}
              onChange={(e) => onChange({ ...data, postalCode: e.target.value })}
              placeholder="10001"
              required
              autoComplete="postal-code"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="country">Country *</FieldLabel>
            <Input
              id="country"
              value={data.country}
              onChange={(e) => onChange({ ...data, country: e.target.value })}
              placeholder="US"
              required
              autoComplete="country"
            />
          </Field>
        </div>
      </CardContent>
    </Card>
  )
}
