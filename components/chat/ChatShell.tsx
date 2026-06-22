'use client'

import ChatFeed from './ChatFeed'
import RecommendationGrid from '@/components/recommendations/RecommendationGrid'
import FinalSummary from '@/components/recommendations/FinalSummary'

interface ChatShellProps {
  onAnswer: (option: string) => void
  onExplore?: (rec: import('@/types').Recommendation) => void
}

export default function ChatShell({ onAnswer, onExplore }: ChatShellProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-8">
      <ChatFeed onAnswer={onAnswer} />
      <RecommendationGrid onExplore={onExplore} />
      <FinalSummary />
    </div>
  )
}
