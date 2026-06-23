import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash']
const OPENAI_TEXT_MODELS = ['gpt-4o-mini', 'gpt-4o']
const OPENAI_PDF_MODEL = 'gpt-4o'

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
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('rate_limit_exceeded')
  )
}

async function withRetry<T>(models: string[], fn: (model: string) => Promise<T>): Promise<T> {
  let lastError: unknown
  for (let i = 0; i < models.length; i++) {
    try {
      return await fn(models[i])
    } catch (err) {
      lastError = err
      if (!isRetryable(err)) throw err
      if (i < models.length - 1) await new Promise((r) => setTimeout(r, 1000 * (i + 1)))
    }
  }
  throw lastError
}

export async function generateText(prompt: string): Promise<string> {
  if (process.env.OPENAI_API_KEY) {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    return withRetry(OPENAI_TEXT_MODELS, async (model) => {
      const res = await openai.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      })
      return res.choices[0].message.content ?? ''
    })
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  return withRetry(GEMINI_MODELS, async (model) => {
    const m = genAI.getGenerativeModel({
      model,
      generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
    })
    const result = await m.generateContent(prompt)
    return result.response.text()
  })
}

export async function generateFromPDF(base64: string, prompt: string): Promise<string> {
  if (process.env.OPENAI_API_KEY) {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    return withRetry([OPENAI_PDF_MODEL], async (model) => {
      const res = await openai.responses.create({
        model,
        input: [
          {
            role: 'user',
            content: [
              {
                type: 'input_file' as const,
                filename: 'resume.pdf',
                file_data: `data:application/pdf;base64,${base64}`,
              },
              {
                type: 'input_text' as const,
                text: prompt,
              },
            ],
          },
        ],
        temperature: 0.7,
        text: { format: { type: 'json_object' } },
      })
      return res.output_text
    })
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  return withRetry(GEMINI_MODELS, async (model) => {
    const m = genAI.getGenerativeModel({
      model,
      generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
    })
    const result = await m.generateContent([
      { inlineData: { mimeType: 'application/pdf', data: base64 } },
      { text: prompt },
    ])
    return result.response.text()
  })
}
