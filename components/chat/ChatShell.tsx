'use client'

import ChatFeed from './ChatFeed'
import RecommendationGrid from '@/components/recommendations/RecommendationGrid'
import Dashboard from '@/components/recommendations/Dashboard'
import type { Recommendation } from '@/types'

interface ChatShellProps {
  onAnswer: (option: string) => void
  onEditAnswer: (msgIndex: number, option: string) => void
  onExplore?: (rec: Recommendation) => void
}

export default function ChatShell({ onAnswer, onEditAnswer, onExplore }: ChatShellProps) {
  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm shadow-indigo-900/50">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground leading-none">AI Career Compass</p>
          <p className="text-xs text-indigo-400 mt-0.5">Powered by AI</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <ChatFeed onAnswer={onAnswer} onEditAnswer={onEditAnswer} />
          <div className="px-4 pb-8">
            <RecommendationGrid onExplore={onExplore} />
            <Dashboard onExplore={onExplore} />
          </div>
        </div>
      </div>
    </div>
  )
}
