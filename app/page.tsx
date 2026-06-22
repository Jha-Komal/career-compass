import HeroSection from '@/components/landing/HeroSection'
import ResumeUploader from '@/components/landing/ResumeUploader'

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-white via-indigo-50/40 to-violet-50/30 py-16 px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-indigo-200/25 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-violet-200/25 blur-3xl" />
      </div>
      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl">
        <HeroSection />
        <ResumeUploader />
      </div>
    </main>
  )
}
