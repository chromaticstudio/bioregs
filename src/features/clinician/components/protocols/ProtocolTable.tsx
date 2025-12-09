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
import { Protocol } from '@/types'

type Props = {
  protocols: Protocol[]
  onAssignPatient: (protocolId: string, currentPatientId: string | null) => void
}

const getStatusVariant = (status: string) => { 
  switch (status) {
    case 'active':
      return 'success' as const
    case 'completed':
      return 'default' as const
    case 'paused':
      return 'secondary' as const
    default:
      return 'outline' as const
  }
}

export function ProtocolTable({ protocols = [], onAssignPatient }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Peptide</TableHead>
          <TableHead>Dosage</TableHead>
          <TableHead>Frequency</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Patient</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {protocols.length === 0 ? (
          <EmptyState colSpan={8} message="No protocols found. Create your first protocol to get started." />
        ) : (
          protocols.map((protocol) => (
            <TableRow key={protocol.id}>
              <TableCell className="font-medium">
                {protocol.peptide?.name || 'Unknown'}
              </TableCell>
              <TableCell>
                {protocol.peptide?.dosage_amount} {protocol.peptide?.dosage_unit}
              </TableCell>
              <TableCell>{protocol.frequency}</TableCell>
              <TableCell>{protocol.duration}</TableCell>
              <TableCell>
                {protocol.patient ? (
                  <span className="text-sm">
                    {protocol.patient.first_name} {protocol.patient.last_name}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">Unassigned</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(protocol.status)}>
                  {protocol.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(protocol.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => onAssignPatient(protocol.id, protocol.patient_id)}
                >
                  {protocol.patient_id ? 'Reassign' : 'Assign Patient'}
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
