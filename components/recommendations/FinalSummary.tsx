'use client'

import { useCareerStore } from '@/store/career-store'
import { Button } from '@/components/ui/button'

interface FinalSummaryProps {
  onRestart?: () => void
}

export default function FinalSummary({ onRestart }: FinalSummaryProps) {
  const { stage, analysis } = useCareerStore()

  if (stage !== 'closing') return null

  return (
    <div className="mt-8 p-6 bg-blue-50 rounded-2xl text-center">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Career Compass is Set</h2>
      {analysis && (
        <p className="text-sm text-gray-600 mb-4">
          As a <strong>{analysis.persona}</strong>, your path forward is clearer than ever.
        </p>
      )}
      <Button variant="outline" onClick={onRestart}>
        Start a New Session
      </Button>
    </div>
  )
}
