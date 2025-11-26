import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingView } from '@/components/ui/loading-view'
import { ErrorAlert } from '@/components/ui/error-alert'
import { PeptideTable } from './PeptideTable'
import type { Protocol } from '@/types/database'

type Props = {
  protocols: Protocol[]
  loading: boolean
  error: string
  onCheckIn: (protocolId: string) => void
}

export function PeptideListView({
  protocols,
  loading,
  error,
  onCheckIn
}: Props) {
  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="My Peptides" />
        <LoadingView />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader title="My Peptides" />
      <ErrorAlert message={error} />
      <PeptideTable
        protocols={protocols}
        onCheckIn={onCheckIn}
      />
    </PageContainer>
  )
}
