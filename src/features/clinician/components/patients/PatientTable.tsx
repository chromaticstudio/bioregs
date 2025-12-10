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
import { PatientProfile } from '@/types'

type Props = {
  patients: PatientProfile[]
  onLogVisit: (patientId: string) => void
}

export function PatientTable({ patients = [], onLogVisit }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Enrolled</TableHead>
          <TableHead>Assigned Protocols</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.length === 0 ? (
          <EmptyState colSpan={4} message="No patients enrolled yet. Send invitations to get started." />
        ) : (
          patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell className="font-medium">
                {patient.first_name} {patient.last_name}
              </TableCell>
              <TableCell>
                {new Date(patient.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {patient.protocols?.length === 0 ? (
                  <span className="text-sm text-muted-foreground">
                    No protocols assigned
                  </span>
                ) : (
                  <div className="flex flex-col gap-1">
                    {patient.protocols?.map((protocol) => (
                      <div key={protocol.id} className="flex items-center gap-2">
                        <span className="text-sm">
                          {protocol.peptide?.name || 'Unknown'}
                        </span>
                        <Badge variant={protocol.status === 'active' ? 'success' : 'secondary'}>
                          {protocol.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => onLogVisit(patient.id)}
                >
                  Log Visit
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}