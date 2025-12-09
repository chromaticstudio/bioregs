import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/insights/StatCard'
import { LoadingView } from '@/components/ui/loading-view'
import { CheckInChart } from '@/components/insights/CheckInChart'
import { SymptomTrendChart } from '@/components/insights/SymptomTrendChart'
import { ProgressIndicators } from '@/components/insights/ProgressIndicators'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { Activity, Calendar, TrendingUp } from 'lucide-react'
import { Protocol, CheckIn } from '@/types'

type DashboardStats = {
  totalCheckIns: number
  currentStreak: number
  checkInsThisWeek: number
  adherenceRate: number
}

type SymptomRating = {
  check_in_id: string
  symptom_id: string
  rating: number
  created_at: string
  symptom: {
    name: string
  }
}

type Props = {
  loading: boolean
  activeProtocol: Protocol | null
  recentCheckIns: CheckIn[]
  symptomRatings: SymptomRating[]
  stats: DashboardStats
  onCheckIn: () => void
}

export function DashboardView({
  loading,
  activeProtocol,
  recentCheckIns,
  symptomRatings,
  stats,
  onCheckIn
}: Props) {
  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Dashboard" />
        <LoadingView />
      </PageContainer>
    )
  }

  if (!activeProtocol) {
    return (
      <PageContainer>
        <PageHeader title="Dashboard" />
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No active protocol assigned. Please contact your clinician.
            </p>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader title="Dashboard" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          label="Current Streak" 
          value={stats.currentStreak}
          icon={<Activity />}
        />
        <StatCard 
          label="This Week" 
          value={stats.checkInsThisWeek}
          icon={<Calendar />}
        />
        <StatCard 
          label="Total Check-Ins" 
          value={stats.totalCheckIns}
        />
        <StatCard 
          label="Adherence Rate" 
          value={`${stats.adherenceRate}%`}
          icon={<TrendingUp />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Protocol</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>{activeProtocol.peptide?.name}</ItemTitle>
              <ItemDescription>
                {activeProtocol.peptide?.dosage_amount} {activeProtocol.peptide?.dosage_unit} • {activeProtocol.frequency}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button onClick={onCheckIn}>
                Daily Check-In
              </Button>
            </ItemActions>
          </Item>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CheckInChart checkIns={recentCheckIns} />
        <ProgressIndicators symptomRatings={symptomRatings} />
      </div>

      <SymptomTrendChart checkIns={recentCheckIns} symptomRatings={symptomRatings} />
    </PageContainer>
  )
}