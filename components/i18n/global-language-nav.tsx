'use client'

import { Languages } from 'lucide-react'
import { useLanguage } from './language-context'

export function GlobalLanguageNav() {
  const { language, setLanguage } = useLanguage()

  return (
    <nav className="fixed right-3 top-3 z-[90]">
      <div className="flex items-center gap-1.5 rounded-full border-2 border-[#3B2F5E] bg-[#FDFBF7]/95 p-1.5 shadow-[0_3px_0_#3B2F5E] backdrop-blur">
        <span className="rounded-full bg-[#FFC94D] p-1.5 text-[#3B2F5E]" aria-hidden="true">
          <Languages className="size-4" />
        </span>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`rounded-full px-3 py-1 text-xs font-black transition-colors ${
            language === 'en' ? 'bg-[#4FB6C9] text-[#FDFBF7]' : 'text-[#3B2F5E] hover:bg-[#3B2F5E]/10'
          }`}
          aria-pressed={language === 'en'}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setLanguage('am')}
          className={`rounded-full px-3 py-1 text-xs font-black transition-colors ${
            language === 'am' ? 'bg-[#6FBF73] text-[#FDFBF7]' : 'text-[#3B2F5E] hover:bg-[#3B2F5E]/10'
          }`}
          aria-pressed={language === 'am'}
        >
          አማርኛ
        </button>
      </div>
    </nav>
  )
}