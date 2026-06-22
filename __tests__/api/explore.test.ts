/** @jest-environment node */
import { POST } from '@/app/api/explore/route'
import { NextRequest } from 'next/server'

const mockDetail = {
  whyStrongFit: 'Your ops background maps directly to PM skills.',
  existingStrengths: ['process thinking', 'stakeholder management'],
  gapsToClose: ['product discovery', 'SQL'],
  plan90Day: [
    { month: 'Month 1', action: 'Complete PM Fundamentals course' },
    { month: 'Month 2', action: 'Build a case study' },
    { month: 'Month 3', action: 'Apply to APM roles' },
  ],
}

jest.mock('@/lib/gemini', () => ({
  getModel: () => ({
    generateContent: jest.fn().mockResolvedValue({
      response: { text: () => JSON.stringify(mockDetail) },
    }),
  }),
}))

test('returns explore detail with plan90Day', async () => {
  const req = new NextRequest('http://localhost/api/explore', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeText: 'Jane', analysis: {}, answers: {}, recommendation: { title: 'PM' } }),
  })
  const res = await POST(req)
  const data = await res.json()
  expect(data.whyStrongFit).toContain('ops background')
  expect(data.plan90Day).toHaveLength(3)
})
