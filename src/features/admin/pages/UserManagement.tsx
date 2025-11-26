import { UserManagementView } from '../components/users/UserManagementView'
import { useUsers } from '../hooks/useUsers'

export function UserManagement() {
  const { users, loading, error, inviteUser } = useUsers()

  return (
    <UserManagementView
      users={users}
      loading={loading}
      error={error}
      onInvite={inviteUser}
    />
  )
}
