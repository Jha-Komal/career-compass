'use client'

import { useEffect, useRef } from 'react'
import { useCareerStore } from '@/store/career-store'
import ChatMessage from './ChatMessage'
import LoadingMessage from './LoadingMessage'

interface ChatFeedProps {
  onAnswer: (option: string) => void
}

export default function ChatFeed({ onAnswer }: ChatFeedProps) {
  const { messages, stage } = useCareerStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, stage])

  return (
    <div className="flex flex-col gap-4 py-4">
      {messages.map((msg, i) => (
        <ChatMessage
          key={i}
          message={msg}
          isLast={i === messages.length - 1}
          onAnswer={onAnswer}
        />
      ))}
      {stage === 'analyzing' && <LoadingMessage />}
      <div ref={bottomRef} />
    </div>
  )
}
