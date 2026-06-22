import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Recommendation } from '@/types'

const CATEGORY_CONFIG: Record<Recommendation['category'], { label: string; accent: string; badge: string; score: string }> = {
  switch:    { label: 'Career Switch',  accent: 'border-t-indigo-500',  badge: 'bg-indigo-50 text-indigo-700 border-indigo-100',  score: 'text-indigo-600' },
  growth:    { label: 'Career Growth',  accent: 'border-t-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-100', score: 'text-emerald-600' },
  education: { label: 'Education',      accent: 'border-t-amber-500',   badge: 'bg-amber-50 text-amber-700 border-amber-100',      score: 'text-amber-600' },
}

interface RecommendationCardProps {
  rec: Recommendation
  onExplore: (rec: Recommendation) => void
}

export default function RecommendationCard({ rec, onExplore }: RecommendationCardProps) {
  const config = CATEGORY_CONFIG[rec.category]
  return (
    <div className={`flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm border-t-4 ${config.accent} p-5 h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-gray-900 leading-tight">{rec.title}</h3>
        <span className={`shrink-0 text-xl font-bold tabular-nums ${config.score}`}>{rec.matchScore}%</span>
      </div>

      <Badge className={`w-fit text-xs border mb-3 ${config.badge}`}>
        {config.label}
      </Badge>

      <p className="text-sm text-gray-600 leading-relaxed flex-1">{rec.whyFit}</p>

      {rec.skillGaps.length > 0 && (
        <div className="mt-3">
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">Skill gaps</p>
          <div className="flex flex-wrap gap-1">
            {rec.skillGaps.map((gap) => (
              <span key={gap} className="text-xs px-2 py-0.5 rounded-full bg-gray-50 border border-gray-200 text-gray-500">
                {gap}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-3">⏱ {rec.transitionTime}</p>

      <Button
        size="sm"
        className="mt-4 w-full"
        onClick={() => onExplore(rec)}
      >
        Explore path →
      </Button>
    </div>
  )
}
