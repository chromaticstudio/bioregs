import { FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { TimePicker } from '@/components/ui/time-picker'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AlertTriangle } from 'lucide-react'
import { Symptom, Protocol } from '@/types'
import { CheckInFormData } from '@/types'
import { Spinner } from '@/components/ui/spinner'

type Props = {
  symptoms: Symptom[]
  saeSymptoms: Symptom[]
  protocol: Protocol
  formData: CheckInFormData
  submitting: boolean
  onFormChange: (updates: Partial<CheckInFormData>) => void
  onSymptomRating: (symptomId: string, rating: number) => void
  onSubmit: () => Promise<{ success: boolean; error?: string }>
}

export function CheckInForm({
  symptoms,
  saeSymptoms,
  protocol,
  formData,
  submitting,
  onFormChange,
  onSymptomRating,
  onSubmit,
}: Props) {
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await onSubmit()
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const timeStr = formData.doseTime.slice(11, 16) || new Date().toTimeString().slice(0, 5)
      const dateStr = date.toISOString().slice(0, 10)
      onFormChange({ doseTime: `${dateStr}T${timeStr}` })
    }
  }

  const getDateFromFormData = () => {
    const dateStr = formData.doseTime.slice(0, 10)
    if (!dateStr) return new Date()
    
    // Parse as local date, not UTC
    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-3xl">     
      <Card>
        <CardHeader>
          <CardTitle>Current Protocol</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Peptide:</span>
            <span className="text-sm font-medium">{protocol.peptide?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Dosage:</span>
            <span className="text-sm font-medium">
              {protocol.peptide?.dosage_amount} {protocol.peptide?.dosage_unit}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Frequency:</span>
            <span className="text-sm font-medium">{protocol.frequency}</span>
          </div>
        </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Dose</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Field className="flex-1">
              <FieldLabel htmlFor="date-picker">Date Taken</FieldLabel>
              <DatePicker
                date={getDateFromFormData()}
                onDateChange={handleDateChange}
              />
            </Field>
            <Field className="flex-1">
              <FieldLabel htmlFor="time-picker">Time Taken</FieldLabel>
              <TimePicker
                value={formData.doseTime.slice(11, 16)}
                onTimeChange={(time) => {
                  const dateStr = formData.doseTime.slice(0, 10)
                  onFormChange({ doseTime: `${dateStr}T${time}` })
                }}
              />
            </Field>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>How are you feeling today?</CardTitle>
          <CardDescription>Rate each symptom from 1 (worst) to 5 (best)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {symptoms.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              No symptoms configured for this protocol.
            </p>
          ) : (
            symptoms.map((symptom) => (
              <Field key={symptom.id}>
                <FieldLabel>{symptom.name}</FieldLabel>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => onSymptomRating(symptom.id, rating)}
                      className={`flex-1 h-10 rounded-md border transition-colors ${
                        formData.symptomRatings[symptom.id] === rating
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'hover:bg-accent'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </Field>
            ))
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Severe Adverse Effects</CardTitle>
          <CardDescription className="flex gap-2 items-center">
            <AlertTriangle className="text-destructive" />
            Check any severe symptoms you're experiencing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {saeSymptoms.map((sae) => (
              <label
                key={sae.id}
                className={`flex items-center gap-2 p-3 rounded-md border cursor-pointer transition-colors ${
                  formData.symptomRatings[sae.id]
                    ? 'bg-destructive/10 border-destructive'
                    : 'hover:bg-muted'
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!formData.symptomRatings[sae.id]}
                  onChange={(e) => onSymptomRating(sae.id, e.target.checked ? 1 : 0)}
                  className="rounded"
                />
                <span className="text-sm">{sae.name}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabel htmlFor="notes">General Notes (Optional)</FieldLabel>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => onFormChange({ notes: e.target.value })}
              placeholder="Any observations or changes..."
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="adverseEffects">
              Other Adverse Effects (Optional)
            </FieldLabel>
            <Input
              id="adverseEffects"
              value={formData.adverseEffects}
              onChange={(e) => onFormChange({ adverseEffects: e.target.value })}
              placeholder="Describe any other negative side effects..."
            />
          </Field>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isEndOfCycle"
              checked={formData.isEndOfCycle}
              onChange={(e) => onFormChange({ isEndOfCycle: e.target.checked })}
              className="h-4 w-4 rounded border"
            />
            <FieldLabel htmlFor="isEndOfCycle" className="font-normal">
              This is my last dose of this cycle
            </FieldLabel>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={submitting} >
        {submitting ? <Spinner /> : 'Log Visit'}
      </Button>
    </form>
  )
}
