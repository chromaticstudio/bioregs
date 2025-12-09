import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type CheckIn = {
  id: string
  created_at: string
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
  checkIns: CheckIn[]
  symptomRatings: SymptomRating[]
}

type ChartData = {
  date: string
  [key: string]: string | number
}

export function SymptomTrendChart({ checkIns, symptomRatings }: Props) {
  // Group ratings by symptom
  const symptomMap = new Map<string, { name: string; ratings: Array<{ date: string; rating: number }> }>()
  
  symptomRatings.forEach((rating) => {
    const symptomId = rating.symptom_id
    const symptomName = rating.symptom.name
    
    if (!symptomMap.has(symptomId)) {
      symptomMap.set(symptomId, { name: symptomName, ratings: [] })
    }
    
    const checkIn = checkIns.find(ci => ci.id === rating.check_in_id)
    if (checkIn) {
      symptomMap.get(symptomId)?.ratings.push({
        date: new Date(checkIn.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        rating: rating.rating
      })
    }
  })

  // Convert to chart data format
  const allDates = new Set<string>()
  symptomMap.forEach(symptom => {
    symptom.ratings.forEach(r => allDates.add(r.date))
  })

  const chartData: ChartData[] = Array.from(allDates)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .map(date => {
      const dataPoint: ChartData = { date }
      
      symptomMap.forEach((symptom) => {
        const rating = symptom.ratings.find(r => r.date === date)
        if (rating) {
          dataPoint[symptom.name] = rating.rating
        }
      })
      
      return dataPoint
    })

  // Colors for up to 5 symptoms
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#a78bfa']
  const symptoms = Array.from(symptomMap.values()).slice(0, 5)

  if (symptoms.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Symptom Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No symptom data available yet. Complete your daily check-ins to see trends.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptom Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 5]} 
              ticks={[0, 1, 2, 3, 4, 5]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Legend />
            {symptoms.map((symptom, index) => (
              <Line
                key={symptom.name}
                type="monotone"
                dataKey={symptom.name}
                stroke={colors[index]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-4">
          Rating scale: 1 (worst) to 5 (best). Higher scores indicate improvement.
        </p>
      </CardContent>
    </Card>
  )
}