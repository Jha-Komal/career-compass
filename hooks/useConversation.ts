'use client'

import { useEffect, useRef } from 'react'
import { useCareerStore } from '@/store/career-store'
import type { UserAnswers } from '@/types'

const QUESTIONS = [
  {
    key: 'motivation' as keyof UserAnswers,
    content: 'Which outcome matters most to you over the next 3–5 years?',
    options: ['Higher earning potential', 'More ownership', 'More strategic work', 'Faster career growth'],
  },
  {
    key: 'inclination' as keyof UserAnswers,
    content: 'Which direction feels most exciting?',
    options: ['Building products', 'Driving growth', 'Solving business problems', 'Managing people'],
  },
  {
    key: 'riskAppetite' as keyof UserAnswers,
    content: 'How much career risk are you willing to take?',
    options: ['Low', 'Medium', 'High'],
  },
  {
    key: 'openness' as keyof UserAnswers,
    content: 'Which of these paths would you be most open to pursuing?',
    options: ['Career switch', 'Career growth in current field', 'Higher education', 'Open to all options'],
  },
  {
    key: 'educationReadiness' as keyof UserAnswers,
    content: 'If higher education is an option, where are you currently in that journey?',
    options: ['IELTS/GRE/GMAT completed', 'Preparing for exams', 'Planning to start', "Haven't explored it yet"],
  },
]

const STUDY_ABROAD_QUESTIONS = [
  {
    key: 'preferredField' as keyof UserAnswers,
    content: 'What field are you interested in studying?',
    options: ['Business Analytics', 'MBA', 'Data Science', 'Computer Science', 'AI / ML', 'Product Management', 'Other'],
  },
  {
    key: 'preferredCountry' as keyof UserAnswers,
    content: 'Which country are you considering?',
    options: ['USA', 'Canada', 'Germany', 'UK', 'Australia', 'Open'],
  },
  {
    key: 'budget' as keyof UserAnswers,
    content: 'What is your total budget (tuition + living costs)?',
    options: ['Under ₹20L', '₹20–40L', '₹40–60L', '₹60L+'],
  },
  {
    key: 'universityPreference' as keyof UserAnswers,
    content: 'Do you have a university type preference?',
    options: ['Public', 'Private', 'No Preference'],
  },
]

export const ALL_QUESTIONS = [...QUESTIONS, ...STUDY_ABROAD_QUESTIONS]

export function useConversation() {
  const store = useCareerStore()
  const mainInitialized = useRef(false)
  const studyInitialized = useRef(false)

  useEffect(() => {
    if (store.stage === 'conversation' && !mainInitialized.current) {
      mainInitialized.current = true
      const hasExistingQuestions = store.messages.some((m) => m.role === 'ai' && m.options)
      if (!hasExistingQuestions) {
        store.addMessage({
          role: 'ai',
          content: QUESTIONS[0].content,
          options: QUESTIONS[0].options,
        })
      }
    }
  }, [store.stage])

  async function answerQuestion(questionKey: keyof UserAnswers, option: string) {
    store.setAnswer(questionKey, option)

    const msgs = useCareerStore.getState().messages
    const lastAiIdx = [...msgs].reverse().findIndex((m) => m.role === 'ai' && m.options?.length && !m.selectedOption)
    if (lastAiIdx !== -1) {
      const idx = msgs.length - 1 - lastAiIdx
      const updated = msgs.map((m, i) => (i === idx ? { ...m, selectedOption: option } : m))
      useCareerStore.setState({ messages: updated })
    }

    store.addMessage({ role: 'user', content: option })

    const mainQIdx = QUESTIONS.findIndex((q) => q.key === questionKey)
    const studyQIdx = STUDY_ABROAD_QUESTIONS.findIndex((q) => q.key === questionKey)

    if (mainQIdx !== -1) {
      const nextIdx = mainQIdx + 1
      if (nextIdx < QUESTIONS.length) {
        store.addMessage({ role: 'ai', content: QUESTIONS[nextIdx].content, options: QUESTIONS[nextIdx].options })
      } else {
        await fetchCareerRecommendations(option, questionKey)
      }
    } else if (studyQIdx !== -1) {
      const nextIdx = studyQIdx + 1
      if (nextIdx < STUDY_ABROAD_QUESTIONS.length) {
        store.addMessage({ role: 'ai', content: STUDY_ABROAD_QUESTIONS[nextIdx].content, options: STUDY_ABROAD_QUESTIONS[nextIdx].options })
      } else {
        await fetchStudyAbroadRecommendations(option, questionKey)
      }
    }
  }

  async function fetchCareerRecommendations(lastOption: string, lastKey: keyof UserAnswers) {
    store.setStage('analyzing')
    const state = useCareerStore.getState()
    const answers = { ...state.answers, [lastKey]: lastOption }

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: state.resumeText,
          analysis: state.analysis,
          answers,
          previousTitles: [],
          mode: 'career',
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error)
      store.addRecommendationRound(data.recommendations)
      store.setStage('results')

      const shouldOfferStudyAbroad = ['Higher education', 'Open to all options'].includes(answers.openness ?? '')
      if (shouldOfferStudyAbroad) {
        store.addMessage({
          role: 'ai',
          content: "Since you're open to higher education, I can also find matching universities for you. Would you like that?",
          options: ['Yes, find universities', 'No thanks'],
        })
      } else {
        store.setStage('dashboard')
      }
    } catch {
      store.addMessage({
        role: 'ai',
        content: 'Something went wrong generating your recommendations. Please try again.',
        options: ['Retry'],
      })
      store.setStage('conversation')
    }
  }

  async function fetchStudyAbroadRecommendations(lastOption: string, lastKey: keyof UserAnswers) {
    store.setStage('analyzing')
    const state = useCareerStore.getState()
    const answers = { ...state.answers, [lastKey]: lastOption }

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: state.resumeText,
          analysis: state.analysis,
          answers,
          previousTitles: [],
          mode: 'study-abroad',
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error)
      store.addRecommendationRound(data.recommendations)
      store.setStage('dashboard')
    } catch {
      store.addMessage({ role: 'ai', content: 'Something went wrong. Please try again.', options: ['Retry'] })
      store.setStage('study-abroad')
    }
  }

  function editAnswer(msgIndex: number, newOption: string) {
    const msgs = useCareerStore.getState().messages
    const msg = msgs[msgIndex]
    const q = ALL_QUESTIONS.find((q) => q.content === msg.content)
    if (!q) return

    const mainIdx = QUESTIONS.findIndex((q2) => q2.key === q.key)
    const studyIdx = STUDY_ABROAD_QUESTIONS.findIndex((q2) => q2.key === q.key)

    const keysToReset: (keyof UserAnswers)[] =
      mainIdx !== -1
        ? [...QUESTIONS.slice(mainIdx).map((q2) => q2.key), ...STUDY_ABROAD_QUESTIONS.map((q2) => q2.key)]
        : STUDY_ABROAD_QUESTIONS.slice(studyIdx).map((q2) => q2.key)

    const state = useCareerStore.getState()
    const newAnswers = { ...state.answers }
    keysToReset.forEach((key) => delete newAnswers[key])

    const truncatedMsgs = msgs
      .slice(0, msgIndex + 1)
      .map((m, i) => (i === msgIndex ? { ...m, selectedOption: undefined } : m))

    useCareerStore.setState({
      messages: truncatedMsgs,
      answers: newAnswers,
      recommendations: mainIdx !== -1 ? [] : state.recommendations.slice(0, 1),
      stage: 'conversation',
    })

    if (mainIdx !== -1) {
      studyInitialized.current = false
    }

    answerQuestion(q.key, newOption)
  }

  function handleAnswer(option: string) {
    if (option === 'Yes, find universities') {
      if (!studyInitialized.current) {
        studyInitialized.current = true
        store.setStage('study-abroad')
        store.addMessage({ role: 'ai', content: STUDY_ABROAD_QUESTIONS[0].content, options: STUDY_ABROAD_QUESTIONS[0].options })
      }
      return
    }

    if (option === 'No thanks') {
      store.setStage('dashboard')
      return
    }

    if (option === 'Retry') {
      const state = useCareerStore.getState()
      if (state.stage === 'study-abroad') {
        fetchStudyAbroadRecommendations('', 'universityPreference')
      } else {
        fetchCareerRecommendations('', 'educationReadiness')
      }
      return
    }

    const msgs = useCareerStore.getState().messages
    for (let i = msgs.length - 1; i >= 0; i--) {
      const msg = msgs[i]
      if (msg.role === 'ai' && msg.options?.length && !msg.selectedOption) {
        const q = ALL_QUESTIONS.find((q) => q.content === msg.content)
        if (q) {
          answerQuestion(q.key, option)
          return
        }
      }
    }
  }

  return { handleAnswer, editAnswer }
}
