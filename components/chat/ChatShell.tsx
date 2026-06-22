'use client'

import ChatFeed from './ChatFeed'

interface ChatShellProps {
  onAnswer: (option: string) => void
}

export default function ChatShell({ onAnswer }: ChatShellProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-8">
      <ChatFeed onAnswer={onAnswer} />
    </div>
  )
}
