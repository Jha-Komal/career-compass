import { Button } from '@/components/ui/button'
import type { Recommendation } from '@/types'

const CATEGORY_CONFIG: Record<Recommendation['category'], {
  label: string
  topBorder: string
  badge: string
  score: string
}> = {
  switch:    { label: 'Career Switch',  topBorder: 'border-t-indigo-500',  badge: 'bg-indigo-950/60 text-indigo-300 border-indigo-800',   score: 'text-indigo-400' },
  growth:    { label: 'Career Growth',  topBorder: 'border-t-emerald-500', badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-800', score: 'text-emerald-400' },
  education: { label: 'Education',      topBorder: 'border-t-amber-500',   badge: 'bg-amber-950/60 text-amber-300 border-amber-800',       score: 'text-amber-400' },
}

interface RecommendationCardProps {
  rec: Recommendation
  onExplore: (rec: Recommendation) => void
}

export default function RecommendationCard({ rec, onExplore }: RecommendationCardProps) {
  const config = CATEGORY_CONFIG[rec.category]
  return (
    <div className={`flex flex-col bg-card rounded-2xl border border-border border-t-4 ${config.topBorder} p-5 h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-card-foreground leading-tight">{rec.title}</h3>
        <span className={`shrink-0 text-xl font-bold tabular-nums ${config.score}`}>{rec.matchScore}%</span>
      </div>

      <span className={`inline-block w-fit text-xs font-medium px-2.5 py-0.5 rounded-full border mb-3 ${config.badge}`}>
        {config.label}
      </span>

      <p className="text-sm text-muted-foreground leading-relaxed flex-1">{rec.whyFit}</p>

      {rec.skillGaps.length > 0 && (
        <div className="mt-3">
          <p className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wide mb-1.5">Skill gaps</p>
          <div className="flex flex-wrap gap-1">
            {rec.skillGaps.map((gap) => (
              <span key={gap} className="text-xs px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                {gap}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground/50 mt-3">⏱ {rec.transitionTime}</p>

      <Button size="sm" className="mt-4 w-full" onClick={() => onExplore(rec)}>
        Explore path →
      </Button>
    </div>
  )
}
