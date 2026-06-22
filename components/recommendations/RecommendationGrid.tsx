'use client'

import { useCareerStore } from '@/store/career-store'
import RecommendationCard from './RecommendationCard'
import type { Recommendation } from '@/types'

interface RecommendationGridProps {
  onExplore?: (rec: Recommendation) => void
}

export default function RecommendationGrid({ onExplore }: RecommendationGridProps) {
  const { recommendations, stage, setExploredRec } = useCareerStore()

  if (stage !== 'results' || recommendations.length === 0) return null

  const currentRound = recommendations[recommendations.length - 1]

  function handleExplore(rec: Recommendation) {
    setExploredRec(rec)
    onExplore?.(rec)
  }

  return (
    <div className="mt-6">
      <p className="text-sm font-medium text-gray-500 mb-3">
        Your top matches — Round {recommendations.length}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {currentRound.map((rec) => (
          <RecommendationCard key={rec.title} rec={rec} onExplore={handleExplore} />
        ))}
      </div>
    </div>
  )
}
