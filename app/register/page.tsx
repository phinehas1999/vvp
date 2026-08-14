'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Compass, GraduationCap, Lock, Mail, Sparkles, User } from 'lucide-react'
import { useLanguage } from '@/components/i18n/language-context'

export default function RegisterPage() {
  const { language } = useLanguage()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'student' | 'teacher'>('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || (language === 'am' ? 'ምዝገባ አልተሳካም' : 'Registration failed'))
    } else {
      router.push('/login')
    }
  }

  return (
    <main className="min-h-dvh flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #F7F5EF 0%, #E8F4F8 50%, #FFF9E6 100%)' }}>
      
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#6FBF73]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#FF7A5C]/20 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border-3 border-[#3B2F5E] bg-[#FFC94D] px-5 py-2 shadow-[0_4px_0_#3B2F5E] mb-4">
            <Sparkles className="size-5 text-[#3B2F5E]" />
            <span className="font-black text-[#3B2F5E]">Play2Learn</span>
          </div>
          <h1 className="text-3xl font-black text-[#3B2F5E] mt-4">Join the adventure!</h1>
          <p className="text-[#3B2F5E]/60 font-semibold mt-1">{language === 'am' ? 'ለመጀመር መለያ ይፍጠሩ' : 'Create your account to get started'}</p>
        </div>

        {/* Role toggle */}
        <div className="flex gap-2 mb-6 p-1.5 bg-[#FDFBF7] border-3 border-[#3B2F5E] rounded-2xl shadow-[0_4px_0_#3B2F5E]">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black transition-all ${
              role === 'student'
                ? 'bg-[#4FB6C9] text-[#FDFBF7] shadow-[0_2px_0_#3B2F5E]'
                : 'text-[#3B2F5E]/60 hover:text-[#3B2F5E]'
            }`}
          >
            <Compass className="size-4" />
            {language === 'am' ? 'ተማሪ' : 'Student'}
          </button>
          <button
            type="button"
            onClick={() => setRole('teacher')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black transition-all ${
              role === 'teacher'
                ? 'bg-[#6FBF73] text-[#FDFBF7] shadow-[0_2px_0_#3B2F5E]'
                : 'text-[#3B2F5E]/60 hover:text-[#3B2F5E]'
            }`}
          >
            <GraduationCap className="size-4" />
            {language === 'am' ? 'መምህር' : 'Teacher'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border-4 border-[#3B2F5E] bg-[#FDFBF7] p-8 shadow-[0_12px_0_#3B2F5E] space-y-5">
          {error && (
            <div className="rounded-xl border-2 border-[#FF7A5C] bg-[#FF7A5C]/10 px-4 py-3 text-sm font-bold text-[#FF7A5C]">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="font-black text-sm text-[#3B2F5E]">
              {role === 'teacher'
                ? (language === 'am' ? 'ሙሉ ስም' : 'Full Name')
                : (language === 'am' ? 'የተማሪ ስም' : 'Explorer Name')}
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#3B2F5E]/40" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'teacher'
                  ? (language === 'am' ? 'ወ/ሮ ሃና' : 'Ms. Hana')
                  : (language === 'am' ? 'የተማሪ ስምዎ' : 'Your explorer name')}
                required
                className="w-full h-14 rounded-xl border-3 border-[#3B2F5E] bg-white pl-12 pr-4 text-[#3B2F5E] font-bold placeholder:text-[#3B2F5E]/30 focus:ring-4 focus:ring-[#FFC94D] focus:border-[#4FB6C9] outline-none transition-all"
              />
            </div>
          </div>

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
                placeholder={language === 'am' ? 'ቢያንስ 6 ፊደል' : 'At least 6 characters'}
                required
                minLength={6}
                className="w-full h-14 rounded-xl border-3 border-[#3B2F5E] bg-white pl-12 pr-4 text-[#3B2F5E] font-bold placeholder:text-[#3B2F5E]/30 focus:ring-4 focus:ring-[#FFC94D] focus:border-[#4FB6C9] outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-14 rounded-xl border-3 border-[#3B2F5E] font-black text-lg text-[#FDFBF7] shadow-[0_6px_0_#3B2F5E] hover:shadow-[0_8px_0_#3B2F5E] hover:-translate-y-1 active:translate-y-0 active:shadow-[0_2px_0_#3B2F5E] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none ${
              role === 'student' ? 'bg-[#4FB6C9] hover:bg-[#3A9CAB]' : 'bg-[#6FBF73] hover:bg-[#5AA65E]'
            }`}
          >
            {loading ? (language === 'am' ? 'መለያ እየተፈጠረ ነው...' : 'Creating account...') : (language === 'am' ? 'መለያ ፍጠር' : 'Create Account')}
            {!loading && <ArrowRight className="size-5" />}
          </button>
        </form>

        <p className="text-center mt-6 font-bold text-[#3B2F5E]/60">
          {language === 'am' ? 'መለያ አለዎት?' : 'Already have an account?'}{' '}
          <a href="/login" className="text-[#4FB6C9] hover:text-[#3A9CAB] underline decoration-2 underline-offset-4">
            {language === 'am' ? 'ይግቡ' : 'Sign in'}
          </a>
        </p>
      </div>
    </main>
  )
}
