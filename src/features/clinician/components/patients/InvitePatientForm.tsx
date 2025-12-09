import { Input } from '@/components/ui/input'
import { FormModal } from '@/components/ui/form-modal'
import { Field, FieldLabel } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'

type FormData = {
  email: string
  firstName: string
  lastName: string
}

type Props = {
  open: boolean
  formData: FormData
  error: string
  saving: boolean
  lastInviteLink: string
  copied: boolean
  onClose: () => void
  onChange: (data: Partial<FormData>) => void
  onSubmit: (e: React.FormEvent) => void
  onCopyLink: () => void
}

export function InvitePatientForm({
  open,
  formData,
  error,
  saving,
  lastInviteLink,
  copied,
  onClose,
  onChange,
  onSubmit,
  onCopyLink
}: Props) {
  // If we just sent an invite, show the success screen with copy link
  if (lastInviteLink) {
    return (
      <FormModal
        open={open}
        onClose={onClose}
        title="Invitation Sent!"
        error={error}
        saving={false}
        saveLabel="Done"
        onSubmit={(e) => {
          e.preventDefault()
          onClose()
        }}
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The invitation has been sent. You can also share this link directly:
          </p>
          
          <Field>
            <FieldLabel htmlFor="inviteLink">Invitation Link</FieldLabel>
            <div className="flex items-center gap-2">
              <Input
                id="inviteLink"
                value={lastInviteLink}
                readOnly
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onCopyLink}
              >
                {copied ? (
                  <Check className=" text-green-600" />
                ) : (
                  <Copy />
                )}
              </Button>
            </div>
          </Field>
        </div>
      </FormModal>
    )
  }

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Invite New Patient"
      error={error}
      saving={saving}
      saveLabel="Send Invitation"
      savingLabel="Sending..."
      onSubmit={onSubmit}
    >
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="firstName">
            First Name <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            placeholder="John"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="lastName">
            Last Name <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            placeholder="Doe"
            required
          />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="email">
          Email <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="patient@example.com"
          required
        />
      </Field>
    </FormModal>
  )
}
