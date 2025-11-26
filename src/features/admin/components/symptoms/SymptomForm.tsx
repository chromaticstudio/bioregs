import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { FormModal } from '@/components/ui/form-modal'
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field'
import { Label } from '@/components/ui/label'

type FormData = {
  name: string
  description: string
  is_sae: boolean
}

type Props = {
  open: boolean
  isEditing: boolean
  formData: FormData
  error: string
  saving: boolean
  onClose: () => void
  onChange: (data: Partial<FormData>) => void
  onSubmit: (e: React.FormEvent) => void
}

export function SymptomForm({
  open,
  isEditing,
  formData,
  error,
  saving,
  onClose,
  onChange,
  onSubmit
}: Props) {
  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit Symptom' : 'Add New Symptom'}
      error={error}
      saving={saving}
      saveLabel={isEditing ? 'Update Symptom' : 'Create Symptom'}
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
          placeholder="e.g., Energy Level"
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Brief description of the symptom"
        />
      </Field>

      <Field>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_sae"
            checked={formData.is_sae}
            onCheckedChange={(checked) => onChange({ is_sae: checked as boolean })}
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="is_sae"
              className="text-sm font-medium cursor-pointer"
            >
              Severe Adverse Effect (SAE)
            </Label>
            <FieldDescription>
              Check this if this symptom represents a serious adverse effect that requires immediate attention
            </FieldDescription>
          </div>
        </div>
      </Field>
    </FormModal>
  )
}
