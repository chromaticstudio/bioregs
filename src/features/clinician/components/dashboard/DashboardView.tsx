import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/insights/StatCard'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { Button } from '@/components/ui/button'
import { LoadingView } from '@/components/ui/loading-view'

interface Props {
  stats: {
    activeProtocols: number
    activePatients: number
    pendingVisits: number
  }
  loading: boolean
  onNavigate: (page: string) => void
}

export function DashboardView({ stats, loading, onNavigate }: Props) {
  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Dashboard" />
        <LoadingView />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader title="Dashboard" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Active Protocols" value={stats.activeProtocols} />
        <StatCard label="Active Patients" value={stats.activePatients} />
        <StatCard label="Pending Visits" value={stats.pendingVisits} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-list space-x-4">
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>View Protocols</ItemTitle>
              <ItemDescription>
                Manage your research protocols
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="default" size="sm" onClick={() => onNavigate('protocols')}>
                Manage Protocols
              </Button>
            </ItemActions>
          </Item>

          <Item variant="outline">
            <ItemContent>
              <ItemTitle>View Patients</ItemTitle>
              <ItemDescription>
                See enrolled patients
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="default" size="sm" onClick={() => onNavigate('patients')}>
                View Patients
              </Button>
            </ItemActions>
          </Item>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
