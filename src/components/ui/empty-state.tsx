import { TableCell, TableRow } from '@/components/ui/table'

type Props = {
  colSpan: number
  message: string
}

export function EmptyState({ colSpan, message }: Props) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center text-muted-foreground py-8">
        {message}
      </TableCell>
    </TableRow>
  )
}
