import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { DatePicker } from '@/components/ui/date-picker'
import { PatientRegistrationStep3, RaceEthnicity } from '@/types'

type Props = {
  data: PatientRegistrationStep3
  onChange: (data: PatientRegistrationStep3) => void
  onRaceEthnicityChange: (value: RaceEthnicity, checked: boolean) => void
}

const RACE_ETHNICITY_OPTIONS: { value: RaceEthnicity; label: string }[] = [
  { value: 'american_indian', label: 'American Indian/Native Alaskan' },
  { value: 'asian', label: 'Asian' },
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'pacific_islander', label: 'Native Hawaiian/Pacific Islander' },
  { value: 'middle_eastern', label: 'Middle Eastern/Northern African' },
  { value: 'hispanic_latino', label: 'Hispanic/Latino' },
  { value: 'other', label: 'Other' },
]

export function Step3Demographics({ data, onChange, onRaceEthnicityChange }: Props) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <Field>
          <FieldLabel htmlFor="dateOfBirth">Date of Birth *</FieldLabel>
          <DatePicker
            date={(() => {
              if (!data.dateOfBirth) return undefined
              // Parse as local date, not UTC to avoid timezone issues
              const [year, month, day] = data.dateOfBirth.split('-').map(Number)
              return new Date(year, month - 1, day)
            })()}
            onDateChange={(date) => {
              if (date) {
                // Format date as YYYY-MM-DD using local date values
                const year = date.getFullYear()
                const month = String(date.getMonth() + 1).padStart(2, '0')
                const day = String(date.getDate()).padStart(2, '0')
                onChange({ ...data, dateOfBirth: `${year}-${month}-${day}` })
              } else {
                onChange({ ...data, dateOfBirth: '' })
              }
            }}
          />
        </Field>

        <Field>
          <FieldLabel>Sex *</FieldLabel>
          <RadioGroup
            value={data.sex}
            onValueChange={(value) => onChange({ ...data, sex: value as any })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Other</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="prefer_not_to_say" id="prefer_not_to_say" />
              <Label htmlFor="prefer_not_to_say">Prefer not to say</Label>
            </div>
          </RadioGroup>
        </Field>

        <Field>
          <FieldLabel>Height *</FieldLabel>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                id="heightFeet"
                type="number"
                min="0"
                max="8"
                value={data.heightFeet}
                onChange={(e) => onChange({ ...data, heightFeet: e.target.value })}
                placeholder="5"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Feet</p>
            </div>
            <div>
              <Input
                id="heightInches"
                type="number"
                min="0"
                max="11"
                step="0.5"
                value={data.heightInches}
                onChange={(e) => onChange({ ...data, heightInches: e.target.value })}
                placeholder="10"
              />
              <p className="text-xs text-muted-foreground mt-1">Inches</p>
            </div>
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="weightLbs">Weight (lbs) *</FieldLabel>
          <Input
            id="weightLbs"
            type="number"
            min="0"
            step="0.1"
            value={data.weightLbs}
            onChange={(e) => onChange({ ...data, weightLbs: e.target.value })}
            placeholder="150"
            required
          />
        </Field>

        <Field>
          <FieldLabel>Race & Ethnicity * (select all that apply)</FieldLabel>
          <div className="space-y-2 mt-2">
            {RACE_ETHNICITY_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={data.raceEthnicity.includes(option.value)}
                  onCheckedChange={(checked) =>
                    onRaceEthnicityChange(option.value, checked as boolean)
                  }
                />
                <Label htmlFor={option.value} className="font-normal">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </Field>
      </CardContent>
    </Card>
  )
}
