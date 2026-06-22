import { render, screen, fireEvent } from '@testing-library/react'
import RecommendationCard from '@/components/recommendations/RecommendationCard'
import type { Recommendation } from '@/types'

const rec: Recommendation = {
  title: 'Product Manager',
  category: 'switch',
  matchScore: 87,
  whyFit: 'Strong cross-functional skills.',
  opportunity: 'High demand in SaaS.',
  skillGaps: ['Product strategy', 'Roadmapping'],
  transitionTime: '6–12 months',
}

test('renders title, score, and whyFit', () => {
  render(<RecommendationCard rec={rec} onExplore={jest.fn()} />)
  expect(screen.getByText('Product Manager')).toBeInTheDocument()
  expect(screen.getByText('87%')).toBeInTheDocument()
  expect(screen.getByText('Strong cross-functional skills.')).toBeInTheDocument()
})

test('calls onExplore when Explore button clicked', () => {
  const onExplore = jest.fn()
  render(<RecommendationCard rec={rec} onExplore={onExplore} />)
  fireEvent.click(screen.getByRole('button', { name: /explore/i }))
  expect(onExplore).toHaveBeenCalledWith(rec)
})
