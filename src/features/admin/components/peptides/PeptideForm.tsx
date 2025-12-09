import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { FormModal } from '@/components/ui/form-modal'
import { Field, FieldLabel } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Symptom } from '@/types'

type FormData = {
  name: string
  description: string
  dosage_amount: string
  dosage_unit: string
  time_of_day: string
  symptomIds: string[]
}

type Props = {
  open: boolean
  isEditing: boolean
  formData: FormData
  symptoms: Symptom[]
  error: string
  saving: boolean
  onClose: () => void
  onChange: (data: Partial<FormData>) => void
  onToggleSymptom: (symptomId: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function PeptideForm({
  open,
  isEditing,
  formData,
  symptoms,
  error,
  saving,
  onClose,
  onChange,
  onToggleSymptom,
  onSubmit
}: Props) {
  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit Peptide' : 'Add New Peptide'}
      error={error}
      saving={saving}
      saveLabel={isEditing ? 'Update Peptide' : 'Create Peptide'}
      savingLabel="Saving..."
      onSubmit={onSubmit}
    >
      <Field>
        <FieldLabel htmlFor="name">
          Name <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="e.g., BPC-157"
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Brief description of the peptide"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="dosage_amount">
            Dosage Amount <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="dosage_amount"
            value={formData.dosage_amount}
            onChange={(e) => onChange({ dosage_amount: e.target.value })}
            placeholder="e.g., 250"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="dosage_unit">
            Unit <span className="text-destructive">*</span>
          </FieldLabel>
          <Select
            value={formData.dosage_unit}
            onValueChange={(value) => onChange({ dosage_unit: value })}
            required
          >
            <SelectTrigger id="dosage_unit">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mg">mg</SelectItem>
              <SelectItem value="mcg">mcg</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="time_of_day">Time of Day</FieldLabel>
        <Select
          value={formData.time_of_day}
          onValueChange={(value) => onChange({ time_of_day: value })}
        >
          <SelectTrigger id="time_of_day">
            <SelectValue placeholder="Select time of day" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="morning">Morning</SelectItem>
            <SelectItem value="evening">Evening</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel>Associated Symptoms (for tracking)</FieldLabel>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
          {symptoms.length === 0 ? (
            <p className="text-sm text-muted-foreground col-span-2">
              No symptoms available. Add symptoms first.
            </p>
          ) : (
            symptoms.map((symptom) => (
              <div key={symptom.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`symptom-${symptom.id}`}
                  checked={formData.symptomIds.includes(symptom.id)}
                  onCheckedChange={() => onToggleSymptom(symptom.id)}
                />
                <Label
                  htmlFor={`symptom-${symptom.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {symptom.name}
                </Label>
              </div>
            ))
          )}
        </div>
      </Field>
    </FormModal>
  )
}
