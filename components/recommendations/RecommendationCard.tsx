'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Recommendation } from '@/types'

const CATEGORY_CONFIG: Record<Recommendation['category'], {
  label: string
  topBorder: string
  badge: string
  score: string
  bullet: string
}> = {
  switch:    { label: 'Career Switch',  topBorder: 'border-t-indigo-500',  badge: 'bg-indigo-950/60 text-indigo-300 border-indigo-800',   score: 'text-indigo-400',  bullet: 'text-indigo-500' },
  growth:    { label: 'Career Growth',  topBorder: 'border-t-emerald-500', badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-800', score: 'text-emerald-400', bullet: 'text-emerald-500' },
  education: { label: 'Education',      topBorder: 'border-t-amber-500',   badge: 'bg-amber-950/60 text-amber-300 border-amber-800',       score: 'text-amber-400',   bullet: 'text-amber-500' },
}

function splitToBullets(text: string): [string, string] {
  const sentences = text.match(/[^.!?]+[.!?]+\s*/g) ?? []
  if (sentences.length < 2) return [text.trim(), '']
  const first = sentences[0].trim()
  const rest = sentences.slice(1).join('').trim()
  return [first, rest]
}

interface RecommendationCardProps {
  rec: Recommendation
  onExplore: (rec: Recommendation) => void
}

export default function RecommendationCard({ rec, onExplore }: RecommendationCardProps) {
  const [expanded, setExpanded] = useState(false)
  const config = CATEGORY_CONFIG[rec.category]
  const [bullet1, bullet2] = splitToBullets(rec.whyFit)
  const isEducation = rec.category === 'education'

  return (
    <div className={`flex flex-col bg-card rounded-2xl border border-border border-t-4 ${config.topBorder} p-5 h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20`}>

      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-card-foreground leading-tight">{rec.title}</h3>
        <span className={`shrink-0 text-xl font-bold tabular-nums ${config.score}`}>{rec.matchScore}%</span>
      </div>

      <span className={`inline-block w-fit text-xs font-medium px-2.5 py-0.5 rounded-full border mb-3 ${config.badge}`}>
        {config.label}
      </span>

      {isEducation && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {rec.publicPrivate && (
            <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-amber-950/30 border border-amber-900/40 text-amber-300/80">
              🏛 {rec.publicPrivate}
            </span>
          )}
          {rec.ranking && (
            <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-amber-950/30 border border-amber-900/40 text-amber-300/80">
              🏆 {rec.ranking}
            </span>
          )}
          {rec.estimatedCost && (
            <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-amber-950/30 border border-amber-900/40 text-amber-300/80">
              💰 {rec.estimatedCost}
            </span>
          )}
          {rec.country && (
            <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-amber-950/30 border border-amber-900/40 text-amber-300/80">
              🌍 {rec.country}
            </span>
          )}
        </div>
      )}

      <ul className="space-y-1.5 mb-1 flex-1">
        <li className="flex gap-2 text-sm text-muted-foreground">
          <span className={`${config.bullet} shrink-0 mt-0.5 font-bold`}>•</span>
          <span className={expanded ? '' : 'line-clamp-2'}>{bullet1}</span>
        </li>
        {bullet2 && (
          <li className="flex gap-2 text-sm text-muted-foreground">
            <span className={`${config.bullet} shrink-0 mt-0.5 font-bold`}>•</span>
            <span className={expanded ? '' : 'line-clamp-2'}>{bullet2}</span>
          </li>
        )}
      </ul>

      {bullet2 && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="self-start text-xs text-indigo-400 hover:text-indigo-300 transition-colors mt-1 mb-2"
        >
          {expanded ? 'Show less ↑' : 'Read more →'}
        </button>
      )}

      {rec.skillGaps.length > 0 && (
        <div className="mt-2">
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
