import { useState } from 'react'
import { PeptideListView } from '../components/peptides/PeptideListView'
import { CheckIn } from './CheckIn'
import { useProtocols } from '../hooks/useProtocols'

type Props = {
  onSetShowCheckIn?: (show: boolean) => void
}

export function Peptides({ onSetShowCheckIn }: Props) {
  const { protocols, loading, error } = useProtocols()
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [selectedProtocolId, setSelectedProtocolId] = useState<string | null>(null)

  const handleCheckIn = (protocolId: string) => {
    setSelectedProtocolId(protocolId)
    setShowCheckIn(true)
    onSetShowCheckIn?.(true)
  }

  const handleBackToPeptides = () => {
    setSelectedProtocolId(null)
    setShowCheckIn(false)
    onSetShowCheckIn?.(false)
  }

  if (showCheckIn && selectedProtocolId) {
    return <CheckIn protocolId={selectedProtocolId} onBack={handleBackToPeptides} />
  }

  return (
    <PeptideListView
      protocols={protocols}
      loading={loading}
      error={error}
      onCheckIn={handleCheckIn}
    />
  )
}
