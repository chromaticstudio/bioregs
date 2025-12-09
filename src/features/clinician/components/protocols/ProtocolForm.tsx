import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormModal } from '@/components/ui/form-modal'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Peptide } from '@/types'

type FormData = {
  peptide_id: string
  frequency: string
  duration: string
  notes: string
}

type Props = {
  open: boolean
  isEditing: boolean
  formData: FormData
  peptides: Peptide[]
  error: string
  saving: boolean
  onClose: () => void
  onChange: (data: Partial<FormData>) => void
  onSubmit: (e: React.FormEvent) => void
}

export function ProtocolForm({
  open,
  isEditing,
  formData,
  peptides,
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
      title={isEditing ? 'Edit Protocol' : 'Create New Protocol'}
      error={error}
      saving={saving}
      saveLabel={isEditing ? 'Update Protocol' : 'Create Protocol'}
      savingLabel="Saving..."
      onSubmit={onSubmit}
    >
      <Field>
        <FieldLabel htmlFor="peptide">
          Peptide <span className="text-destructive">*</span>
        </FieldLabel>
        <Select
          value={formData.peptide_id}
          onValueChange={(value) => onChange({ peptide_id: value })}
        >
          <SelectTrigger id="peptide">
            <SelectValue placeholder="Select a peptide" />
          </SelectTrigger>
          <SelectContent>
            {peptides.map((peptide) => (
              <SelectItem key={peptide.id} value={peptide.id}>
                {peptide.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="frequency">
          Frequency <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="frequency"
          value={formData.frequency}
          onChange={(e) => onChange({ frequency: e.target.value })}
          placeholder="e.g., Once daily, Twice daily"
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="duration">
          Duration <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="duration"
          value={formData.duration}
          onChange={(e) => onChange({ duration: e.target.value })}
          placeholder="e.g., 4 weeks, 30 days"
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="notes">Notes</FieldLabel>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="Additional notes for this protocol"
          rows={3}
        />
      </Field>
    </FormModal>
  )
}
