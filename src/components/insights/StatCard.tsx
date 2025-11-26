import { ReactNode } from 'react'
import { Card, CardDescription, CardHeader } from '../ui/card'

interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <div className="text-3xl font-semibold mt-2">{value}</div>
      </CardHeader>
    </Card>
  )
}
