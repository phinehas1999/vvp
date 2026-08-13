'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Compass, Rocket, Sparkles, Star } from 'lucide-react'

export default function WelcomePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stage, setStage] = useState(0)

  const name = session?.user?.name || 'Explorer'

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 400),
      setTimeout(() => setStage(2), 1200),
      setTimeout(() => setStage(3), 2200),
      setTimeout(() => router.push('/'), 3800),
    ]
    return () => timers.forEach(clearTimeout)
  }, [router])

  return (
    <main className="h-dvh flex items-center justify-center overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #1a1145 0%, #2d1b69 40%, #1a3a5c 100%)' }}>

      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 1}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#4FB6C9]/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#FFC94D]/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#6FBF73]/10 rounded-full blur-[120px]" />

      <div className="relative z-10 text-center flex flex-col items-center gap-6 px-6">
        {/* Stage 0: Logo appears */}
        <div className={`transition-all duration-700 ease-out ${stage >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <div className="inline-flex items-center gap-2 rounded-full border-3 border-[#FFC94D] bg-[#FFC94D] px-6 py-3 shadow-[0_4px_0_#3B2F5E,0_0_40px_#FFC94D40]">
            <Sparkles className="size-6 text-[#3B2F5E]" />
            <span className="font-black text-xl text-[#3B2F5E]">Play2Learn</span>
          </div>
        </div>

        {/* Stage 1: Welcome text */}
        <div className={`transition-all duration-700 ease-out delay-100 ${stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
            Welcome back,
          </h1>
          <h2 className="text-4xl md:text-6xl font-black text-[#FFC94D] mt-1 flex items-center justify-center gap-3">
            {name} <Star className="size-8 fill-[#FFC94D] text-[#FFC94D] animate-spin" style={{ animationDuration: '3s' }} />
          </h2>
        </div>

        {/* Stage 2: Subtitle + rocket */}
        <div className={`transition-all duration-700 ease-out ${stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-3 justify-center">
            <Rocket className="size-8 text-[#FF7A5C] animate-bounce" />
            <p className="text-xl md:text-2xl font-bold text-white/70">
              Your adventure continues...
            </p>
            <Compass className="size-7 text-[#4FB6C9] animate-pulse" />
          </div>
        </div>

        {/* Stage 3: Loading dots */}
        <div className={`transition-all duration-500 ease-out ${stage >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex gap-2 justify-center mt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-[#4FB6C9] animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
