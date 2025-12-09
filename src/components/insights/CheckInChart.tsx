import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type CheckIn = {
  id: string
  created_at: string
}

type Props = {
  checkIns: CheckIn[]
}

export function CheckInChart({ checkIns }: Props) {
  // Get last 30 days
  const days: { date: Date; hasCheckIn: boolean }[] = []
  const today = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    
    const hasCheckIn = checkIns.some((ci) => {
      const ciDate = new Date(ci.created_at)
      ciDate.setHours(0, 0, 0, 0)
      return ciDate.getTime() === date.getTime()
    })
    
    days.push({ date, hasCheckIn })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check-In History (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-10 gap-2">
          {days.map((day, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-1"
            >
              <div
                className={`w-full aspect-square rounded-sm transition-colors ${
                  day.hasCheckIn
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
                title={day.date.toLocaleDateString()}
              />
              {index % 5 === 0 && (
                <span className="text-xs text-muted-foreground">
                  {day.date.getDate()}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-primary" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-muted" />
            <span>Missed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}