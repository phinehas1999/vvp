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
    <section className="mx-auto max-w-3xl text-center py-8">
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="animate-pulse">
            <div className="absolute inset-0 rounded-full bg-yellow-300/20 blur-2xl scale-150" />
          </div>
        </div>
        <div className="relative">
          <div className="mb-4 text-8xl animate-bounce">🎉</div>
          <Character explorer={explorer} className="scale-110" />
        </div>
      </div>

      <h1 className="text-5xl font-black mb-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        Level Complete!
      </h1>
      <p className="text-2xl font-black text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        {randomMessage}
      </p>

      {/* Stats Card */}
      <div className="rounded-3xl border-4 border-foreground bg-gradient-to-br from-yellow-50 to-amber-50 p-8 shadow-[0_10px_0_var(--foreground)] mb-8 animate-in fade-in scale-in duration-500 delay-200">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {/* Score */}
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-2xl bg-primary/10 p-3">
              <Star className="size-6 fill-primary text-primary" />
            </div>
            <p className="text-xs font-bold text-muted-foreground">SCORE</p>
            <p className="text-3xl font-black text-primary">{score}</p>
          </div>

          {/* Stars Earned */}
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-2xl bg-yellow-100 p-3">
              <Star className="size-6 fill-yellow-400 text-yellow-400" />
            </div>
            <p className="text-xs font-bold text-muted-foreground">STARS</p>
            <p className="text-3xl font-black">{stars}</p>
          </div>

          {/* Coins Earned */}
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-2xl bg-yellow-100 p-3">
              <Coins className="size-6 text-yellow-600" />
            </div>
            <p className="text-xs font-bold text-muted-foreground">COINS</p>
            <p className="text-3xl font-black">{coins}</p>
          </div>

          {/* Time */}
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-2xl bg-blue-100 p-3">
              <Clock className="size-6 text-blue-600" />
            </div>
            <p className="text-xs font-bold text-muted-foreground">TIME</p>
            <p className="text-2xl font-black">{timeInSeconds}s</p>
          </div>
        </div>

        {/* Combo Achievement */}
        {combo > 3 && (
          <div className="mt-6 pt-6 border-t-2 border-foreground">
            <div className="flex items-center justify-center gap-2 rounded-2xl bg-orange-100 px-4 py-3 w-fit mx-auto">
              <Flame className="size-5 text-orange-600 animate-pulse" />
              <span className="font-black text-orange-800">Combo Streak x{combo}!</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">
              You didn't make mistakes! Incredible focus!
            </p>
          </div>
        )}
      </div>

      {/* Unlocks or Next Level */}
      <div className="rounded-2xl border-3 border-dashed border-foreground bg-muted p-6 mb-8">
        <p className="font-bold text-sm mb-2">🎁 REWARD UNLOCKED</p>
        <p className="text-lg font-black">+{coins} coins and +{stars} stars added to your collection!</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        <Button size="lg" variant="outline" onClick={onSelectGame}>
          <ArrowLeft data-icon="inline-start" />
          Choose Another Game
        </Button>
        <Button
          size="lg"
          onClick={onNextLevel}
          className="animate-in fade-in duration-500 delay-300"
        >
          Try a Harder Level
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>

      {/* Achievements Link */}
      <Button
        className="mt-4"
        variant="ghost"
        onClick={onDiscoveries}
        size="sm"
      >
        <Award className="size-4 mr-2" />
        View all achievements
      </Button>
    </section>
  )
}
