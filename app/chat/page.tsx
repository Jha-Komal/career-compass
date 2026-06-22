'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCareerStore } from '@/store/career-store'
import ChatShell from '@/components/chat/ChatShell'

export default function ChatPage() {
  const router = useRouter()
  const { resumeText } = useCareerStore()

  useEffect(() => {
    if (!resumeText) router.replace('/')
  }, [resumeText, router])

  if (!resumeText) return null

  return (
    <main className="min-h-screen bg-white pt-8">
      <ChatShell onAnswer={() => {}} />
    </main>
  )
}
