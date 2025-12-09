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
    totalUsers: number
    clinicians: number
    patients: number
    activeProtocols: number
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Clinicians" value={stats.clinicians} />
        <StatCard label="Patients" value={stats.patients} />
        <StatCard label="Active Protocols" value={stats.activeProtocols} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-list space-x-4">
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Manage Users</ItemTitle>
              <ItemDescription>
                View and manage all user accounts
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="default" size="sm" onClick={() => onNavigate('users')}>
                View Users
              </Button>
            </ItemActions>
          </Item>

          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Manage Peptides</ItemTitle>
              <ItemDescription>
                Add or edit peptide library
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="default" size="sm" onClick={() => onNavigate('peptides')}>
                View Peptides
              </Button>
            </ItemActions>
          </Item>
          
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Manage Symptoms</ItemTitle>
              <ItemDescription>
                Configure symptom tracking options
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="default" size="sm" onClick={() => onNavigate('symptoms')}>
                View Symptoms
              </Button>
            </ItemActions>
          </Item>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
