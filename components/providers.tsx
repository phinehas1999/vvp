'use client'

import { SessionProvider } from 'next-auth/react'
import { GlobalLanguageNav } from '@/components/i18n/global-language-nav'
import { LanguageProvider } from '@/components/i18n/language-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <GlobalLanguageNav />
        {children}
      </LanguageProvider>
    </SessionProvider>
  )
}
