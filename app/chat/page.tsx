'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCareerStore } from '@/store/career-store'
import ChatShell from '@/components/chat/ChatShell'
import ExploreDrawer from '@/components/recommendations/ExploreDrawer'
import { useConversation } from '@/hooks/useConversation'
import type { Recommendation } from '@/types'

export default function ChatPage() {
  const router = useRouter()
  const { resumeText } = useCareerStore()
  const { handleAnswer, editAnswer } = useConversation()
  const [exploringRec, setExploringRec] = useState<Recommendation | null>(null)

  useEffect(() => {
    if (!resumeText) router.replace('/')
  }, [resumeText, router])

  if (!resumeText) return null

  return (
    <>
      <ChatShell onAnswer={handleAnswer} onEditAnswer={editAnswer} onExplore={setExploringRec} />
      {exploringRec && (
        <ExploreDrawer rec={exploringRec} onClose={() => setExploringRec(null)} />
      )}
    </>
  )
}
