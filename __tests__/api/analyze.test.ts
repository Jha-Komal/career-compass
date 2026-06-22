/** @jest-environment node */
import { POST } from '@/app/api/analyze/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/gemini', () => ({
  getModel: () => ({
    generateContent: jest.fn().mockResolvedValue({
      response: {
        text: () => JSON.stringify({
          resumeText: 'Jane Doe PM resume',
          analysis: { persona: 'Senior IC', career_stage: 'mid', strengths: ['leadership'], growth_signals: ['PM'], career_tensions: ['scope'], study_abroad_fit: 'low' },
          openingInsight: 'Great background in operations...',
        }),
      },
    }),
  }),
}))

function makePdfRequest() {
  const blob = new Blob(['%PDF fake'], { type: 'application/pdf' })
  const file = new File([blob], 'resume.pdf', { type: 'application/pdf' })
  const formData = new FormData()
  formData.append('file', file)
  return new NextRequest('http://localhost/api/analyze', { method: 'POST', body: formData })
}

test('returns resumeText, analysis, openingInsight', async () => {
  const res = await POST(makePdfRequest())
  const data = await res.json()
  expect(data.resumeText).toBe('Jane Doe PM resume')
  expect(data.analysis.persona).toBe('Senior IC')
  expect(data.openingInsight).toBe('Great background in operations...')
})

test('returns 400 when no file provided', async () => {
  const formData = new FormData()
  const req = new NextRequest('http://localhost/api/analyze', { method: 'POST', body: formData })
  const res = await POST(req)
  expect(res.status).toBe(400)
  const data = await res.json()
  expect(data.error).toBeDefined()
})
