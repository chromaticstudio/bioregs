import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingView } from '@/components/ui/loading-view'
import { AlertMessage } from '@/components/ui/alert-message'
import { UserTable } from './UserTable'
import { InviteUserDialog } from './InviteUserDialog'
import { Profile } from '@/types'
import { UserPlus } from 'lucide-react'

interface Props {
  users: Profile[]
  loading: boolean
  error: string
  onInvite: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error: string | null }>
}

export function UserManagementView({ users, loading, error, onInvite }: Props) {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)

  return (
    <PageContainer>
      <PageHeader
        title="Users"
        actionLabel="Invite User"
        onAction={() => setInviteDialogOpen(true)}
        actionIcon={<UserPlus />}
      />

      {loading ? (
        <LoadingView />
      ) : (
        <>
          <AlertMessage message={error} />
          <UserTable users={users} />
        </>
      )}

      <InviteUserDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        onInvite={onInvite}
      />
    </PageContainer>
  )
}
