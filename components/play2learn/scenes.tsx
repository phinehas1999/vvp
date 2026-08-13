'use client'

import { Sparkles, Star } from 'lucide-react'
import type { Explorer } from '@/lib/play2learn'
import { CharacterAvatar } from './basket-market-assets'

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2 font-sans font-black tracking-tight" aria-label="Play2Learn">
      <span className={compact ? 'text-xl text-[#3B2F5E]' : 'text-2xl text-[#3B2F5E]'}>
        Way<span className="text-[#FF7A5C]">farer</span>
      </span>
      <span className="grid size-8 rotate-3 place-items-center rounded-xl bg-[#FFC94D] text-[#3B2F5E] shadow-[0_3px_0_#3B2F5E]">
        <Sparkles aria-hidden="true" />
      </span>
    </div>
  )
}

// Map the Explorer name to a consistent seed for CharacterAvatar
function getSeedForExplorer(explorer: Explorer): number {
  if (explorer === 'Milo') return 1; // Boy
  if (explorer === 'Nia') return 2;  // Girl
  if (explorer === 'Pip') return 3;  // Boy
  return 0;
}

export function Character({ explorer, className = '' }: { explorer: Explorer; className?: string }) {
  const seed = getSeedForExplorer(explorer);
  return (
    <div className={`relative mx-auto size-32 overflow-hidden rounded-[2rem] border-4 border-[#3B2F5E] shadow-[0_6px_0_#3B2F5E] bg-gradient-to-b from-[#C4E8F0] to-[#FDFBF7] ${className}`} aria-label={`${explorer} the explorer`} role="img">
      <CharacterAvatar seed={seed} className="absolute inset-0 w-full h-full object-cover translate-y-2 scale-125" />
    </div>
  )
}

export function StorybookHero() {
  return (
    <div className="relative min-h-[440px] overflow-hidden rounded-[2.75rem] border-4 border-[#3B2F5E] shadow-[0_12px_0_#3B2F5E]">
      <div className="absolute inset-x-5 bottom-5 rounded-2xl border-3 border-[#3B2F5E] bg-[#FDFBF7]/95 p-4 shadow-lg backdrop-blur-sm">
        <p className="text-xs font-black uppercase tracking-[.2em] text-[#FF7A5C]">Today&apos;s adventure</p>
        <p className="mt-1 text-xl font-black text-[#3B2F5E]">Follow the path to Market Square</p>
      </div>
    </div>
  )
}

export function MarketArtwork() {
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-[2.5rem] border-4 border-[#3B2F5E] shadow-[0_10px_0_#3B2F5E]">
      {/* Similar illustrated environment to StallBackground could go here if needed */}
    </div>
  )
}

export function WorldMap({ onGameSelect }: { onGameSelect: (game?: string) => void }) {
  return (
    <div className="relative flex-1 min-h-[400px] overflow-hidden">
      {/* Active node glow — Basket Builder */}
      <div 
        className="pointer-events-none absolute top-[38%] left-[25%] size-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFC94D] blur-2xl opacity-50 animate-[pulse_3s_ease-in-out_infinite] z-0" 
        aria-hidden="true" 
      />

      {/* Active node glow — Skyline Signal */}
      <div 
        className="pointer-events-none absolute top-[38%] left-[75%] size-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4FB6C9] blur-2xl opacity-40 animate-[pulse_3s_ease-in-out_infinite] z-0" 
        style={{ animationDelay: '1.5s' }}
        aria-hidden="true" 
      />

      {/* Active node glow — Crystal Cavern */}
      <div 
        className="pointer-events-none absolute top-[78%] left-[50%] size-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9B59B6] blur-2xl opacity-45 animate-[pulse_3s_ease-in-out_infinite] z-0" 
        style={{ animationDelay: '0.75s' }}
        aria-hidden="true" 
      />

      {/* Basket Builder Game Button */}
      <button
        type="button"
        onClick={() => onGameSelect('basket-builder')}
        className="group absolute top-[38%] left-[25%] z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 rounded-2xl border-4 border-[#3B2F5E] bg-[#FF7A5C] px-8 py-4 text-[#FDFBF7] shadow-[0_8px_0_#3B2F5E] transition-all hover:-translate-y-[calc(50%+4px)] hover:shadow-[0_12px_0_#3B2F5E] active:-translate-y-[calc(50%-2px)] active:shadow-[0_4px_0_#3B2F5E] cursor-pointer pointer-events-auto select-none"
      >
        <span className="font-black text-xl pointer-events-none">Market Day</span>
        <span className="text-sm font-bold opacity-90 pointer-events-none">Open your stall</span>
        <span className="mt-1 text-sm font-semibold pointer-events-none">🧺 Basket Builder</span>
      </button>

      {/* Skyline Signal Game Button */}
      <button
        type="button"
        onClick={() => onGameSelect('pattern-finder')}
        className="group absolute top-[38%] left-[75%] z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 rounded-2xl border-4 border-[#3B2F5E] bg-[#4FB6C9] px-8 py-4 text-[#FDFBF7] shadow-[0_8px_0_#3B2F5E] transition-all hover:-translate-y-[calc(50%+4px)] hover:shadow-[0_12px_0_#3B2F5E] active:-translate-y-[calc(50%-2px)] active:shadow-[0_4px_0_#3B2F5E] cursor-pointer pointer-events-auto select-none"
      >
        <span className="font-black text-xl pointer-events-none">Signal Tower</span>
        <span className="text-sm font-bold opacity-90 pointer-events-none">Pilot your glider</span>
        <span className="mt-1 text-sm font-semibold pointer-events-none">🛸 Skyline Signal</span>
      </button>

      {/* Crystal Cavern Game Button */}
      <button
        type="button"
        onClick={() => onGameSelect('crystal-cavern')}
        className="group absolute top-[78%] left-[50%] z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 rounded-2xl border-4 border-[#3B2F5E] bg-[#9B59B6] px-8 py-4 text-[#FDFBF7] shadow-[0_8px_0_#3B2F5E] transition-all hover:-translate-y-[calc(50%+4px)] hover:shadow-[0_12px_0_#3B2F5E] active:-translate-y-[calc(50%-2px)] active:shadow-[0_4px_0_#3B2F5E] cursor-pointer pointer-events-auto select-none"
      >
        <span className="font-black text-xl pointer-events-none">Crystal Cavern</span>
        <span className="text-sm font-bold opacity-90 pointer-events-none">Descend into the depths</span>
        <span className="mt-1 text-sm font-semibold pointer-events-none">💎 Crystal Cavern</span>
      </button>

      {/* Path lines connecting the games */}
      <svg className="pointer-events-none absolute inset-0 z-10 w-full h-full" aria-hidden="true">
        {/* Left game to center game */}
        <line x1="25%" y1="38%" x2="50%" y2="78%" stroke="#3B2F5E" strokeWidth="3" strokeDasharray="8 6" opacity="0.25" />
        {/* Right game to center game */}
        <line x1="75%" y1="38%" x2="50%" y2="78%" stroke="#3B2F5E" strokeWidth="3" strokeDasharray="8 6" opacity="0.25" />
        {/* Left game to right game */}
        <line x1="25%" y1="38%" x2="75%" y2="38%" stroke="#3B2F5E" strokeWidth="3" strokeDasharray="8 6" opacity="0.15" />
      </svg>

      {/* Star decoration — upper-center clearing */}
      <div 
        className="pointer-events-none absolute left-[50%] top-[14%] z-10 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-3 border-[#3B2F5E] bg-[#FDFBF7] shadow-md animate-bounce" 
        style={{ animationDuration: '2s' }}
        aria-hidden="true"
      >
        <Star className="fill-[#FFC94D] text-[#FFC94D]" aria-hidden="true" />
      </div>
    </div>
  )
}
