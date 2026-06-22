import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Recommendation } from '@/types'

const CATEGORY_LABELS: Record<Recommendation['category'], string> = {
  switch: 'Career Switch',
  growth: 'Career Growth',
  education: 'Education',
}

interface RecommendationCardProps {
  rec: Recommendation
  onExplore: (rec: Recommendation) => void
}

export default function RecommendationCard({ rec, onExplore }: RecommendationCardProps) {
  return (
    <Card className="flex flex-col gap-3 p-5 h-full">
      <CardHeader className="p-0">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold leading-tight">{rec.title}</CardTitle>
          <span className="shrink-0 text-lg font-bold text-blue-600">{rec.matchScore}%</span>
        </div>
        <Badge variant="secondary" className="w-fit text-xs">
          {CATEGORY_LABELS[rec.category]}
        </Badge>
      </CardHeader>
      <CardContent className="p-0 flex flex-col gap-3 flex-1">
        <p className="text-sm text-gray-700">{rec.whyFit}</p>
        {rec.skillGaps.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Skill gaps</p>
            <div className="flex flex-wrap gap-1">
              {rec.skillGaps.map((gap) => (
                <Badge key={gap} variant="outline" className="text-xs">
                  {gap}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <p className="text-xs text-gray-500">Transition: {rec.transitionTime}</p>
        <Button size="sm" className="mt-auto w-full" onClick={() => onExplore(rec)}>
          Explore →
        </Button>
      </CardContent>
    </Card>
  )
}
