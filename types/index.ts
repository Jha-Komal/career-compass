export type Stage = 'analyzing' | 'conversation' | 'results' | 'study-abroad' | 'closing' | 'dashboard'

export type ChatMessage = {
  role: 'ai' | 'user'
  content: string
  options?: string[]
  selectedOption?: string
}

export type ResumeAnalysis = {
  name?: string
  persona: string
  career_stage: string
  strengths: string[]
  growth_signals: string[]
  career_tensions: string[]
  study_abroad_fit: string
}

export type Recommendation = {
  title: string
  category: 'switch' | 'growth' | 'education'
  matchScore: number
  whyFit: string
  opportunity: string
  skillGaps: string[]
  transitionTime: string
  country?: string
  estimatedCost?: string
  publicPrivate?: string
  ranking?: string
  expectedOutcomes?: string[]
  detail?: {
    whyStrongFit: string
    existingStrengths: string[]
    gapsToClose: string[]
    plan90Day: { month: string; action: string }[]
  }
}

export type UserAnswers = {
  motivation?: string
  inclination?: string
  riskAppetite?: string
  openness?: string
  educationReadiness?: string
  preferredField?: string
  preferredCountry?: string
  budget?: string
  universityPreference?: string
}
