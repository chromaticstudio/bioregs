import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ConfirmDelete } from '@/components/ui/confirm-delete'
import { Edit2, Trash2 } from 'lucide-react'
import { useDeleteDialog } from '@/hooks/use-delete-dialog'
import { Peptide } from '@/types'

type Props = {
  peptides: Peptide[]
  onEdit: (peptide: Peptide) => void
  onDelete: (id: string) => void
}

export function PeptideTable({ peptides, onEdit, onDelete }: Props) {
  const deleteDialog = useDeleteDialog()

  if (peptides.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No peptides found. Create your first peptide to get started.
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Tracked Symptoms</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {peptides.map((peptide) => (
            <TableRow key={peptide.id}>
              <TableCell className="font-medium">{peptide.name}</TableCell>
              <TableCell className="text-muted-foreground">{peptide.dosage_amount}</TableCell>
              <TableCell className="text-muted-foreground">{peptide.dosage_unit}</TableCell>
              <TableCell className="text-muted-foreground">{peptide.description || '—'}</TableCell>
              <TableCell>
                {peptide.symptoms && peptide.symptoms.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {peptide.symptoms.map((symptom) => (
                      <Badge key={symptom.id} variant="secondary">
                        {symptom.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">No symptoms tracked</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(peptide)}
                  >
                    <Edit2 />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteDialog.openDialog(peptide.id, peptide.name)}
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmDelete
        open={deleteDialog.isOpen}
        onOpenChange={deleteDialog.closeDialog}
        onConfirm={() => deleteDialog.confirmDelete(onDelete)}
        itemName={deleteDialog.itemToDelete?.name}
        itemType="peptide"
      />
    </>
  )
}