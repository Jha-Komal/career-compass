'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCareerStore } from '@/store/career-store'
import RecommendationCard from './RecommendationCard'
import { Button } from '@/components/ui/button'
import type { Recommendation } from '@/types'

interface DashboardProps {
  onExplore?: (rec: Recommendation) => void
}

export default function Dashboard({ onExplore }: DashboardProps) {
  const { stage, analysis, recommendations, setExploredRec } = useCareerStore()
  const [expandedTitles, setExpandedTitles] = useState<Set<string>>(new Set())
  const router = useRouter()

  if (stage !== 'dashboard' || recommendations.length === 0) return null

  const allRecs = recommendations.flat()
  const careerRecs = allRecs.filter((r) => r.category !== 'education')
  const educationRecs = allRecs.filter((r) => r.category === 'education')

  function toggleExpand(title: string) {
    setExpandedTitles((prev) => {
      const next = new Set(prev)
      next.has(title) ? next.delete(title) : next.add(title)
      return next
    })
  }

  function handleExplore(rec: Recommendation) {
    setExploredRec(rec)
    onExplore?.(rec)
  }

  return (
    <div className="mt-4 animate-message">
      {/* Greeting header */}
      <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-violet-950/40 border border-indigo-900/50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-sm shadow-indigo-900/40">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-indigo-400 font-medium uppercase tracking-wide mb-0.5">Your results are in</p>
            <h2 className="text-lg font-bold text-foreground">
              Hey {analysis?.name ?? 'there'}, your dashboard is ready!
            </h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {allRecs.length} personalized {allRecs.length === 1 ? 'path' : 'paths'} · Based on your resume and answers
            </p>
          </div>
        </div>
      </div>

      {/* Career Paths */}
      {careerRecs.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 rounded-full bg-indigo-500" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Career Paths</p>
            <div className="flex-1 h-px bg-border/40" />
            <span className="text-xs text-muted-foreground/40">{careerRecs.length} options</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {careerRecs.map((rec) => (
              <RecommendationCard
                key={rec.title}
                rec={rec}
                expanded={expandedTitles.has(rec.title)}
                onToggleExpand={() => toggleExpand(rec.title)}
                onExplore={handleExplore}
              />
            ))}
          </div>
        </div>
      )}

      {/* University Options */}
      {educationRecs.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 rounded-full bg-amber-500" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">University Options</p>
            <div className="flex-1 h-px bg-border/40" />
            <span className="text-xs text-muted-foreground/40">{educationRecs.length} options</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {educationRecs.map((rec) => (
              <RecommendationCard
                key={rec.title}
                rec={rec}
                expanded={expandedTitles.has(rec.title)}
                onToggleExpand={() => toggleExpand(rec.title)}
                onExplore={handleExplore}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center mt-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/')}
          className="border-border/60 text-muted-foreground hover:bg-card hover:text-foreground"
        >
          Start a New Session
        </Button>
      </div>
    </div>
  )
}
