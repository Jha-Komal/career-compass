import OptionChips from './OptionChips'
import type { ChatMessage as ChatMessageType } from '@/types'

interface ChatMessageProps {
  message: ChatMessageType
  isLast: boolean
  onAnswer: (option: string) => void
}

export default function ChatMessage({ message, isLast, onAnswer }: ChatMessageProps) {
  const isAi = message.role === 'ai'
  return (
    <div className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[80%] ${isAi ? '' : 'items-end flex flex-col'}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isAi
              ? 'bg-gray-100 text-gray-900 rounded-tl-none'
              : 'bg-blue-600 text-white rounded-tr-none'
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
