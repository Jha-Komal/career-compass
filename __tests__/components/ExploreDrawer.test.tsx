import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ExploreDrawer from '@/components/recommendations/ExploreDrawer'
import type { Recommendation } from '@/types'

global.fetch = jest.fn().mockResolvedValue({ ok: false, json: async () => ({ error: 'no detail' }) })

const rec: Recommendation = {
  title: 'Product Manager',
  category: 'switch',
  matchScore: 87,
  whyFit: 'Strong cross-functional skills.',
  opportunity: 'High demand.',
  skillGaps: ['Roadmapping'],
  transitionTime: '6–12 months',
}

const detail = {
  whyStrongFit: 'You already think like a PM.',
  existingStrengths: ['Data analysis', 'Communication'],
  gapsToClose: ['Roadmapping'],
  plan90Day: [{ month: 'Month 1', action: 'Read PM books' }],
}

jest.mock('@/store/career-store', () => ({
  useCareerStore: () => ({
    resumeText: 'Jane resume',
    analysis: { persona: 'IC' },
    answers: { motivation: 'growth' },
    exploredRec: rec,
    setRecDetail: jest.fn(),
    setExploredRec: jest.fn(),
  }),
}))

test('renders open drawer with recommendation title', () => {
  render(<ExploreDrawer rec={rec} onClose={jest.fn()} />)
  expect(screen.getByText('Product Manager')).toBeInTheDocument()
})

test('fetches detail and renders plan on open', async () => {
  ;(global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => detail,
  })

  render(<ExploreDrawer rec={rec} onClose={jest.fn()} />)

  await waitFor(() => {
    expect(screen.getByText('You already think like a PM.')).toBeInTheDocument()
  })
  expect(screen.getByText('Read PM books')).toBeInTheDocument()
})

test('calls onClose when Sheet close button is clicked', async () => {
  const onClose = jest.fn()
  render(<ExploreDrawer rec={rec} onClose={onClose} />)
  const closeBtn = screen.getAllByRole('button', { name: /close/i })[0]
  fireEvent.click(closeBtn)
  expect(onClose).toHaveBeenCalled()
})
