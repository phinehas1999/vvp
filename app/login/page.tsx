'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ArrowRight, BookOpen, Compass, GraduationCap, Mail, Lock, Sparkles } from 'lucide-react'
import { useLanguage } from '@/components/i18n/language-context'

export default function LoginPage() {
  const { language } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'student' | 'teacher'>('student')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError(language === 'am' ? 'የኢሜይል ወይም የይለፍ ቃል ስህተት አለ' : 'Invalid email or password')
    } else {
      // Fetch session to get actual role for redirect
      const res = await fetch('/api/auth/session')
      const session = await res.json()
      const role = session?.user?.role
      router.push(role === 'teacher' ? '/teacher/welcome' : '/welcome')
      router.refresh()
    }
  }

  return (
    <main className="min-h-dvh flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #F7F5EF 0%, #E8F4F8 50%, #FFF9E6 100%)' }}>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#FFC94D]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#4FB6C9]/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-[#FF7A5C]/15 rounded-full blur-2xl" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border-3 border-[#3B2F5E] bg-[#FFC94D] px-5 py-2 shadow-[0_4px_0_#3B2F5E] mb-4">
            <Sparkles className="size-5 text-[#3B2F5E]" />
            <span className="font-black text-[#3B2F5E]">Play2Learn</span>
          </div>
          <h1 className="text-3xl font-black text-[#3B2F5E] mt-4">Welcome back!</h1>
          <p className="text-[#3B2F5E]/60 font-semibold mt-1">{language === 'am' ? 'ጉዞዎን ለመቀጠል ይግቡ' : 'Sign in to continue your adventure'}</p>
        </div>

        {/* Role toggle */}
        <div className="flex gap-2 mb-6 p-1.5 bg-[#FDFBF7] border-3 border-[#3B2F5E] rounded-2xl shadow-[0_4px_0_#3B2F5E]">
          <button
            onClick={() => setMode('student')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black transition-all ${
              mode === 'student'
                ? 'bg-[#4FB6C9] text-[#FDFBF7] shadow-[0_2px_0_#3B2F5E]'
                : 'text-[#3B2F5E]/60 hover:text-[#3B2F5E]'
            }`}
          >
            <Compass className="size-4" />
            {language === 'am' ? 'ተማሪ' : 'Student'}
          </button>
          <button
            onClick={() => setMode('teacher')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black transition-all ${
              mode === 'teacher'
                ? 'bg-[#6FBF73] text-[#FDFBF7] shadow-[0_2px_0_#3B2F5E]'
                : 'text-[#3B2F5E]/60 hover:text-[#3B2F5E]'
            }`}
          >
            <GraduationCap className="size-4" />
            {language === 'am' ? 'መምህር' : 'Teacher'}
          </button>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="rounded-[2rem] border-4 border-[#3B2F5E] bg-[#FDFBF7] p-8 shadow-[0_12px_0_#3B2F5E] space-y-5">
          {error && (
            <div className="rounded-xl border-2 border-[#FF7A5C] bg-[#FF7A5C]/10 px-4 py-3 text-sm font-bold text-[#FF7A5C]">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="font-black text-sm text-[#3B2F5E]">{language === 'am' ? 'ኢሜይል' : 'Email'}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#3B2F5E]/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'am' ? 'you@example.com' : 'your@email.com'}
                required
                className="w-full h-14 rounded-xl border-3 border-[#3B2F5E] bg-white pl-12 pr-4 text-[#3B2F5E] font-bold placeholder:text-[#3B2F5E]/30 focus:ring-4 focus:ring-[#FFC94D] focus:border-[#4FB6C9] outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-black text-sm text-[#3B2F5E]">{language === 'am' ? 'የይለፍ ቃል' : 'Password'}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#3B2F5E]/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-14 rounded-xl border-3 border-[#3B2F5E] bg-white pl-12 pr-4 text-[#3B2F5E] font-bold placeholder:text-[#3B2F5E]/30 focus:ring-4 focus:ring-[#FFC94D] focus:border-[#4FB6C9] outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-14 rounded-xl border-3 border-[#3B2F5E] font-black text-lg text-[#FDFBF7] shadow-[0_6px_0_#3B2F5E] hover:shadow-[0_8px_0_#3B2F5E] hover:-translate-y-1 active:translate-y-0 active:shadow-[0_2px_0_#3B2F5E] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none ${
              mode === 'student' ? 'bg-[#4FB6C9] hover:bg-[#3A9CAB]' : 'bg-[#6FBF73] hover:bg-[#5AA65E]'
            }`}
          >
            {loading ? (language === 'am' ? 'እየገባ ነው...' : 'Signing in...') : (language === 'am' ? 'ግባ' : 'Sign In')}
            {!loading && <ArrowRight className="size-5" />}
          </button>

          {/* Google OAuth */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-[#3B2F5E]/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[#FDFBF7] px-4 font-bold text-[#3B2F5E]/40">{language === 'am' ? 'ወይም' : 'or'}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/welcome' })}
            className="w-full h-14 rounded-xl border-3 border-[#3B2F5E] bg-white font-black text-[#3B2F5E] shadow-[0_4px_0_#3B2F5E] hover:shadow-[0_6px_0_#3B2F5E] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
          >
            <svg className="size-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            {language === 'am' ? 'በGoogle ይቀጥሉ' : 'Continue with Google'}
          </button>
        </form>

        {/* Register link */}
        <p className="text-center mt-6 font-bold text-[#3B2F5E]/60">
          {language === 'am' ? 'መለያ የለዎትም?' : 'Don\'t have an account?'}{' '}
          <a href="/register" className="text-[#4FB6C9] hover:text-[#3A9CAB] underline decoration-2 underline-offset-4">
            {language === 'am' ? 'ይፍጠሩ' : 'Create one'}
          </a>
        </p>
      </div>
    </main>
  )
}
