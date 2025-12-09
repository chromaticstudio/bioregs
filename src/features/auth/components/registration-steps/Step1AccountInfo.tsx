import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { Card, CardContent } from '@/components/ui/card'
import { PatientRegistrationStep1 } from '@/types'

type Props = {
  data: PatientRegistrationStep1
  onChange: (data: PatientRegistrationStep1) => void
}

export function Step1AccountInfo({ data, onChange }: Props) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="firstName">First Name *</FieldLabel>
            <Input
              id="firstName"
              value={data.firstName}
              onChange={(e) => onChange({ ...data, firstName: e.target.value })}
              placeholder="John"
              required
              autoComplete="given-name"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="lastName">Last Name *</FieldLabel>
            <Input
              id="lastName"
              value={data.lastName}
              onChange={(e) => onChange({ ...data, lastName: e.target.value })}
              placeholder="Doe"
              required
              autoComplete="family-name"
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email *</FieldLabel>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password *</FieldLabel>
          <Input
            id="password"
            type="password"
            value={data.password}
            onChange={(e) => onChange({ ...data, password: e.target.value })}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Must be at least 8 characters
          </p>
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password *</FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            value={data.confirmPassword}
            onChange={(e) => onChange({ ...data, confirmPassword: e.target.value })}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />
        </Field>
      </CardContent>
    </Card>
  )
}
