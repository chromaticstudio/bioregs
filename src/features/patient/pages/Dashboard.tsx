import { useState } from 'react'
import { DashboardView } from '../components/dashboard/DashboardView'
import { CheckIn } from './CheckIn'
import { useDashboard } from '../hooks/useDashboard'

type Props = {
  onSetShowCheckIn?: (show: boolean) => void
}

export function Dashboard({ onSetShowCheckIn }: Props) {
  const { loading, activeProtocol, recentCheckIns, symptomRatings, stats } = useDashboard()
  const [showCheckIn, setShowCheckIn] = useState(false)

  const handleCheckIn = () => {
    setShowCheckIn(true)
    onSetShowCheckIn?.(true)  // Show in sidebar
  }

  const handleBackToDashboard = () => {
    setShowCheckIn(false)
    onSetShowCheckIn?.(false)  // Hide from sidebar
  }

  if (showCheckIn && activeProtocol) {
    return <CheckIn protocolId={activeProtocol.id} onBack={handleBackToDashboard} />
  }

  return (
    <DashboardView
      loading={loading}
      activeProtocol={activeProtocol}
      recentCheckIns={recentCheckIns}
      symptomRatings={symptomRatings}
      stats={stats}
      onCheckIn={handleCheckIn}
    />
  )
}