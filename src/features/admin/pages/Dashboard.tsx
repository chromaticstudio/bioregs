import { DashboardView } from '../components/dashboard/DashboardView'
import { useDashboard } from '../hooks/useDashboard'

export function Dashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { stats, loading } = useDashboard()

  return (
    <DashboardView
      stats={stats}
      loading={loading}
      onNavigate={onNavigate}
    />
  )
}
