'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type Language = 'en' | 'am'

type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const saved = window.localStorage.getItem('play2learn-language')
    if (saved === 'en' || saved === 'am') {
      setLanguage(saved)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('play2learn-language', language)
    document.documentElement.lang = language === 'am' ? 'am' : 'en'
  }, [language])

  const value = useMemo(() => ({ language, setLanguage }), [language])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

export function getExplorerLabel(explorer: string, language: Language): string {
  if (language === 'en') return explorer

  const labels: Record<string, string> = {
    Abel: 'አቤል',
    Hana: 'ሀና',
    Lulit: 'ሉሊት',
  }

  return labels[explorer] ?? explorer
}