import HeroSection from '@/components/landing/HeroSection'
import ResumeUploader from '@/components/landing/ResumeUploader'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-16 bg-white">
      <HeroSection />
      <ResumeUploader />
    </main>
  )
}
