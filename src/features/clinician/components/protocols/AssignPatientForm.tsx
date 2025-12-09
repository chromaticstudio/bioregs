import { FormModal } from '@/components/ui/form-modal'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Profile } from '@/types'

type Props = {
  open: boolean
  patients: Profile[]
  selectedPatientId: string
  error: string
  saving: boolean
  onClose: () => void
  onPatientChange: (patientId: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function AssignPatientForm({
  open,
  patients = [],
  selectedPatientId,
  error,
  saving,
  onClose,
  onPatientChange,
  onSubmit
}: Props) {
  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Assign Patient to Protocol"
      error={error}
      saving={saving}
      saveLabel="Assign Patient"
      savingLabel="Assigning..."
      onSubmit={onSubmit}
    >
      <Field>
        <FieldLabel htmlFor="patient">
          Select Patient <span className="text-destructive">*</span>
        </FieldLabel>
        <Select
          value={selectedPatientId}
          onValueChange={onPatientChange}
        >
          <SelectTrigger id="patient">
            <SelectValue placeholder="Choose a patient" />
          </SelectTrigger>
          <SelectContent>
            {patients.length === 0 ? (
              <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                No patients available. Invite patients first.
              </div>
            ) : (
              patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.first_name} {patient.last_name}
                  {patient.email && (
                    <span className="text-muted-foreground ml-2">
                      ({patient.email})
                    </span>
                  )}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </Field>
    </FormModal>
  )
}
