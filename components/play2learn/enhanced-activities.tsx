'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Lightbulb, Zap, RotateCcw, Clock, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { calculateScore, getDifficultyConfig, type Difficulty } from '@/lib/play2learn'
import type { LearningEvent } from '@/lib/play2learn'

function Fruit({ type, small = false }: { type: 'apple' | 'orange'; small?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`${small ? 'size-8' : 'size-12'} relative inline-block overflow-hidden rounded-full drop-shadow-md animate-in fade-in duration-300`}
    >
      <Image
        src={`/play2learn/${type}.png`}
        alt=""
        fill
        sizes={small ? '32px' : '48px'}
        className="scale-125 object-cover"
      />
    </span>
  )
}

export function BasketBuilderGame({
  difficulty = 'medium',
  onComplete,
  onBack,
}: {
  difficulty?: Difficulty
  onComplete: (score: number, combo: number, time: number) => void
  onBack: () => void
}) {
  const config = getDifficultyConfig(difficulty)
  const [counts, setCounts] = useState(() => Array(config.baskets).fill(0) as number[])
  const [hint, setHint] = useState(false)
  const [time, setTime] = useState(0)
  const [combo, setCombo] = useState(0)
  const [hints, setHints] = useState(0)
  const [errors, setErrors] = useState(0)
  const [completed, setCompleted] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const comboTimerRef = useRef<NodeJS.Timeout | null>(null)

  const total = counts.reduce((sum, count) => sum + count, 0)
  const target = config.baskets * config.perBasket
  const fruitType = difficulty === 'easy' ? 'apple' : 'orange'

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTime((prev) => prev + 1)
    }, 100)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const add = (index: number) => {
    if (counts[index] >= config.perBasket || completed) return

    const next = counts.map((count, i) => (i === index ? count + 1 : count))
    setCounts(next)

    // Combo system
    setCombo((prev) => prev + 1)
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current)
    comboTimerRef.current = setTimeout(() => setCombo(0), 2000)
  }

  const undo = () => {
    const index = counts.findLastIndex((count) => count > 0)
    if (index < 0 || completed) return

    setCounts(counts.map((count, i) => (i === index ? count - 1 : count)))
    setErrors((prev) => prev + 1)
    setCombo(0)
  }

  const showHint = () => {
    setHint(true)
    setHints((prev) => prev + 1)
  }

  const finished = total === target

  const handleComplete = () => {
    setCompleted(true)
    if (timerRef.current) clearInterval(timerRef.current)
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current)

    const score = calculateScore(time, hints, errors, combo)
    onComplete(score, combo, time)
  }

  const timeColor =
    time > config.timeLimit * 1000 ? 'text-red-500' : time > config.timeLimit * 600 ? 'text-orange-500' : 'text-green-500'
  const difficultyBadge = {
    easy: { label: 'Easy', color: 'bg-green-100 text-green-800' },
    medium: { label: 'Medium', color: 'bg-orange-100 text-orange-800' },
    hard: { label: 'Hard', color: 'bg-red-100 text-red-800' },
    expert: { label: 'Expert', color: 'bg-purple-100 text-purple-800' },
  }

  return (
    <section className="flex flex-col gap-6" aria-labelledby="activity-title">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`rounded-full px-3 py-1 text-xs font-black ${difficultyBadge[difficulty].color}`}>
              {difficultyBadge[difficulty].label}
            </span>
            <span className={`flex items-center gap-1 font-bold ${timeColor}`}>
              <Clock className="size-4" />
              {(time / 10).toFixed(1)}s
            </span>
            {combo > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-800">
                <Flame className="size-4" />
                Combo x{combo}
              </span>
            )}
          </div>
          <p className="font-bold text-muted-foreground">Level {difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : difficulty === 'hard' ? 3 : 4}</p>
          <h2 id="activity-title" className="text-balance text-3xl font-black md:text-4xl">
            Put {config.perBasket} {fruitType === 'apple' ? 'apples' : 'oranges'} in every basket.
          </h2>
          <p className="mt-2 text-lg font-semibold">
            You have placed <span className="text-primary font-black">{total}</span> of <span className="text-primary font-black">{target}</span>.
          </p>
        </div>

        <div className="text-right">
          <div className="rounded-xl border-2 border-foreground bg-secondary p-3">
            <p className="text-xs font-bold text-muted-foreground">Progress</p>
            <div className="mt-2 h-4 w-24 overflow-hidden rounded-full border-2 border-foreground bg-card">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${Math.min((total / target) * 100, 100)}%` }}
              />
            </div>
            <p className="mt-2 text-lg font-black">{Math.min(Math.round((total / target) * 100), 100)}%</p>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border-4 border-foreground bg-secondary p-4 shadow-[0_8px_0_var(--foreground)] md:p-8">
        <div className={`grid gap-4 ${config.baskets > 4 ? 'grid-cols-3 md:grid-cols-6' : 'grid-cols-3 md:grid-cols-4'}`}>
          {counts.map((count, index) => (
            <button
              key={index}
              onClick={() => add(index)}
              disabled={count === config.perBasket || completed}
              aria-label={`Basket ${index + 1}, ${count} of ${config.perBasket} ${fruitType}s`}
              className="group relative flex min-h-44 flex-col items-center justify-end gap-3 overflow-hidden rounded-3xl border-3 border-foreground bg-card/95 p-3 shadow-[0_6px_0_var(--foreground)] transition-all enabled:hover:-translate-y-2 active:translate-y-1 disabled:shadow-[0_3px_0_var(--foreground)] before:absolute before:inset-x-4 before:bottom-8 before:h-14 before:rounded-[50%] before:border-4 before:border-accent/50 before:bg-secondary hover:enabled:shadow-[0_12px_0_var(--foreground)]"
            >
              <span className="absolute inset-0 opacity-0 group-hover:enabled:opacity-100 transition-opacity bg-gradient-to-t from-primary/5 to-transparent rounded-3xl" />
              <span className="relative z-10 flex min-h-20 flex-wrap items-center justify-center gap-1">
                {Array.from({ length: count }).map((_, fruit) => (
                  <div
                    key={fruit}
                    className="animate-in fade-in duration-300"
                    style={{
                      animationDelay: `${fruit * 50}ms`,
                    }}
                  >
                    <Fruit key={fruit} type={fruitType as 'apple' | 'orange'} small={config.baskets > 4} />
                  </div>
                ))}
              </span>
              <span className="relative z-10 rounded-full bg-card px-3 py-1 font-black shadow-sm">
                {count} / {config.perBasket}
              </span>
            </button>
          ))}
        </div>
      </div>

      {hint && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300 rounded-2xl border-2 border-foreground bg-yellow-50 p-4 text-center font-bold border-yellow-400">
          💡 Try filling one basket completely first, then make the other baskets match it exactly!
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <Button size="lg" variant="outline" onClick={undo} disabled={total === 0 || completed}>
          <RotateCcw data-icon="inline-start" />
          Undo
        </Button>
        <Button size="lg" variant="secondary" onClick={showHint} disabled={hint || completed}>
          <Lightbulb data-icon="inline-start" />
          Hint
        </Button>
        {finished && (
          <Button
            size="lg"
            onClick={handleComplete}
            className="animate-in pulse duration-1000"
          >
            <Zap data-icon="inline-start" />
            Complete Level
            <ArrowRight data-icon="inline-end" />
          </Button>
        )}
      </div>

      {!finished && (
        <div className="text-center text-sm font-semibold text-muted-foreground">
          Keep going! You're {target - total} items away from completing this level.
        </div>
      )}
    </section>
  )
}

export function PatternFinderGameBoilerplate({
  difficulty = 'medium',
  onComplete,
  onBack,
}: {
  difficulty?: Difficulty
  onComplete: (score: number, combo: number, time: number) => void
  onBack: () => void
}) {
  return (
    <section className="mx-auto max-w-3xl text-center py-20">
      <div className="mb-8">
        <div className="text-6xl animate-bounce mb-4">🧩</div>
        <h1 className="text-5xl font-black mb-4">Pattern Finder</h1>
        <p className="text-xl font-semibold text-muted-foreground mb-4">
          This game is under construction! Discover mathematical sequences and patterns to unlock bonus rewards.
        </p>
        <div className="rounded-2xl border-3 border-dashed border-foreground bg-secondary p-6 my-6">
          <p className="font-bold text-sm mb-4">Game Features Coming:</p>
          <ul className="space-y-2 text-left max-w-xs mx-auto text-sm font-semibold">
            <li>✓ Sequence matching challenges</li>
            <li>✓ Pattern recognition puzzles</li>
            <li>✓ Progressive difficulty levels</li>
            <li>✓ Time-based challenges</li>
            <li>✓ Combo & combo multipliers</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <Button size="lg" variant="outline" onClick={onBack}>
          <ArrowRight data-icon="inline-start" />
          Back to games
        </Button>
      </div>
    </section>
  )
}
