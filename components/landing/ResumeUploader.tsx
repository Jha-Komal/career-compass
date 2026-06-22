'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCareerStore } from '@/store/career-store'
import { Button } from '@/components/ui/button'

export default function ResumeUploader() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setResumeText, setAnalysis, addMessage, setStage } = useCareerStore()

  async function handleFile(file: File) {
    if (!file.type.includes('pdf')) {
      setError('Please upload a PDF file.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/analyze', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || 'Analysis failed')
      setResumeText(data.resumeText)
      setAnalysis(data.analysis)
      addMessage({ role: 'ai', content: data.openingInsight })
      setStage('conversation')
      router.push('/chat')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <div
        className="w-full max-w-md border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-gray-400 transition-colors"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
        <p className="text-gray-500 text-sm">Drag & drop your resume here or</p>
        <Button className="mt-3" disabled={loading} onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}>
          {loading ? 'Analyzing...' : 'Upload Resume'}
        </Button>
        <p className="mt-2 text-xs text-gray-400">PDF only</p>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
