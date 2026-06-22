'use client'

import { useEffect, useState } from 'react'
import { useCareerStore } from '@/store/career-store'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
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
      } catch (e) {
        if (!cancelled) setError('Could not load details. Please try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchDetail()
    return () => { cancelled = true }
  }, [rec.title])

  return (
    <Sheet open onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{rec.title}</SheetTitle>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-blue-600">{rec.matchScore}%</span>
            <Badge variant="secondary">Match</Badge>
          </div>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <section>
            <h3 className="text-sm font-semibold mb-1">Why it fits</h3>
            <p className="text-sm text-gray-700">{rec.whyFit}</p>
          </section>

          <section>
            <h3 className="text-sm font-semibold mb-1">Opportunity</h3>
            <p className="text-sm text-gray-700">{rec.opportunity}</p>
          </section>

          {loading && (
            <p className="text-sm text-gray-400 animate-pulse">Loading deeper analysis…</p>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          {detail && (
            <>
              <Separator />

              <section>
                <h3 className="text-sm font-semibold mb-1">Why you're a strong fit</h3>
                <p className="text-sm text-gray-700">{detail.whyStrongFit}</p>
              </section>

              <section>
                <h3 className="text-sm font-semibold mb-2">Existing strengths</h3>
                <div className="flex flex-wrap gap-1">
                  {detail.existingStrengths.map((s) => (
                    <Badge key={s} className="text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold mb-2">Gaps to close</h3>
                <div className="flex flex-wrap gap-1">
                  {detail.gapsToClose.map((g) => (
                    <Badge key={g} variant="outline" className="text-xs">
                      {g}
                    </Badge>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold mb-2">90-day plan</h3>
                <ol className="space-y-2">
                  {detail.plan90Day.map((step, i) => (
                    <li key={i} className="text-sm">
                      <span className="font-medium text-blue-600">{step.month}: </span>
                      {step.action}
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
