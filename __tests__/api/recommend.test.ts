/** @jest-environment node */
import { POST } from '@/app/api/recommend/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/gemini', () => ({
  generateText: jest.fn().mockResolvedValue(JSON.stringify({
    recommendations: [
      { title: 'Product Manager', category: 'switch', matchScore: 92, whyFit: 'x', opportunity: 'y', skillGaps: ['analytics'], transitionTime: '6m' },
      { title: 'Growth Manager', category: 'switch', matchScore: 88, whyFit: 'x', opportunity: 'y', skillGaps: ['sql'], transitionTime: '6m' },
      { title: 'MBA', category: 'education', matchScore: 80, whyFit: 'x', opportunity: 'y', skillGaps: [], transitionTime: '2y' },
    ],
  })),
}))

function makeRecommendRequest(body: object) {
  return new NextRequest('http://localhost/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

test('returns 3 recommendations', async () => {
  const res = await POST(makeRecommendRequest({
    resumeText: 'Jane resume',
    analysis: {},
    answers: { motivation: 'ownership' },
    previousTitles: [],
    mode: 'career',
  }))
  const data = await res.json()
  expect(data.recommendations).toHaveLength(3)
  expect(data.recommendations[0].title).toBe('Product Manager')
})
