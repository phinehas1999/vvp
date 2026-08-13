'use client'

import Image from 'next/image'
import { Award, ArrowLeft, ArrowRight, Star, Coins, Flame, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Character } from './scenes'
import type { Explorer } from '@/lib/play2learn'

export function GameComplete({
  explorer,
  game,
  score,
  combo,
  time,
  onNextLevel,
  onSelectGame,
  onDiscoveries,
}: {
  explorer: Explorer
  game: string
  score: number
  combo: number
  time: number
  onNextLevel: () => void
  onSelectGame: () => void
  onDiscoveries: () => void
}) {
  const stars = Math.min(Math.floor(score / 50) + 1, 5)
  const coins = score * 2
  const timeInSeconds = (time / 10).toFixed(1)

  const messages = [
    'Amazing! You crushed it! 🚀',
    'Fantastic performance! ⭐',
    'You are a champion! 🏆',
    'Incredible skills! 💪',
    'Outstanding work! 🎯',
  ]

  const randomMessage = messages[Math.floor(Math.random() * messages.length)]

  return (
    <section className="mx-auto max-w-4xl w-full animate-in fade-in zoom-in-95 duration-500">
      {/* Top row: character + title | stats card */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        {/* Left — celebration + character */}
        <div className="flex flex-col items-center justify-center text-center gap-2 md:w-2/5 rounded-3xl border-4 border-foreground bg-gradient-to-br from-[#FFC94D]/20 to-[#FF7A5C]/10 p-6 shadow-[0_8px_0_var(--foreground)]">
          <div className="text-5xl animate-bounce">🎉</div>
          <Character explorer={explorer} className="scale-90" />
          <h1 className="text-3xl font-black mt-2">Level Complete!</h1>
          <p className="text-lg font-black text-primary">{randomMessage}</p>
        </div>

        {/* Right — stats + combo */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Stats grid */}
          <div className="rounded-3xl border-4 border-foreground bg-gradient-to-br from-yellow-50 to-amber-50 p-5 shadow-[0_8px_0_var(--foreground)] flex-1">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="flex flex-col items-center gap-1">
                <div className="rounded-xl bg-primary/10 p-2"><Star className="size-5 fill-primary text-primary" /></div>
                <p className="text-[10px] font-bold text-muted-foreground">SCORE</p>
                <p className="text-2xl font-black text-primary">{score}</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="rounded-xl bg-yellow-100 p-2"><Star className="size-5 fill-yellow-400 text-yellow-400" /></div>
                <p className="text-[10px] font-bold text-muted-foreground">STARS</p>
                <p className="text-2xl font-black">{stars}</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="rounded-xl bg-yellow-100 p-2"><Coins className="size-5 text-yellow-600" /></div>
                <p className="text-[10px] font-bold text-muted-foreground">COINS</p>
                <p className="text-2xl font-black">{coins}</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="rounded-xl bg-blue-100 p-2"><Clock className="size-5 text-blue-600" /></div>
                <p className="text-[10px] font-bold text-muted-foreground">TIME</p>
                <p className="text-2xl font-black">{timeInSeconds}s</p>
              </div>
            </div>

            {combo > 3 && (
              <div className="mt-4 pt-3 border-t-2 border-foreground/20 flex items-center justify-center gap-2">
                <Flame className="size-5 text-orange-600 animate-pulse" />
                <span className="font-black text-orange-800">Combo Streak x{combo}!</span>
              </div>
            )}
          </div>

          {/* Reward banner */}
          <div className="rounded-2xl border-3 border-dashed border-foreground bg-muted px-4 py-3 text-center">
            <p className="font-bold text-xs mb-0.5">🎁 REWARD UNLOCKED</p>
            <p className="text-sm font-black">+{coins} coins and +{stars} stars added!</p>
          </div>
        </div>
      </div>

      {/* Bottom row: action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
        <Button size="lg" variant="outline" onClick={onSelectGame}>
          <ArrowLeft data-icon="inline-start" />
          Choose Another Game
        </Button>
        <Button size="lg" onClick={onNextLevel} className="animate-in fade-in duration-500 delay-300">
          Try a Harder Level
          <ArrowRight data-icon="inline-end" />
        </Button>
        <Button variant="ghost" onClick={onDiscoveries} size="sm">
          <Award className="size-4 mr-1" />
          Achievements
        </Button>
      </div>
    </section>
  )
}
