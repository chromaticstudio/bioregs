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
import { Profile } from '@/types'
import { UserRole } from '@/types/shared'

type Props = {
  users: Profile[]
}

const getRoleVariant = (role: UserRole) => {
  switch (role) {
    case 'admin':
      return 'default' as const
    case 'clinician':
      return 'secondary' as const
    case 'patient':
      return 'outline' as const
    default:
      return 'outline' as const
  }
}

export function UserTable({ users = [] }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Joined</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <EmptyState colSpan={4} message="No users found." />
        ) : (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell>{user.email || '—'}</TableCell>
              <TableCell>
                <Badge variant={getRoleVariant(user.role)}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
