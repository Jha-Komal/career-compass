import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Both models have 1,500 RPD free — 2.5-flash has only 20 RPD so excluded
const MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash']

function getModelForName(name: string) {
  return genAI.getGenerativeModel({
    model: name,
    generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
  })
}

export function getModel() {
  return getModelForName(MODELS[0])
}

function isRetryable(err: unknown): boolean {
  if (!(err instanceof Error)) return false
  const msg = err.message
  return (
    msg.includes('503') ||
    msg.includes('429') ||
    msg.includes('Service Unavailable') ||
    msg.includes('overloaded') ||
    msg.includes('quota') ||
    msg.includes('rate limit') ||
    msg.includes('RESOURCE_EXHAUSTED')
  )
}

export async function generateWithRetry(
  fn: (model: ReturnType<typeof getModelForName>) => Promise<unknown>,
  maxAttempts = MODELS.length,
): Promise<unknown> {
  let lastError: unknown
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const modelName = MODELS[Math.min(attempt, MODELS.length - 1)]
    try {
      return await fn(getModelForName(modelName))
    } catch (err: unknown) {
      lastError = err
      if (!isRetryable(err)) throw err
      if (attempt < maxAttempts - 1) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)))
      }
    }
  }
  throw lastError
}
