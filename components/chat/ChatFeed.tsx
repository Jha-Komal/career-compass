'use client'

import { useEffect, useRef } from 'react'
import { useCareerStore } from '@/store/career-store'
import ChatMessage from './ChatMessage'
import LoadingMessage from './LoadingMessage'
import { ALL_QUESTIONS } from '@/hooks/useConversation'

interface ChatFeedProps {
  onAnswer: (option: string) => void
  onEditAnswer: (msgIndex: number, option: string) => void
}

export default function ChatFeed({ onAnswer, onEditAnswer }: ChatFeedProps) {
  const { messages, stage } = useCareerStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, stage])

  return (
    <div className="flex flex-col gap-5 py-6 px-4">
      {messages.map((msg, i) => {
        const isLast = i === messages.length - 1
        const isEditableQuestion =
          msg.role === 'ai' &&
          !!msg.options?.length &&
          ALL_QUESTIONS.some((q) => q.content === msg.content)
        return (
          <ChatMessage
            key={i}
            message={msg}
            isLast={isLast}
            onAnswer={onAnswer}
            onEditAnswer={isEditableQuestion && !isLast ? (opt) => onEditAnswer(i, opt) : undefined}
          />
        )
      })}
      {stage === 'analyzing' && <LoadingMessage />}
      <div ref={bottomRef} />
    </div>
  )
}
