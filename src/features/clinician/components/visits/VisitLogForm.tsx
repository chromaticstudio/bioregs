import { FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Symptom } from '@/types'
import { VisitFormData } from '@/types'
import { Spinner } from '@/components/ui/spinner'

type Props = {
  symptoms: Symptom[]
  formData: VisitFormData
  submitting: boolean
  onFormChange: (updates: Partial<VisitFormData>) => void
  onSymptomGrade: (symptomId: string, grade: number) => void
  onSubmit: () => Promise<{ success: boolean; error?: string }>
}

export function VisitLogForm({
  symptoms,
  formData,
  submitting,
  onFormChange,
  onSymptomGrade,
  onSubmit,
}: Props) {
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Positive Symptoms</CardTitle>
          <CardDescription>Rate each symptom from 1 (worst) to 5 (best)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {symptoms.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              No symptoms configured for this patient's protocol.
            </p>
          ) : (
            symptoms.map((symptom) => (
              <Field key={symptom.id}>
                <FieldLabel>{symptom.name}</FieldLabel>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => onSymptomGrade(symptom.id, grade)}
                      className={`flex-1 h-10 rounded-md border transition-colors ${
                        formData.symptomGrades[symptom.id] === grade
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'hover:bg-accent'
                      }`}
                    >
                      {grade}
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
          <CardTitle>Notable Symptoms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabel htmlFor="adverseEffects">
              Adverse Effects (Optional)
            </FieldLabel>
            <Input
              id="adverseEffects"
              value={formData.adverseEffects}
              onChange={(e) => onFormChange({ adverseEffects: e.target.value })}
              placeholder="Any adverse effects observed..."
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Protocol Update</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabel htmlFor="protocolUpdate">
              Protocol Changes (Optional)
            </FieldLabel>
            <Input
              id="protocolUpdate"
              value={formData.protocolUpdate}
              onChange={(e) => onFormChange({ protocolUpdate: e.target.value })}
              placeholder="e.g., Moved from Complex A to Complex B after 30 days"
            />
          </Field>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>General Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabel htmlFor="notes">Observations (Optional)</FieldLabel>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => onFormChange({ notes: e.target.value })}
              placeholder="Any additional observations..."
            />
          </Field>
        </CardContent>
      </Card>

      <Button type="submit" disabled={submitting}>
        {submitting ? <Spinner /> : 'Log Visit'}
      </Button>
    </form>
  )
}
