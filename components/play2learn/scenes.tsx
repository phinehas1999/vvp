'use client'

import Image from 'next/image'
import { LockKeyhole, Sparkles, Star } from 'lucide-react'
import type { Explorer } from '@/lib/play2learn'

const companionImage: Record<Explorer, string> = { Milo: '/play2learn/milo.png', Nia: '/play2learn/nia.png', Pip: '/play2learn/pip.png' }

export function Logo({ compact = false }: { compact?: boolean }) {
  return <div className="flex items-center gap-2 font-sans font-black tracking-tight" aria-label="Play2Learn"><span className={compact ? 'text-xl' : 'text-2xl'}>Play<span className="text-primary">2</span>Learn</span><span className="grid size-8 rotate-3 place-items-center rounded-xl bg-accent text-accent-foreground shadow-[0_3px_0_var(--border)]"><Sparkles aria-hidden="true" /></span></div>
}

export function Character({ explorer, className = '' }: { explorer: Explorer; className?: string }) {
  return <div className={`relative mx-auto size-32 overflow-hidden rounded-[2rem] border-3 border-foreground bg-secondary shadow-[0_5px_0_var(--foreground)] ${className}`} aria-label={`${explorer} the explorer`} role="img"><Image src={companionImage[explorer]} alt="" fill sizes="128px" className="object-cover" /></div>
}

export function StorybookHero() {
  return <div className="relative min-h-[440px] overflow-hidden rounded-[2.75rem] border-4 border-foreground shadow-[0_12px_0_var(--foreground)]"><Image src="/play2learn/welcome-world.png" alt="A floating storybook island with a market, treehouse, observatory, and winding paths" fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" /><div className="absolute inset-x-5 bottom-5 rounded-2xl border-2 border-foreground/20 bg-card/95 p-4 shadow-lg backdrop-blur-sm"><p className="text-xs font-black uppercase tracking-[.2em] text-primary">Today&apos;s adventure</p><p className="mt-1 text-xl font-black">Follow the path to Market Square</p></div></div>
}

export function MarketArtwork() {
  return <div className="relative min-h-[420px] overflow-hidden rounded-[2.5rem] border-4 border-foreground shadow-[0_10px_0_var(--foreground)]"><Image src="/play2learn/market-scene.png" alt="A sunny village fruit market filled with apples, baskets, and wooden crates" fill sizes="(max-width: 768px) 100vw, 55vw" className="object-cover" /></div>
}

export function WorldMap({ onGameSelect }: { onGameSelect: () => void }) {
  return (
    <div className="relative min-h-[540px] overflow-hidden rounded-[2.75rem] border-4 border-foreground shadow-[0_12px_0_var(--foreground)]">
      <Image
        src="/play2learn/welcome-world.png"
        alt="Map of the Play2Learn world with multiple game worlds"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-foreground/10" />

      {/* Basket Builder Game Button */}
      <button
        onClick={onGameSelect}
        className="group absolute bottom-[20%] left-[28%] flex -translate-x-1/2 flex-col items-center gap-1 rounded-2xl border-3 border-foreground bg-accent px-5 py-3 text-accent-foreground shadow-[0_6px_0_var(--foreground)] transition-all hover:-translate-x-1/2 hover:-translate-y-1 hover:shadow-[0_10px_0_var(--foreground)]"
      >
        <span className="font-black">Basket Builder</span>
        <span className="text-xs font-bold">Choose your level</span>
        <span className="mt-1 text-xs">🧺 Grouping Game</span>
      </button>

      {/* Pattern Finder Game Button - Locked */}
      <button
        disabled
        className="absolute right-[18%] top-[18%] flex flex-col items-center gap-1 rounded-2xl border-3 border-foreground bg-muted px-5 py-3 text-muted-foreground shadow-[0_6px_0_var(--foreground)] cursor-not-allowed opacity-50"
      >
        <LockKeyhole aria-hidden="true" />
        <span className="font-black">Pattern Finder</span>
        <span className="text-xs font-bold">Coming Soon</span>
      </button>

      {/* Center decoration */}
      <div className="absolute left-1/2 top-[43%] grid size-12 -translate-x-1/2 place-items-center rounded-full border-3 border-foreground bg-card shadow-md animate-pulse">
        <Star className="fill-primary text-primary" aria-hidden="true" />
      </div>
    </div>
  )
}
