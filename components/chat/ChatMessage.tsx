import OptionChips from './OptionChips'
import type { ChatMessage as ChatMessageType } from '@/types'

interface ChatMessageProps {
  message: ChatMessageType
  isLast: boolean
  onAnswer: (option: string) => void
}

function AIAvatar() {
  return (
    <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    </div>
  )
}

export default function ChatMessage({ message, isLast, onAnswer }: ChatMessageProps) {
  const isAi = message.role === 'ai'
  return (
    <div className={`flex gap-2.5 animate-message ${isAi ? 'justify-start' : 'justify-end'}`}>
      {isAi && <AIAvatar />}
      <div className={`max-w-[78%] flex flex-col gap-2 ${isAi ? 'items-start' : 'items-end'}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isAi
              ? 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
              : 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-sm shadow-indigo-200 rounded-tr-none'
          }`}
        >
          {message.content}
        </div>
        {isAi && message.options && isLast && (
          <OptionChips
            options={message.options}
            selected={message.selectedOption}
            onSelect={onAnswer}
          />
        )}
      </div>
    </div>
  )
}
