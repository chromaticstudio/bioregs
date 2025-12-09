import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

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
  symptomRatings: SymptomRating[]
}

type SymptomProgress = {
  name: string
  currentAvg: number
  previousAvg: number
  change: number
  trend: 'improving' | 'declining' | 'stable'
}

export function ProgressIndicators({ symptomRatings }: Props) {
  const calculateProgress = (): SymptomProgress[] => {
    const symptomMap = new Map<string, { name: string; ratings: Array<{ rating: number; date: Date }> }>()
    
    symptomRatings.forEach((rating) => {
      const symptomId = rating.symptom_id
      const symptomName = rating.symptom.name
      
      if (!symptomMap.has(symptomId)) {
        symptomMap.set(symptomId, { name: symptomName, ratings: [] })
      }
      
      symptomMap.get(symptomId)?.ratings.push({
        rating: rating.rating,
        date: new Date(rating.created_at)
      })
    })

    const progress: SymptomProgress[] = []
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    symptomMap.forEach((symptom) => {
      symptom.ratings.sort((a, b) => a.date.getTime() - b.date.getTime())

      const recentRatings = symptom.ratings.filter(r => r.date >= sevenDaysAgo)
      const previousRatings = symptom.ratings.filter(
        r => r.date >= fourteenDaysAgo && r.date < sevenDaysAgo
      )

      if (recentRatings.length === 0) return

      const currentAvg = recentRatings.reduce((sum, r) => sum + r.rating, 0) / recentRatings.length
      const previousAvg = previousRatings.length > 0
        ? previousRatings.reduce((sum, r) => sum + r.rating, 0) / previousRatings.length
        : currentAvg

      const change = currentAvg - previousAvg
      
      let trend: 'improving' | 'declining' | 'stable' = 'stable'
      if (change > 0.3) trend = 'improving'
      else if (change < -0.3) trend = 'declining'

      progress.push({
        name: symptom.name,
        currentAvg: Math.round(currentAvg * 10) / 10,
        previousAvg: Math.round(previousAvg * 10) / 10,
        change: Math.round(change * 10) / 10,
        trend
      })
    })

    return progress.sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
  }

  const progressData = calculateProgress()

  if (progressData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progress Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Not enough data yet. Keep logging your symptoms to see progress.
          </p>
        </CardContent>
      </Card>
    )
  }

  const getTrendIcon = (trend: 'improving' | 'declining' | 'stable') => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className=" text-green-600" />
      case 'declining':
        return <TrendingDown className=" text-red-600" />
      case 'stable':
        return <Minus className=" text-gray-600" />
    }
  }

  const getTrendBadge = (trend: 'improving' | 'declining' | 'stable') => {
    const variants = {
      improving: 'default',
      declining: 'destructive',
      stable: 'secondary'
    } as const

    return (
      <Badge variant={variants[trend]} className="capitalize">
        {trend}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Indicators</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {progressData.map((symptom) => (
            <div
              key={symptom.name}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                {getTrendIcon(symptom.trend)}
                <div>
                  <p className="font-medium">{symptom.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Current: {symptom.currentAvg} | Previous: {symptom.previousAvg}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${
                  symptom.change > 0 ? 'text-green-600' : 
                  symptom.change < 0 ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  {symptom.change > 0 ? '+' : ''}{symptom.change}
                </span>
                {getTrendBadge(symptom.trend)}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Comparing last 7 days vs previous 7 days. Changes &gt; 0.3 are considered significant.
        </p>
      </CardContent>
    </Card>
  )
}