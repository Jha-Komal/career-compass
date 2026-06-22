import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ResumeUploader from '@/components/landing/ResumeUploader'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }))

const mockSetResumeText = jest.fn()
const mockSetAnalysis = jest.fn()
const mockAddMessage = jest.fn()
const mockSetStage = jest.fn()

jest.mock('@/store/career-store', () => ({
  useCareerStore: () => ({
    setResumeText: mockSetResumeText,
    setAnalysis: mockSetAnalysis,
    addMessage: mockAddMessage,
    setStage: mockSetStage,
  }),
}))

global.fetch = jest.fn()

beforeEach(() => jest.clearAllMocks())

test('renders upload area', () => {
  render(<ResumeUploader />)
  expect(screen.getByText(/upload resume/i)).toBeInTheDocument()
})

test('accepts only PDF files', () => {
  render(<ResumeUploader />)
  const input = document.querySelector('input[type="file"]') as HTMLInputElement
  expect(input.accept).toBe('.pdf,application/pdf')
})

test('calls /api/analyze and redirects on success', async () => {
  const mockResponse = {
    resumeText: 'Jane resume',
    analysis: { persona: 'Senior IC', career_stage: 'mid', strengths: [], growth_signals: [], career_tensions: [], study_abroad_fit: 'low' },
    openingInsight: 'Great background...',
  }
  ;(global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => mockResponse,
  })

  render(<ResumeUploader />)
  const input = document.querySelector('input[type="file"]') as HTMLInputElement
  const file = new File(['pdf content'], 'resume.pdf', { type: 'application/pdf' })
  await userEvent.upload(input, file)

  await waitFor(() => expect(mockSetResumeText).toHaveBeenCalledWith('Jane resume'))
  expect(mockSetAnalysis).toHaveBeenCalledWith(mockResponse.analysis)
  expect(mockAddMessage).toHaveBeenCalledWith({ role: 'ai', content: 'Great background...' })
  expect(mockSetStage).toHaveBeenCalledWith('conversation')
  expect(mockPush).toHaveBeenCalledWith('/chat')
})
