'use client'

import Image from 'next/image'
import { ArrowLeft, ArrowRight, Sparkles, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Game } from '@/lib/play2learn'

export function GameSelector({
  onSelectGame,
  onBack,
  explorer,
}: {
  onSelectGame: (game: Game) => void
  onBack: () => void
  explorer: string
}) {
  return (
    <section className="flex flex-col gap-8">
      <div>
        <p className="font-bold text-muted-foreground">Choose your adventure</p>
        <h1 className="text-4xl font-black md:text-5xl">Which game will you play today?</h1>
        <p className="mt-3 text-lg font-semibold text-muted-foreground">
          Each game teaches different ways to explore numbers and patterns.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basket Builder Game */}
        <div className="group relative overflow-hidden rounded-3xl border-4 border-foreground bg-card shadow-[0_8px_0_var(--foreground)] transition-transform hover:-translate-y-1">
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-200 to-amber-200">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-32 w-40 animate-bounce">
                <Image
                  src="/play2learn/activity-objects.png"
                  alt="Fruit baskets illustration"
                  fill
                  sizes="160px"
                  className="object-contain"
                />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
          </div>

          <div className="p-6">
            <div className="mb-3 flex items-center gap-2">
              <div className="grid size-10 place-items-center rounded-xl bg-secondary">
                <Zap className="size-5 text-primary" />
              </div>
              <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-black text-primary">
                BEGINNER
              </span>
            </div>

            <h2 className="text-2xl font-black">Basket Builder</h2>
            <p className="mt-2 font-semibold text-muted-foreground">
              Group fruits into equal baskets. Master the foundation of multiplication by discovering how to divide and organize items.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold">Division</span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold">Grouping</span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold">Strategy</span>
            </div>

            <Button
              className="mt-6 w-full"
              onClick={() => onSelectGame('basket-builder')}
              size="lg"
            >
              Play Basket Builder
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </div>

        {/* Pattern Finder Game - Boilerplate */}
        <div className="group relative overflow-hidden rounded-3xl border-4 border-foreground border-dashed bg-muted/30 shadow-[0_8px_0_var(--foreground)] opacity-60 transition-all hover:opacity-80">
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-200 to-pink-200">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-3 text-4xl">✨</div>
                <p className="font-black text-sm">Coming Soon</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
          </div>

          <div className="p-6">
            <div className="mb-3 flex items-center gap-2">
              <div className="grid size-10 place-items-center rounded-xl bg-muted">
                <Sparkles className="size-5 text-muted-foreground" />
              </div>
              <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-black text-muted-foreground">
                ADVANCED
              </span>
            </div>

            <h2 className="text-2xl font-black text-muted-foreground">Pattern Finder</h2>
            <p className="mt-2 font-semibold text-muted-foreground">
              Discover sequences and mathematical patterns. This game will unlock once you master Basket Builder!
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                Sequences
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                Patterns
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                Logic
              </span>
            </div>

            <Button
              className="mt-6 w-full"
              disabled
              size="lg"
              variant="outline"
            >
              Locked for now
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </div>

      <Button variant="outline" size="lg" onClick={onBack} className="self-start">
        <ArrowLeft data-icon="inline-start" />
        Back to the world
      </Button>
    </section>
  )
}
