import { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertMessage } from '@/components/ui/alert-message'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  error?: string
  saving?: boolean
  saveLabel?: string
  savingLabel?: string
  onSubmit: (e: React.FormEvent) => void
  children: ReactNode
}

export function FormModal({
  open,
  onClose,
  title,
  error,
  saving = false,
  saveLabel = 'Save',
  savingLabel = 'Saving...',
  onSubmit,
  children,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">
            Form to {title.toLowerCase()}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <AlertMessage message={error} />
          {children}

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? savingLabel : saveLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
