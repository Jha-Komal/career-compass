/** @jest-environment node */
import { NextRequest, NextResponse } from 'next/server'
import { generateText } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const { resumeText, analysis, answers, previousTitles = [], mode = 'career' } = await req.json()

    const prompt =
      mode === 'study-abroad'
        ? `You are an expert career coach. Based on the profile below, generate 3-5 university recommendations.
For each return: title (university name), category (always "education"), matchScore (0-100), country, estimatedCost (total tuition + living as a single string like "₹45L total"), publicPrivate ("Public" or "Private"), ranking (e.g. "QS #42" or "Times #110" — use the most well-known ranking for that university), whyFit (2-3 personalized sentences referencing the candidate's background), expectedOutcomes (string[]), opportunity (one-line summary of career outcome post-degree), skillGaps (empty array), transitionTime (program duration e.g. "2 years").

Resume Text: ${resumeText}
Analysis: ${JSON.stringify(analysis)}
Answers: ${JSON.stringify(answers)}

Return only valid JSON: { "recommendations": [...] }`
        : `You are an expert career coach. Based on the profile below, generate exactly 3 career recommendations.
Do NOT suggest any of these titles: ${previousTitles.length ? previousTitles.join(', ') : 'none'}.

For each return: title, category ("switch"|"growth"|"education"), matchScore (0-100), whyFit (personalized, references resume + answers), opportunity (one sentence), skillGaps (string[]), transitionTime (e.g. "6-9 months").

Resume Text: ${resumeText}
Analysis: ${JSON.stringify(analysis)}
Answers: ${JSON.stringify(answers)}

Return only valid JSON: { "recommendations": [...] }`

    const text = await generateText(prompt)
    const data = JSON.parse(text)
    return NextResponse.json(data)
  } catch (err) {
    console.error('[/api/recommend]', err)
    return NextResponse.json({ error: 'Recommendation failed. Please try again.' }, { status: 500 })
  }
}
