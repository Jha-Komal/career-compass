import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash']

function getModelForName(name: string) {
  return genAI.getGenerativeModel({
    model: name,
    generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
  })
}

export function getModel() {
  return getModelForName(MODELS[0])
}

export async function generateWithRetry(
  fn: (model: ReturnType<typeof getModelForName>) => Promise<unknown>,
  maxAttempts = 3,
): Promise<unknown> {
  let lastError: unknown
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const modelName = MODELS[Math.min(attempt, MODELS.length - 1)]
    try {
      return await fn(getModelForName(modelName))
    } catch (err: unknown) {
      lastError = err
      const is503 = err instanceof Error && (err.message.includes('503') || err.message.includes('Service Unavailable') || err.message.includes('overloaded'))
      if (!is503) throw err
      if (attempt < maxAttempts - 1) {
        await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)))
      }
    }
  }
  throw lastError
}
