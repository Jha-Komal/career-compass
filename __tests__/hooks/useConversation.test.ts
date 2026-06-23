import { renderHook, act, waitFor } from '@testing-library/react'
import { useConversation } from '@/hooks/useConversation'
import { useCareerStore } from '@/store/career-store'

global.fetch = jest.fn()

const baseState = {
  resumeText: 'Jane resume',
  analysis: { persona: 'IC', career_stage: 'mid', strengths: [], growth_signals: [], career_tensions: [], study_abroad_fit: 'low' },
  messages: [{ role: 'ai' as const, content: 'Great background...' }],
  answers: {},
  recommendations: [],
  stage: 'conversation' as const,
  exploredRec: null,
}

beforeEach(() => {
  useCareerStore.setState(baseState)
  jest.clearAllMocks()
})

test('appends Q1 on mount when stage is conversation', async () => {
  renderHook(() => useConversation())
  await waitFor(() => {
    const { messages } = useCareerStore.getState()
    expect(messages[messages.length - 1].content).toContain('outcome matters most')
  })
  expect(useCareerStore.getState().messages[useCareerStore.getState().messages.length - 1].options).toBeDefined()
})

test('handleAnswer with Q1 option advances to Q2', async () => {
  const { result } = renderHook(() => useConversation())
  // Wait for Q1 to be appended
  await waitFor(() => {
    const msgs = useCareerStore.getState().messages
    expect(msgs[msgs.length - 1].content).toContain('outcome matters most')
  })
  await act(async () => result.current.handleAnswer('More ownership'))
  const { messages, answers } = useCareerStore.getState()
  expect(answers.motivation).toBe('More ownership')
  expect(messages[messages.length - 1].content).toContain('direction feels most exciting')
})

test('handleAnswer after Q5 calls /api/recommend and sets stage to dashboard', async () => {
  const mockRecs = [
    { title: 'PM', category: 'switch', matchScore: 90, whyFit: 'x', opportunity: 'y', skillGaps: [], transitionTime: '6m' },
    { title: 'Growth', category: 'switch', matchScore: 85, whyFit: 'x', opportunity: 'y', skillGaps: [], transitionTime: '6m' },
    { title: 'MBA', category: 'education', matchScore: 80, whyFit: 'x', opportunity: 'y', skillGaps: [], transitionTime: '2y' },
  ]
  ;(global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ recommendations: mockRecs }),
  })

  // Pre-fill Q1–Q4 answers and messages so Q5 is the current question
  useCareerStore.setState({
    ...baseState,
    answers: { motivation: 'ownership', inclination: 'Building products', riskAppetite: 'Medium', openness: 'Career switch' },
    messages: [
      { role: 'ai', content: 'insight' },
      { role: 'ai', content: 'Q1 answered', options: ['a'], selectedOption: 'ownership' },
      { role: 'user', content: 'ownership' },
      { role: 'ai', content: 'Q2 answered', options: ['a'], selectedOption: 'Building products' },
      { role: 'user', content: 'Building products' },
      { role: 'ai', content: 'Q3 answered', options: ['a'], selectedOption: 'Medium' },
      { role: 'user', content: 'Medium' },
      { role: 'ai', content: 'Q4 answered', options: ['a'], selectedOption: 'Career switch' },
      { role: 'user', content: 'Career switch' },
      { role: 'ai', content: "If higher education is an option, where are you currently in that journey?", options: ["IELTS/GRE/GMAT completed", "Preparing for exams", "Planning to start", "Haven't explored it yet"] },
    ],
  })

  const { result } = renderHook(() => useConversation())
  await act(async () => result.current.handleAnswer("Haven't explored it yet"))

  await waitFor(() => expect(useCareerStore.getState().stage).toBe('dashboard'))
  expect(global.fetch).toHaveBeenCalledWith('/api/recommend', expect.objectContaining({ method: 'POST' }))
  expect(useCareerStore.getState().recommendations).toHaveLength(1)
})
