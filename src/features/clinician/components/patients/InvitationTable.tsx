import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RefreshCw, Trash2 } from 'lucide-react'
import { PatientInvitation } from '@/types'

type Props = {
  invitations: PatientInvitation[]
  onResend: (id: string) => void
  onCancel: (id: string) => void
}

const getStatusVariant = (status: string) => { 
  switch (status) {
    case 'pending':
      return 'secondary' as const
    case 'accepted':
      return 'default' as const
    case 'declined':
      return 'destructive' as const
    default:
      return 'outline' as const
  }
}

export function InvitationTable({ invitations = [], onResend, onCancel }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Sent</TableHead>
          <TableHead className="w-24">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.length === 0 ? (
          <EmptyState colSpan={5} message="No invitations sent yet." />
        ) : (
          invitations.map((invitation) => (
            <TableRow key={invitation.id}>
              <TableCell className="font-medium">
                {invitation.first_name} {invitation.last_name}
              </TableCell>
              <TableCell>{invitation.email}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(invitation.status)}>
                  {invitation.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(invitation.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {invitation.status === 'pending' && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onResend(invitation.id)}
                      title="Resend invitation"
                    >
                      <RefreshCw />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onCancel(invitation.id)}
                      title="Cancel invitation"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
