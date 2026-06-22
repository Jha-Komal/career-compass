'use client'

import { useEffect, useState } from 'react'
import { useCareerStore } from '@/store/career-store'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import type { Recommendation } from '@/types'

interface ExploreDrawerProps {
  rec: Recommendation
  onClose: () => void
}

interface RecDetail {
  whyStrongFit: string
  existingStrengths: string[]
  gapsToClose: string[]
  plan90Day: { month: string; action: string }[]
}

const CATEGORY_SCORE_COLOR: Record<Recommendation['category'], string> = {
  switch:    'text-indigo-400',
  growth:    'text-emerald-400',
  education: 'text-amber-400',
}

export default function ExploreDrawer({ rec, onClose }: ExploreDrawerProps) {
  const { resumeText, analysis, answers, setRecDetail } = useCareerStore()
  const [detail, setDetail] = useState<RecDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchDetail() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/explore', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeText, analysis, answers, recommendation: rec }),
        })
        const data = await res.json()
        if (!res.ok || data.error) throw new Error(data.error ?? 'Failed')
        if (!cancelled) {
          setDetail(data)
          setRecDetail(rec, data)
        }
      } catch {
        if (!cancelled) setError('Could not load details. Please try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchDetail()
    return () => { cancelled = true }
  }, [rec.title])

  const scoreColor = CATEGORY_SCORE_COLOR[rec.category]

  return (
    <Sheet open onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto bg-card border-border">
        <SheetHeader className="pb-2">
          <SheetTitle className="text-foreground">{rec.title}</SheetTitle>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-2xl font-bold tabular-nums ${scoreColor}`}>{rec.matchScore}%</span>
            <span className="text-xs text-muted-foreground">match</span>
          </div>
        </SheetHeader>

        <div className="mt-4 space-y-5">
          <section>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Why it fits</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{rec.whyFit}</p>
          </section>

          <section>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Opportunity</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{rec.opportunity}</p>
          </section>

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
              </div>
              Loading deeper analysis…
            </div>
          )}

          {error && (
            <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2">{error}</p>
          )}

          {detail && (
            <>
              <Separator className="bg-border" />

              <section>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Why you're a strong fit</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{detail.whyStrongFit}</p>
              </section>

              <section>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Existing strengths</h3>
                <div className="flex flex-wrap gap-1.5">
                  {detail.existingStrengths.map((s) => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-indigo-950/50 border border-indigo-900/50 text-indigo-300">
                      {s}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Gaps to close</h3>
                <div className="flex flex-wrap gap-1.5">
                  {detail.gapsToClose.map((g) => (
                    <span key={g} className="text-xs px-2.5 py-1 rounded-full bg-muted border border-border text-muted-foreground">
                      {g}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">90-day plan</h3>
                <ol className="space-y-3">
                  {detail.plan90Day.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-950/60 border border-indigo-800 text-indigo-400 text-xs flex items-center justify-center font-semibold mt-0.5">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-medium text-indigo-400 text-xs mb-0.5">{step.month}</p>
                        <p className="text-muted-foreground leading-relaxed">{step.action}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
