import { create } from 'zustand'
import type { Stage, ChatMessage, ResumeAnalysis, Recommendation, UserAnswers } from '@/types'

interface CareerStore {
  resumeText: string
  analysis: ResumeAnalysis | null
  messages: ChatMessage[]
  answers: UserAnswers
  recommendations: Recommendation[][]
  stage: Stage
  exploredRec: Recommendation | null
  setResumeText: (text: string) => void
  setAnalysis: (a: ResumeAnalysis) => void
  addMessage: (m: ChatMessage) => void
  setAnswer: (key: keyof UserAnswers, value: string) => void
  addRecommendationRound: (recs: Recommendation[]) => void
  setStage: (s: Stage) => void
  setExploredRec: (r: Recommendation | null) => void
  setRecDetail: (rec: Recommendation, detail: NonNullable<Recommendation['detail']>) => void
}

export const useCareerStore = create<CareerStore>((set) => ({
  resumeText: '',
  analysis: null,
  messages: [],
  answers: {},
  recommendations: [],
  stage: 'analyzing',
  exploredRec: null,
  setResumeText: (text) => set({ resumeText: text }),
  setAnalysis: (a) => set({ analysis: a }),
  addMessage: (m) => set((state) => ({ messages: [...state.messages, m] })),
  setAnswer: (key, value) => set((state) => ({ answers: { ...state.answers, [key]: value } })),
  addRecommendationRound: (recs) => set((state) => ({ recommendations: [...state.recommendations, recs] })),
  setStage: (s) => set({ stage: s }),
  setExploredRec: (r) => set({ exploredRec: r }),
  setRecDetail: (rec, detail) =>
    set((state) => ({
      recommendations: state.recommendations.map((round_recs) =>
        round_recs.map((r) => (r.title === rec.title ? { ...r, detail } : r))
      ),
    })),
}))

