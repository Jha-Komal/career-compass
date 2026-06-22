export default function HeroSection() {
  return (
    <div className="text-center max-w-2xl mx-auto px-4">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        AI-powered · Free · No sign-up
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.15]">
        Get clarity on your{' '}
        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          next career move
        </span>{' '}
        in 5 minutes.
      </h1>
      <p className="mt-5 text-lg text-gray-500 leading-relaxed">
        Upload your resume and let AI uncover the career paths best suited for your goals, strengths, and aspirations.
      </p>
      <div className="mt-6 flex justify-center gap-6 text-sm text-gray-400">
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Personalised paths
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          90-day action plan
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Study abroad options
        </span>
      </div>
    </div>
  )
}
