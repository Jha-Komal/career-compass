import { act, renderHook } from '@testing-library/react'
import { useCareerStore } from '@/store/career-store'

beforeEach(() => {
  useCareerStore.setState({
    resumeText: '',
    analysis: null,
    messages: [],
    answers: {},
    recommendations: [],
    stage: 'analyzing',
    exploredRec: null,
  })
})

test('setResumeText updates resumeText', () => {
  const { result } = renderHook(() => useCareerStore())
  act(() => result.current.setResumeText('Jane Doe, Senior PM'))
  expect(result.current.resumeText).toBe('Jane Doe, Senior PM')
})

test('addMessage appends to messages', () => {
  const { result } = renderHook(() => useCareerStore())
  act(() => result.current.addMessage({ role: 'ai', content: 'Hello', options: ['A', 'B'] }))
  expect(result.current.messages).toHaveLength(1)
  expect(result.current.messages[0].content).toBe('Hello')
})

test('setAnswer sets a key in answers', () => {
  const { result } = renderHook(() => useCareerStore())
  act(() => result.current.setAnswer('motivation', 'Higher earning potential'))
  expect(result.current.answers.motivation).toBe('Higher earning potential')
})

test('addRecommendationRound appends a round', () => {
  const { result } = renderHook(() => useCareerStore())
  const recs = [{ title: 'PM', category: 'switch' as const, matchScore: 90, whyFit: 'x', opportunity: 'y', skillGaps: [], transitionTime: '3m' }]
  act(() => result.current.addRecommendationRound(recs))
  expect(result.current.recommendations).toHaveLength(1)
  expect(result.current.recommendations[0][0].title).toBe('PM')
})

test('setRecDetail patches nested recommendation', () => {
  const { result } = renderHook(() => useCareerStore())
  const rec = { title: 'PM', category: 'switch' as const, matchScore: 90, whyFit: 'x', opportunity: 'y', skillGaps: [], transitionTime: '3m' }
  act(() => result.current.addRecommendationRound([rec]))
  const detail = { whyStrongFit: 'great', existingStrengths: ['leadership'], gapsToClose: ['analytics'], plan90Day: [{ month: 'Month 1', action: 'Learn SQL' }] }
  act(() => result.current.setRecDetail(rec, detail))
  expect(result.current.recommendations[0][0].detail?.whyStrongFit).toBe('great')
})
