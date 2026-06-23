/** @jest-environment node */
import { NextRequest, NextResponse } from 'next/server'
import { generateText } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const { resumeText, analysis, answers, recommendation } = await req.json()

    const prompt = `You are an expert career coach. Generate a detailed exploration for the career path below.
Return exactly: whyStrongFit (2-3 personalized sentences), existingStrengths (string[] pulled from the resume), gapsToClose (string[] — specific skills to develop), plan90Day ([{ "month": string, "action": string }] for exactly 3 months).
All content must reference this specific resume and career path — no generic advice.

Resume Text: ${resumeText}
Analysis: ${JSON.stringify(analysis)}
Answers: ${JSON.stringify(answers)}
Recommendation: ${JSON.stringify(recommendation)}

Return only valid JSON: { "whyStrongFit": "", "existingStrengths": [], "gapsToClose": [], "plan90Day": [] }`

    const text = await generateText(prompt)
    const data = JSON.parse(text)
    return NextResponse.json(data)
  } catch (err) {
    console.error('[/api/explore]', err)
    return NextResponse.json({ error: 'Exploration failed. Please try again.' }, { status: 500 })
  }
}
