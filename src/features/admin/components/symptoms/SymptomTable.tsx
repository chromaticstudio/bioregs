import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { ConfirmDelete } from '@/components/ui/confirm-delete'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pencil, Trash2 } from 'lucide-react'
import { useDeleteDialog } from '@/hooks/use-delete-dialog'
import { Symptom } from '@/types'

type Props = {
  symptoms: Symptom[]
  onEdit: (symptom: Symptom) => void
  onDelete: (id: string) => void
}

export function SymptomTable({ symptoms = [], onEdit, onDelete }: Props) {
  const deleteDialog = useDeleteDialog()

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {symptoms.length === 0 ? (
            <EmptyState colSpan={4} message="No symptoms found. Add one to get started." />
          ) : (
            symptoms.map((symptom) => (
              <TableRow key={symptom.id}>
                <TableCell className="font-medium">{symptom.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {symptom.description || '—'}
                </TableCell>
                <TableCell>
                  <Badge variant={symptom.is_sae ? 'destructive' : 'secondary'}>
                    {symptom.is_sae ? 'SAE' : 'Standard'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(symptom)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteDialog.openDialog(symptom.id, symptom.name)}
                    >
                      <Trash2 className="text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <ConfirmDelete
        open={deleteDialog.isOpen}
        onOpenChange={deleteDialog.closeDialog}
        onConfirm={() => deleteDialog.confirmDelete(onDelete)}
        itemName={deleteDialog.itemToDelete?.name}
        itemType="symptom"
      />
    </>
  )
}
