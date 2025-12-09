import { Button } from '@/components/ui/button'
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

export function ProtocolTable({ protocols = [], onCheckIn }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Peptide</TableHead>
          <TableHead>Dosage</TableHead>
          <TableHead>Frequency</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {protocols.length === 0 ? (
          <EmptyState colSpan={5} message="No active protocols. Please contact your clinician." />
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
              <TableCell className="text-right">
                <Button 
                  size="sm"
                  onClick={() => onCheckIn(protocol.id)}
                >
                  Daily Check-In
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
