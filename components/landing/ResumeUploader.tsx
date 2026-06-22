'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCareerStore } from '@/store/career-store'
import { Button } from '@/components/ui/button'

export default function ResumeUploader() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)
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
    <div className="mt-10 w-full flex flex-col items-center gap-3">
      <div
        className={`relative w-full max-w-md rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200 group
          ${dragging
            ? 'border-indigo-500 bg-indigo-950/40 scale-[1.01]'
            : 'border-border bg-card/60 hover:border-indigo-600 hover:bg-indigo-950/20'
          }
          ${loading ? 'pointer-events-none opacity-60' : ''}
        `}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          const f = e.dataTransfer.files[0]
          if (f) handleFile(f)
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />

        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-indigo-950/60 flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-indigo-400">Reading your resume…</p>
            <p className="text-xs text-muted-foreground">This takes about 10–15 seconds</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${dragging ? 'bg-indigo-800/50' : 'bg-indigo-950/50 group-hover:bg-indigo-900/50'}`}>
              <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 5.75 5.75 0 011.5 11.095H6.75z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Drag & drop your resume</p>
              <p className="text-xs text-muted-foreground mt-0.5">or click to browse</p>
            </div>
            <Button size="sm" className="mt-1 px-6" onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}>
              Upload Resume
            </Button>
            <p className="text-xs text-muted-foreground/60">PDF only · Your data stays private</p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-4 py-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
          </svg>
          {error}
        </div>
      )}
    </div>
  )
}
