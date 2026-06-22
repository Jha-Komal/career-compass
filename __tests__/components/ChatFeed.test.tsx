import { render, screen } from '@testing-library/react'
import ChatFeed from '@/components/chat/ChatFeed'
import type { ChatMessage } from '@/types'

const messages: ChatMessage[] = [
  { role: 'ai', content: 'Hello, I reviewed your resume.' },
  { role: 'user', content: 'Thanks!', selectedOption: 'Thanks!' },
  { role: 'ai', content: 'What is your main goal?', options: ['Growth', 'Switch'] },
]

jest.mock('@/store/career-store', () => ({
  useCareerStore: () => ({ messages, stage: 'conversation' }),
}))

test('renders all messages', () => {
  render(<ChatFeed onAnswer={jest.fn()} />)
  expect(screen.getByText('Hello, I reviewed your resume.')).toBeInTheDocument()
  expect(screen.getByText('Thanks!')).toBeInTheDocument()
  expect(screen.getByText('What is your main goal?')).toBeInTheDocument()
})

test('renders option chips for last AI message with unanswered options', () => {
  render(<ChatFeed onAnswer={jest.fn()} />)
  expect(screen.getByText('Growth')).toBeInTheDocument()
  expect(screen.getByText('Switch')).toBeInTheDocument()
})
