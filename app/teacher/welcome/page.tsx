'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { BookOpen, GraduationCap, LayoutDashboard, Sparkles, Users } from 'lucide-react'
import { useLanguage } from '@/components/i18n/language-context'

export default function TeacherWelcomePage() {
  const { language } = useLanguage()
  const { data: session } = useSession()
  const router = useRouter()
  const [stage, setStage] = useState(0)

  const name = session?.user?.name || (language === 'am' ? 'መምህር' : 'Teacher')

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 400),
      setTimeout(() => setStage(2), 1400),
      setTimeout(() => setStage(3), 2400),
      setTimeout(() => router.push('/teacher'), 4000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [router])

  return (
    <main className="h-dvh flex items-center justify-center overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #F7F5EF 0%, #E8F8E8 40%, #F0F8F7 100%)' }}>

      {/* Subtle animated circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-20 w-40 h-40 border-4 border-[#6FBF73]/20 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute bottom-20 left-10 w-56 h-56 border-4 border-[#4FB6C9]/15 rounded-full animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
        <div className="absolute top-1/3 left-1/3 w-32 h-32 border-4 border-[#FFC94D]/20 rounded-full animate-spin" style={{ animationDuration: '15s' }} />
      </div>

      {/* Soft glows */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#6FBF73]/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-[#4FB6C9]/10 rounded-full blur-[80px]" />

      <div className="relative z-10 text-center flex flex-col items-center gap-8 px-6">
        {/* Stage 0: Badge */}
        <div className={`transition-all duration-700 ease-out ${stage >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <div className="inline-flex items-center gap-3 rounded-2xl border-3 border-[#3B2F5E] bg-[#6FBF73] px-6 py-3 shadow-[0_6px_0_#3B2F5E]">
            <GraduationCap className="size-7 text-[#FDFBF7]" />
            <span className="font-black text-xl text-[#FDFBF7]">Play2Learn · Teacher</span>
          </div>
        </div>

        {/* Stage 1: Greeting */}
        <div className={`transition-all duration-700 ease-out ${stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-4xl md:text-5xl font-black text-[#3B2F5E] leading-tight">
            {language === 'am' ? 'እንኳን ደህና መጡ፣' : 'Good to see you,'}
          </h1>
          <h2 className="text-4xl md:text-5xl font-black text-[#6FBF73] mt-2">
            {name} <Sparkles className="inline size-8 text-[#FFC94D]" />
          </h2>
        </div>

        {/* Stage 2: Stats preview */}
        <div className={`transition-all duration-700 ease-out ${stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-6 justify-center">
            <div className="flex items-center gap-2 rounded-xl border-2 border-[#3B2F5E]/15 bg-white px-4 py-3">
              <Users className="size-5 text-[#4FB6C9]" />
              <span className="font-black text-[#3B2F5E]">{language === 'am' ? '8 ተማሪዎች ንቁ ናቸው' : '8 students active'}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border-2 border-[#3B2F5E]/15 bg-white px-4 py-3">
              <BookOpen className="size-5 text-[#FF7A5C]" />
              <span className="font-black text-[#3B2F5E]">{language === 'am' ? 'ዛሬ 12 ሴሽኖች' : '12 sessions today'}</span>
            </div>
          </div>
        </div>

        {/* Stage 3: Loading into dashboard */}
        <div className={`transition-all duration-500 ease-out ${stage >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-3 text-[#3B2F5E]/60 font-bold">
            <LayoutDashboard className="size-5 animate-pulse" />
            <span>{language === 'am' ? 'ዳሽቦርድዎ በመጫን ላይ...' : 'Loading your dashboard...'}</span>
          </div>
          <div className="mt-4 w-48 h-1.5 rounded-full bg-[#3B2F5E]/10 overflow-hidden mx-auto">
            <div className="h-full bg-[#6FBF73] rounded-full animate-[loading_1.5s_ease-in-out_infinite]" 
              style={{ width: '60%', animation: 'loading 1.5s ease-in-out infinite' }} />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </main>
  )
}
