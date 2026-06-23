import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Stage, ChatMessage, ResumeAnalysis, Recommendation, UserAnswers } from '@/types'

interface CareerStore {
  _hasHydrated: boolean
  resumeText: string
  analysis: ResumeAnalysis | null
  messages: ChatMessage[]
  answers: UserAnswers
  recommendations: Recommendation[][]
  stage: Stage
  exploredRec: Recommendation | null
  setHasHydrated: (v: boolean) => void
  setResumeText: (text: string) => void
  setAnalysis: (a: ResumeAnalysis) => void
  addMessage: (m: ChatMessage) => void
  setAnswer: (key: keyof UserAnswers, value: string) => void
  addRecommendationRound: (recs: Recommendation[]) => void
  setStage: (s: Stage) => void
  setExploredRec: (r: Recommendation | null) => void
  setRecDetail: (rec: Recommendation, detail: NonNullable<Recommendation['detail']>) => void
  reset: () => void
}

const INITIAL_STATE = {
  _hasHydrated: false,
  resumeText: '',
  analysis: null as ResumeAnalysis | null,
  messages: [] as ChatMessage[],
  answers: {} as UserAnswers,
  recommendations: [] as Recommendation[][],
  stage: 'analyzing' as Stage,
  exploredRec: null as Recommendation | null,
}

export const useCareerStore = create<CareerStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      setHasHydrated: (v) => set({ _hasHydrated: v }),
      setResumeText: (text) => set({ resumeText: text }),
      setAnalysis: (a) => set({ analysis: a }),
      addMessage: (m) => set((state) => ({ messages: [...state.messages, m] })),
      setAnswer: (key, value) => set((state) => ({ answers: { ...state.answers, [key]: value } })),
      addRecommendationRound: (recs) =>
        set((state) => ({ recommendations: [...state.recommendations, recs] })),
      setStage: (s) => set({ stage: s }),
      setExploredRec: (r) => set({ exploredRec: r }),
      setRecDetail: (rec, detail) =>
        set((state) => ({
          recommendations: state.recommendations.map((round_recs) =>
            round_recs.map((r) => (r.title === rec.title ? { ...r, detail } : r))
          ),
        })),
      reset: () => set({ ...INITIAL_STATE, _hasHydrated: true }),
    }),
    {
      name: 'career-compass',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        resumeText: state.resumeText,
        analysis: state.analysis,
        messages: state.messages,
        answers: state.answers,
        recommendations: state.recommendations,
        stage: state.stage,
        exploredRec: state.exploredRec,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
