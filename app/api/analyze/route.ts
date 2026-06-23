/** @jest-environment node */
import { NextRequest, NextResponse } from 'next/server'
import { generateFromPDF } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')

    const text = await generateFromPDF(
      base64,
      `You are an expert career coach. The attached PDF is a resume. Read it carefully and return a JSON object with exactly three keys:
1. "resumeText": the full plain text extracted from the resume
2. "analysis": { "name": string (candidate's first name from the resume header), "persona": string, "career_stage": string, "strengths": string[], "growth_signals": string[], "career_tensions": string[], "study_abroad_fit": string }
3. "openingInsight": a 3-4 sentence personalized message that references a specific real observation from the resume, identifies a career tension or opportunity, ends with a forward-looking question, and is NOT generic.

Return only valid JSON.`,
    )

    const data = JSON.parse(text)
    return NextResponse.json(data)
  } catch (err) {
    console.error('[/api/analyze]', err)
    return NextResponse.json({ error: 'Analysis failed. Please try again.' }, { status: 500 })
  }
}
