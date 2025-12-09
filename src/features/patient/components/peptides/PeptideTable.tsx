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
  onCheckIn: (protocolId: string) => void
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

export function PeptideTable({ protocols = [], onCheckIn }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Peptide</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Dosage</TableHead>
          <TableHead>Time of Day</TableHead>
          <TableHead>Frequency</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {protocols.length === 0 ? (
          <EmptyState colSpan={8} message="No active peptides. Please contact your clinician." />
        ) : (
          protocols.map((protocol) => (
            <TableRow key={protocol.id}>
              <TableCell className="font-medium">
                {protocol.peptide?.name || 'Unknown'}
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {protocol.peptide?.description || '-'}
              </TableCell>
              <TableCell>
                {protocol.peptide?.dosage_amount} {protocol.peptide?.dosage_unit}
              </TableCell>
              <TableCell className="capitalize">
                {protocol.peptide?.time_of_day || '-'}
              </TableCell>
              <TableCell>{protocol.frequency}</TableCell>
              <TableCell>{protocol.duration}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(protocol.status)}>
                  {protocol.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  onClick={() => onCheckIn(protocol.id)}
                >
                  Check-In
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
