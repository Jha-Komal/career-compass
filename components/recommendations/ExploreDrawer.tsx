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

          <Separator className="bg-border" />

          <a
            href="https://leapscholar.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-between gap-3 w-full px-4 py-3 rounded-xl border transition-all duration-150 group
              ${rec.category === 'education'
                ? 'bg-amber-950/30 border-amber-800/60 hover:bg-amber-950/50 hover:border-amber-700'
                : 'bg-indigo-950/30 border-indigo-800/60 hover:bg-indigo-950/50 hover:border-indigo-700'
              }
            `}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                ${rec.category === 'education' ? 'bg-amber-950/60' : 'bg-indigo-950/60'}`}
              >
                <svg className={`w-4 h-4 ${rec.category === 'education' ? 'text-amber-400' : 'text-indigo-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-1.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
              </div>
              <div>
                <p className={`text-xs font-semibold ${rec.category === 'education' ? 'text-amber-300' : 'text-indigo-300'}`}>
                  {rec.category === 'education' ? 'Plan your study abroad journey' : 'Explore study abroad options'}
                </p>
                <p className="text-[11px] text-muted-foreground/60 mt-0.5">leapscholar.com</p>
              </div>
            </div>
            <svg className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${rec.category === 'education' ? 'text-amber-500' : 'text-indigo-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>

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
