'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, Heart, Clock, Flame, Zap, Trophy, Star, RotateCcw, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Difficulty } from '@/lib/play2learn'

// ─── Types ───

type FruitKind = 'apple' | 'orange'
type Vec2 = { x: number; y: number }

type FruitItem = {
  id: number
  kind: FruitKind
  pos: Vec2
  inBasket: number | null // basket index or null if on shelf
  grabbed: boolean
}

type Basket = {
  target: number
  label: string
  current: number
  clue?: string
  recipe?: FruitKind[]
}

type WaveConfig = {
  baskets: Basket[]
  totalFruits: number
  fruitKinds: FruitKind[]
  timeLimit: number
  description: string
}

// ─── Level generation ───

function generateWave(difficulty: Difficulty, waveNum: number): WaveConfig {
  const w = waveNum % 5

  if (difficulty === 'easy') {
    const patterns = [
      { baskets: [crate('Red pair', 'Both slots need red.', ['apple', 'apple']), crate('Sun pair', 'Both slots need sun.', ['orange', 'orange'])], desc: 'Pack the two small orders' },
      { baskets: [crate('Stripe crate', 'The colors must take turns.', ['apple', 'orange', 'apple']), crate('Sun cap', 'Sun fruit goes last.', ['apple', 'orange'])], desc: 'Follow the color rhythm' },
      { baskets: [crate('Mirror crate', 'The outside slots match.', ['orange', 'apple', 'orange']), crate('Red cap', 'Red fruit goes last.', ['orange', 'apple'])], desc: 'Spot the matching positions' },
      { baskets: [crate('Twin middle', 'The middle two match.', ['apple', 'orange', 'orange', 'apple']), crate('Quick red', 'One red delivery.', ['apple'])], desc: 'Build the order with the matching middle' },
      { baskets: [crate('Stair crate', 'Two red before one sun.', ['apple', 'apple', 'orange']), crate('Reverse crate', 'One sun before two red.', ['orange', 'apple', 'apple'])], desc: 'Compare the two recipes' },
    ]
    const p = patterns[w]
    return { baskets: p.baskets, totalFruits: countRecipe(p.baskets), fruitKinds: ['apple', 'orange'], timeLimit: 30, description: p.desc }
  }

  if (difficulty === 'medium') {
    const puzzlePatterns = [
      { baskets: [crate('No twins', 'Never place the same color twice in a row.', ['apple', 'orange', 'apple', 'orange']), crate('Warm start', 'Start sun, then make a red pair.', ['orange', 'apple', 'apple'])], desc: 'Choose the next color from the clue' },
      { baskets: [crate('Bookends', 'The first and last are red.', ['apple', 'orange', 'orange', 'apple']), crate('Sun stack', 'Two sun fruit sit together.', ['apple', 'orange', 'orange'])], desc: 'Use positions, not just totals' },
      { baskets: [crate('Half turn', 'First half red, second half sun.', ['apple', 'apple', 'orange', 'orange']), crate('Zig crate', 'Red, sun, red.', ['apple', 'orange', 'apple'])], desc: 'Split the order into chunks' },
      { baskets: [crate('Sandwich', 'Red sits between two sun fruit.', ['orange', 'apple', 'orange']), crate('Double door', 'Two red open, two sun close.', ['apple', 'apple', 'orange', 'orange'])], desc: 'Read the hidden pattern' },
      { baskets: [crate('Almost stripe', 'It turns twice, then repeats red.', ['apple', 'orange', 'apple', 'apple']), crate('Sun mirror', 'Sun is on both ends.', ['orange', 'apple', 'orange'])], desc: 'Pack by pattern, not by pile size' },
    ]
    const puzzle = puzzlePatterns[w]
    return { baskets: puzzle.baskets, totalFruits: countRecipe(puzzle.baskets), fruitKinds: ['apple', 'orange'], timeLimit: 28, description: puzzle.desc }

  }

  if (difficulty === 'hard') {
    const puzzlePatterns = [
      { baskets: [crate('Locked stripe', 'Every move must alternate.', ['apple', 'orange', 'apple', 'orange', 'apple']), crate('Late sun', 'Only the last two are sun.', ['apple', 'apple', 'orange', 'orange'])], desc: 'Plan several moves ahead' },
      { baskets: [crate('Mirror five', 'Read the same forward and backward.', ['orange', 'apple', 'apple', 'apple', 'orange']), crate('Red switch', 'Two red, one sun, one red.', ['apple', 'apple', 'orange', 'apple'])], desc: 'Keep the shape in your head' },
      { baskets: [crate('Center sun', 'The center is sun; the sides are red.', ['apple', 'apple', 'orange', 'apple', 'apple']), crate('Sun gate', 'Sun starts and red closes.', ['orange', 'apple', 'orange', 'apple'])], desc: 'Track center and edge positions' },
      { baskets: [crate('Pair flip', 'Pairs change color once.', ['apple', 'apple', 'orange', 'orange']), crate('Broken stripe', 'A stripe with a red repeat at the end.', ['orange', 'apple', 'orange', 'apple', 'apple'])], desc: 'Notice where the pattern breaks' },
      { baskets: [crate('Warm mirror', 'Sun outside, red pair inside.', ['orange', 'apple', 'apple', 'orange']), crate('Cold ladder', 'One red, two sun, two red.', ['apple', 'orange', 'orange', 'apple', 'apple'])], desc: 'Use the recipe like a route map' },
    ]
    const puzzle = puzzlePatterns[w]
    return { baskets: puzzle.baskets, totalFruits: countRecipe(puzzle.baskets), fruitKinds: ['apple', 'orange'], timeLimit: 25, description: puzzle.desc }

  }

  // expert
  const puzzlePatterns = [
    { baskets: [crate('Signal mirror', 'The recipe mirrors around the center.', ['apple', 'orange', 'apple', 'orange', 'apple']), crate('Sun lock', 'Sun appears only in the first and last slot.', ['orange', 'apple', 'apple', 'orange'])], desc: 'Solve both recipes before the shelf runs out' },
    { baskets: [crate('Double stripe', 'Two alternating runs share one color.', ['apple', 'orange', 'apple', 'orange', 'orange']), crate('Red gate', 'Red fruit guards both ends.', ['apple', 'orange', 'orange', 'apple'])], desc: 'Find the repeated turn' },
    { baskets: [crate('Stack break', 'A red stack breaks into a sun stack.', ['apple', 'apple', 'apple', 'orange', 'orange']), crate('Mirror lock', 'Only the middle pair matches.', ['orange', 'apple', 'apple', 'orange'])], desc: 'Think in groups and symmetry' },
    { baskets: [crate('Outside pair', 'The outside pair is red; center is sun.', ['apple', 'orange', 'orange', 'orange', 'apple']), crate('Inside pair', 'The inside pair is red.', ['orange', 'apple', 'apple', 'orange'])], desc: 'Compare outside and inside positions' },
    { baskets: [crate('Turnstile', 'The pattern turns after every two moves.', ['apple', 'orange', 'orange', 'apple', 'apple']), crate('Final sun', 'Hold one sun for the end.', ['apple', 'apple', 'orange'])], desc: 'Save the right fruit for the final slot' },
  ]
  const puzzle = puzzlePatterns[w]
  return { baskets: puzzle.baskets, totalFruits: countRecipe(puzzle.baskets), fruitKinds: ['apple', 'orange'], timeLimit: 22, description: puzzle.desc }

}

function recipeForWave(difficulty: Difficulty, waveNum: number, baskets: Basket[]): Basket[] {
  if (baskets.every(basket => basket.recipe)) return baskets

  // A few routes turn sorting into a real packing puzzle: every crate has a fruit recipe.
  if (difficulty === 'medium' && waveNum % 5 === 0) {
    return baskets.map((basket, index) => ({ ...basket, label: index === 0 ? 'Red crate' : 'Sun crate', recipe: Array(basket.target).fill(index === 0 ? 'apple' : 'orange') }))
  }
  if ((difficulty === 'hard' || difficulty === 'expert') && waveNum % 5 === 1) {
    return baskets.map((basket, index) => ({ ...basket, label: index === 1 ? 'Sun crate' : 'Red crate', recipe: Array(basket.target).fill(index === 1 ? 'orange' : 'apple') }))
  }
  return baskets
}

function crate(label: string, clue: string, recipe: FruitKind[]): Basket {
  return { target: recipe.length, label, clue, recipe, current: 0 }
}

function countRecipe(baskets: Basket[]): number {
  return baskets.reduce((total, basket) => total + (basket.recipe?.length ?? basket.target), 0)
}

function spawnFruits(plan: FruitKind[], areaWidth: number): FruitItem[] {
  const fruits: FruitItem[] = []
  const cols = Math.min(plan.length, 10)
  const spacing = Math.min(70, (areaWidth - 40) / cols)
  for (let i = 0; i < plan.length; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    fruits.push({
      id: i,
      kind: plan[i],
      pos: { x: 20 + col * spacing, y: 10 + row * 72 },
      inBasket: null,
      grabbed: false,
    })
  }
  return fruits
}

function fruitPlanFor(baskets: Basket[], kinds: FruitKind[]): FruitKind[] {
  const recipe = baskets.flatMap(basket => basket.recipe ?? [])
  const missing = baskets.reduce((total, basket) => total + basket.target, 0) - recipe.length
  const plan = [...recipe, ...Array.from({ length: missing }, (_, index) => kinds[index % kinds.length])]
  return plan.sort(() => Math.random() - 0.5)
}

// ─── Difficulty config ───

function getLevelConfig(difficulty: Difficulty) {
  return {
    easy: { lives: 5, waves: 4, pointsPerFruit: 10, timeBonusMultiplier: 5 },
    medium: { lives: 4, waves: 5, pointsPerFruit: 15, timeBonusMultiplier: 8 },
    hard: { lives: 3, waves: 5, pointsPerFruit: 20, timeBonusMultiplier: 10 },
    expert: { lives: 2, waves: 5, pointsPerFruit: 30, timeBonusMultiplier: 15 },
  }[difficulty]
}

// ─── Main Game ───

export function BasketBuilderGame({
  difficulty = 'medium',
  onComplete,
  onBack,
}: {
  difficulty?: Difficulty
  onComplete: (score: number, combo: number, time: number) => void
  onBack: () => void
}) {
  const config = getLevelConfig(difficulty)
  const [waveNum, setWaveNum] = useState(0)
  const [wave, setWave] = useState<WaveConfig>(() => generateWave(difficulty, 0))
  const [fruits, setFruits] = useState<FruitItem[]>([])
  const [baskets, setBaskets] = useState<Basket[]>([])
  const [lives, setLives] = useState(config.lives)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [waveComplete, setWaveComplete] = useState(false)
  const [dragId, setDragId] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState<Vec2>({ x: 0, y: 0 })
  const [wrongBasket, setWrongBasket] = useState<number | null>(null)
  const [correctBasket, setCorrectBasket] = useState<number | null>(null)
  const [selectedBasket, setSelectedBasket] = useState<number | null>(null)
  const [boosts, setBoosts] = useState(2)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Initialize wave
  const initWave = useCallback((wNum: number) => {
    const baseWave = generateWave(difficulty, wNum)
    const w = { ...baseWave, baskets: recipeForWave(difficulty, wNum, baseWave.baskets) }
    setWave(w)
    setBaskets(w.baskets.map(b => ({ ...b, current: 0 })))
    setTimeLeft(w.timeLimit)
    setWaveComplete(false)
    const width = gameAreaRef.current?.offsetWidth ?? 600
    setFruits(spawnFruits(fruitPlanFor(w.baskets, w.fruitKinds), width))
    setSelectedBasket(0)
    setBoosts(2)
  }, [difficulty])

  useEffect(() => { initWave(0) }, [initWave])

  // Timer
  useEffect(() => {
    if (gameOver || won || waveComplete) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          // Time ran out for this wave
          setLives(l => {
            const n = l - 1
            if (n <= 0) setGameOver(true)
            return n
          })
          setStreak(0)
          // Move to next wave even on failure
          const next = waveNum + 1
          if (next >= config.waves) {
            setWon(true)
          } else {
            setWaveNum(next)
            initWave(next)
          }
          return 0
        }
        return t - 1
      })
      setTotalTime(t => t + 1)
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [gameOver, won, waveComplete, waveNum, config.waves, initWave])

  // Check wave completion
  useEffect(() => {
    if (baskets.length === 0 || gameOver || won) return
    const allFull = baskets.every((b, i) => b.current >= wave.baskets[i].target)
    if (allFull) {
      setWaveComplete(true)
      const timeBonus = timeLeft * config.timeBonusMultiplier
      const newStreak = streak + 1
      setStreak(newStreak)
      if (newStreak > bestStreak) setBestStreak(newStreak)
      setScore(s => s + timeBonus + (config.pointsPerFruit * wave.totalFruits) * Math.min(newStreak, 5))

      setTimeout(() => {
        const next = waveNum + 1
        if (next >= config.waves) {
          setWon(true)
        } else {
          setWaveNum(next)
          initWave(next)
        }
      }, 1200)
    }
  }, [baskets])

  // ─── Pointer-based drag (works on touch + mouse) ───

  const handlePointerDown = (e: React.PointerEvent, fruitId: number) => {
    if (gameOver || won || waveComplete) return
    const fruit = fruits.find(f => f.id === fruitId)
    if (!fruit) return

    const rect = gameAreaRef.current?.getBoundingClientRect()
    if (!rect) return

    e.currentTarget.setPointerCapture(e.pointerId)
    setDragId(fruitId)

    // If fruit was in a basket, remove it
    if (fruit.inBasket !== null) {
      setBaskets(prev => prev.map((b, i) => i === fruit.inBasket ? { ...b, current: b.current - 1 } : b))
    }

    setFruits(prev => prev.map(f =>
      f.id === fruitId
        ? { ...f, grabbed: true, inBasket: null }
        : f
    ))

    setDragOffset({
      x: e.clientX - rect.left - fruit.pos.x,
      y: e.clientY - rect.top - fruit.pos.y,
    })
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragId === null) return
    const rect = gameAreaRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, rect.width - 56))
    const y = Math.max(0, Math.min(e.clientY - rect.top - dragOffset.y, rect.height - 56))

    setFruits(prev => prev.map(f =>
      f.id === dragId ? { ...f, pos: { x, y } } : f
    ))
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragId === null) return

    const rect = gameAreaRef.current?.getBoundingClientRect()
    if (!rect) return

    const fruit = fruits.find(f => f.id === dragId)
    if (!fruit) { setDragId(null); return }

    const fruitCenterX = fruit.pos.x + 28
    const fruitCenterY = fruit.pos.y + 28

    // Check which basket the fruit was dropped on
    const basketAreaTop = rect.height - 180
    let droppedBasket: number | null = null

    if (fruitCenterY > basketAreaTop) {
      const basketWidth = rect.width / baskets.length
      const bIdx = Math.floor(fruitCenterX / basketWidth)
      if (bIdx >= 0 && bIdx < baskets.length) {
        droppedBasket = bIdx
      }
    }

    if (droppedBasket !== null) {
      const basket = baskets[droppedBasket]
      const neededFruit = wave.baskets[droppedBasket].recipe?.[basket.current]
      if (basket.current < wave.baskets[droppedBasket].target && (!neededFruit || neededFruit === fruit.kind)) {
        // Valid drop
        setCorrectBasket(droppedBasket)
        setTimeout(() => setCorrectBasket(null), 400)

        setBaskets(prev => prev.map((b, i) => i === droppedBasket ? { ...b, current: b.current + 1 } : b))
        setFruits(prev => prev.map(f =>
          f.id === dragId ? { ...f, grabbed: false, inBasket: droppedBasket } : f
        ))
      } else {
        // Basket is full — wrong move
        setWrongBasket(droppedBasket)
        setTimeout(() => setWrongBasket(null), 500)
        setStreak(0)
        setLives(l => {
          const n = l - 1
          if (n <= 0) { setGameOver(true); if (timerRef.current) clearInterval(timerRef.current) }
          return n
        })
        // Return fruit to shelf
        setFruits(prev => prev.map(f =>
          f.id === dragId ? { ...f, grabbed: false, inBasket: null } : f
        ))
      }
    } else {
      // Dropped outside baskets — just release
      setFruits(prev => prev.map(f =>
        f.id === dragId ? { ...f, grabbed: false } : f
      ))
    }

    setDragId(null)
  }

  // ─── Game Over / Victory screens ───

  if (gameOver) {
    return (
      <section className="mx-auto max-w-2xl text-center py-10">
        <div className="text-7xl mb-6">💀</div>
        <h1 className="text-5xl font-black mb-2">Game Over</h1>
        <p className="text-xl font-semibold text-muted-foreground mb-2">
          You completed {waveNum} of {config.waves} waves
        </p>
        <StatCard>
          <Stat label="Score" value={score.toLocaleString()} icon={<Trophy className="size-5 text-primary" />} />
          <Stat label="Best Streak" value={`${bestStreak}x`} icon={<Flame className="size-5 text-orange-500" />} />
          <Stat label="Time" value={`${totalTime}s`} icon={<Clock className="size-5 text-blue-500" />} />
        </StatCard>
        <div className="flex flex-wrap justify-center gap-3">
          <Button size="lg" variant="outline" onClick={onBack}>Back to Games</Button>
          <Button size="lg" onClick={() => onComplete(score, bestStreak, totalTime * 10)}>
            Save Score <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </section>
    )
  }

  if (won) {
    const finalScore = score + lives * 500 + bestStreak * 200
    return (
      <section className="mx-auto max-w-2xl text-center py-10">
        <div className="text-7xl mb-6 animate-bounce">🏆</div>
        <h1 className="text-5xl font-black mb-2">All Waves Cleared!</h1>
        <p className="text-xl font-semibold text-muted-foreground mb-2">You mastered all {config.waves} waves!</p>
        <StatCard className="from-yellow-50 to-amber-50">
          <Stat label="Base" value={score.toLocaleString()} icon={<Trophy className="size-5 text-primary" />} />
          <Stat label="Lives" value={`+${lives * 500}`} icon={<Heart className="size-5 text-red-500" />} />
          <Stat label="Streak" value={`+${bestStreak * 200}`} icon={<Flame className="size-5 text-orange-500" />} />
          <Stat label="Total" value={finalScore.toLocaleString()} icon={<Zap className="size-5 text-yellow-500" />} />
        </StatCard>
        <div className="flex flex-wrap justify-center gap-3">
          <Button size="lg" variant="outline" onClick={onBack}>Back to Games</Button>
          <Button size="lg" onClick={() => onComplete(finalScore, bestStreak, totalTime * 10)}>
            Continue <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </section>
    )
  }

  // ─── Active gameplay ───

  const timePercent = wave.timeLimit > 0 ? (timeLeft / wave.timeLimit) * 100 : 0
  const timeBarColor = timeLeft > wave.timeLimit * 0.5 ? 'bg-green-500' : timeLeft > wave.timeLimit * 0.25 ? 'bg-orange-500' : 'bg-red-500 animate-pulse'
  const shelfFruits = fruits.filter(f => f.inBasket === null)
  const selected = (selectedBasket === null ? null : baskets[selectedBasket]) ?? { target: 0, label: '', current: 0 }
  const boostLoad = () => {
    if (selectedBasket === null || boosts <= 0 || waveComplete) return
    const basket = baskets[selectedBasket]
    const required = wave.baskets[selectedBasket].recipe?.[basket.current]
    const fruit = shelfFruits.find(item => !required || item.kind === required)
    if (!fruit || basket.current >= wave.baskets[selectedBasket].target) return
    setFruits(previous => previous.map(item => item.id === fruit.id ? { ...item, inBasket: selectedBasket } : item))
    setBaskets(previous => previous.map((item, index) => index === selectedBasket ? { ...item, current: item.current + 1 } : item))
    setBoosts(value => value - 1)
    setCorrectBasket(selectedBasket)
    setTimeout(() => setCorrectBasket(null), 400)
  }

  return (
    <section className="flex w-full flex-col gap-4 select-none">
      {/* HUD */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: config.lives }).map((_, i) => (
              <Heart key={i} className={`size-5 transition-all duration-300 ${i < lives ? 'fill-red-500 text-red-500' : 'fill-none text-muted-foreground/30 scale-75'}`} />
            ))}
          </div>
          {streak > 1 && (
            <div className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700">
              <Flame className="size-4" /> {streak}x wave streak!
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm font-black">
          <span className="rounded-full bg-muted px-3 py-1">Wave {waveNum + 1}/{config.waves}</span>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">{score.toLocaleString()} pts</span>
        </div>
      </div>

      {/* Timer */}
      <div className="relative h-3 w-full overflow-hidden rounded-full border-2 border-foreground bg-card">
        <div className={`h-full transition-all duration-1000 ease-linear ${timeBarColor}`} style={{ width: `${timePercent}%` }} />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-black">{timeLeft}s</span>
      </div>

      {/* Mission description */}
      <div className="grid gap-3 rounded-2xl border-3 border-foreground bg-card p-4 shadow-[0_4px_0_var(--foreground)] md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-xs font-black uppercase text-primary">Packing route</p>
          <p className="text-lg font-black">{wave.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {wave.baskets.flatMap((basket, basketIndex) => basket.recipe?.map((kind, index) => (
            <span key={`${basketIndex}-${index}`} className={`size-6 rounded-full border-2 border-foreground ${kind === 'apple' ? 'bg-red-300' : 'bg-orange-300'}`} />
          )) ?? [])}
        </div>
      </div>

      {/* Wave complete overlay */}
      {waveComplete && (
        <div className="text-center py-4 rounded-2xl bg-green-50 border-4 border-green-400">
          <div className="text-4xl mb-2">✨</div>
          <p className="text-2xl font-black text-green-700">Wave Complete!</p>
          <p className="text-sm font-bold text-green-600">+{timeLeft * config.timeBonusMultiplier} time bonus</p>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
      {/* Game area */}
      <div
        ref={gameAreaRef}
        className="relative overflow-hidden rounded-3xl border-4 border-foreground bg-gradient-to-b from-cyan-100 via-white to-lime-100 shadow-[0_8px_0_var(--foreground)] touch-none"
        style={{ minHeight: 560 }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Shelf area label */}
        <div className="absolute left-4 top-3 rounded-full bg-white/80 px-3 py-1 text-xs font-black uppercase text-muted-foreground">
          Fruit shelf
        </div>
        {/* Shelf divider */}
        <div className="absolute left-0 right-0 border-t-2 border-dashed border-foreground/20" style={{ top: '60%' }} />
        <div className="absolute left-4 rounded-full bg-white/80 px-3 py-1 text-xs font-black text-muted-foreground" style={{ top: 'calc(60% + 8px)' }}>
          Crate bay
        </div>

        {/* Fruits */}
        {fruits.map((fruit) => {
          const isInBasket = fruit.inBasket !== null
          if (isInBasket && !fruit.grabbed) return null // Hide fruits in baskets (shown as count)

          return (
            <div
              key={fruit.id}
              onPointerDown={(e) => handlePointerDown(e, fruit.id)}
              className={`absolute cursor-grab active:cursor-grabbing transition-shadow ${fruit.grabbed ? 'z-50 scale-110 drop-shadow-xl' : 'z-10 hover:scale-105 hover:drop-shadow-lg'}`}
              style={{
                left: fruit.pos.x,
                top: fruit.pos.y,
                width: 56,
                height: 56,
                transition: fruit.grabbed ? 'none' : 'transform 0.15s, filter 0.15s',
              }}
            >
              <div className="relative w-full h-full rounded-full border-3 border-foreground bg-card shadow-[0_4px_0_var(--foreground)] overflow-hidden">
                <Image
                  src={`/play2learn/${fruit.kind}.png`}
                  alt={fruit.kind}
                  fill
                  sizes="56px"
                  className="object-cover scale-125 pointer-events-none"
                  draggable={false}
                />
              </div>
            </div>
          )
        })}

        {/* Baskets */}
        <div className="absolute bottom-0 left-0 right-0 flex" style={{ height: 180 }}>
          {baskets.map((basket, i) => {
            const target = wave.baskets[i].target
            const full = basket.current >= target
            const isWrong = wrongBasket === i
            const isCorrect = correctBasket === i

            return (
              <div
                key={i}
                onClick={() => setSelectedBasket(i)}
                className={`flex-1 flex flex-col items-center justify-end p-2 pb-4 transition-all duration-300
                  ${isWrong ? 'animate-[shake_0.4s_ease]' : ''}
                  ${isCorrect ? 'scale-[1.03]' : ''}
                `}
              >
                {/* Basket visual */}
                <div className={`relative w-full max-w-[170px] rounded-3xl border-4 p-3 text-center transition-all duration-300 ${
                  full
                    ? 'border-green-500 bg-green-100 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                    : isWrong
                      ? 'border-red-500 bg-red-50'
                      : selectedBasket === i
                        ? 'border-primary bg-white shadow-[0_6px_0_var(--foreground)]'
                        : 'border-foreground bg-white/85 shadow-[0_6px_0_var(--foreground)]'
                }`} style={{ minHeight: 120 }}>

                  {/* Fruits in basket visualization */}
                  <div className="mb-3 grid min-h-[44px] grid-cols-5 justify-items-center gap-1">
                    {(wave.baskets[i].recipe ?? []).map((kind, j) => (
                      <div key={j} className={`relative grid size-8 place-items-center overflow-hidden rounded-full border-2 text-[10px] font-black ${
                        j < basket.current
                          ? 'border-foreground bg-card'
                          : j === basket.current
                            ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                            : kind === 'apple'
                              ? 'border-red-400 bg-red-100 text-red-700'
                              : 'border-orange-400 bg-orange-100 text-orange-700'
                      }`}>
                        {j < basket.current ? (
                          <Image
                            src={`/play2learn/${kind}.png`}
                            alt=""
                            fill
                            sizes="32px"
                            className="object-cover scale-125 pointer-events-none"
                            draggable={false}
                          />
                        ) : (
                          kind === 'apple' ? 'R' : 'S'
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Counter */}
                  <div className={`rounded-full px-3 py-1 text-sm font-black ${full ? 'bg-green-200 text-green-800' : 'bg-card'}`}>
                    {basket.current}/{target}
                  </div>

                  {full && (
                    <div className="absolute -top-3 -right-1 text-lg">✅</div>
                  )}
                </div>

                {/* Basket label */}
                <p className="mt-1 text-xs font-black text-center">{basket.label}</p>
              </div>
            )
          })}
        </div>
      </div>

      <aside className="flex flex-col gap-3 rounded-3xl border-4 border-foreground bg-white p-4 shadow-[0_8px_0_var(--foreground)]">
        <div>
          <p className="text-xs font-black uppercase text-primary">Puzzle board</p>
          <h3 className="text-xl font-black">Crate clues</h3>
        </div>
        <p className="rounded-2xl bg-lime-50 p-3 text-sm font-bold">Each crate has a pattern. Pick a crate, read the clue, then load the next slot.</p>
        <div className="flex flex-col gap-2">
          {baskets.map((basket, index) => {
            const recipe = wave.baskets[index].recipe ?? []
            return (
              <button
                key={index}
                onClick={() => setSelectedBasket(index)}
                className={`rounded-2xl border-3 p-3 text-left font-black transition-all ${selectedBasket === index ? 'border-primary bg-lime-50 ring-4 ring-primary/20' : 'border-foreground bg-card/70 hover:-translate-y-0.5'}`}
              >
                <span className="block text-xs text-muted-foreground">CRATE {index + 1} / {basket.current}/{basket.target}</span>
                <span>{wave.baskets[index].label}</span>
                <span className="mt-1 block text-xs font-semibold text-muted-foreground">{wave.baskets[index].clue}</span>
                <span className="mt-2 flex flex-wrap gap-1">
                  {recipe?.map((kind, item) => (
                    <span key={item} className={`grid size-5 place-items-center rounded-full text-[10px] ${item < basket.current ? 'bg-green-300' : kind === 'apple' ? 'bg-red-300' : 'bg-orange-300'}`}>
                      {item < basket.current ? 'OK' : kind === 'apple' ? 'R' : 'S'}
                    </span>
                  ))}
                </span>
              </button>
            )
          })}
        </div>
        <div className="mt-auto rounded-2xl border-2 border-foreground bg-card p-3">
          <p className="text-xs font-black uppercase text-primary">Smart loader / {boosts} left</p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">Use it when you know the crate but want one quick move.</p>
          <Button className="mt-3 w-full" size="sm" variant="outline" disabled={selectedBasket === null || !selected || boosts === 0 || selected.current >= wave.baskets[selectedBasket].target} onClick={boostLoad}><Zap data-icon="inline-start" />Load next slot</Button>
        </div>
      </aside>
      </div>

      {/* Fruits remaining */}
      <div className="text-center text-sm font-bold text-muted-foreground">
        {shelfFruits.length} fruit{shelfFruits.length !== 1 ? 's' : ''} remaining on the shelf
      </div>
    </section>
  )
}

// ─── Shared UI ───

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1">
      {icon}
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <span className="text-2xl font-black">{value}</span>
    </div>
  )
}

function StatCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`my-8 rounded-3xl border-4 border-foreground bg-gradient-to-br ${className || 'from-card to-card'} p-6 shadow-[0_8px_0_var(--foreground)]`}>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">{children}</div>
    </div>
  )
}

// ─── Pattern Finder boilerplate ───

type SignalRound = { trail: number[]; answer: number; choices: number[]; clue: string }

function signalRounds(difficulty: Difficulty): SignalRound[] {
  const easy = [
    { trail: [2, 4, 6], answer: 8, choices: [8, 7, 10], clue: 'The charge rises by the same little hop.' },
    { trail: [5, 10, 15], answer: 20, choices: [18, 20, 25], clue: 'Each rooftop is powered the same way.' },
    { trail: [12, 10, 8], answer: 6, choices: [6, 5, 9], clue: 'The night current is gently cooling.' },
    { trail: [3, 6, 9], answer: 12, choices: [10, 12, 15], clue: 'The boosters match the first jump.' },
    { trail: [1, 3, 5], answer: 7, choices: [6, 7, 8], clue: 'Only every other glowbug lights up.' },
  ]
  const medium = [
    { trail: [4, 8, 12], answer: 16, choices: [14, 16, 20], clue: 'The towers are sharing equal charge packs.' },
    { trail: [30, 25, 20], answer: 15, choices: [15, 10, 18], clue: 'The city battery releases an equal bit each stop.' },
    { trail: [6, 12, 24], answer: 48, choices: [36, 42, 48], clue: 'The signal is getting twice as bright.' },
    { trail: [7, 11, 15], answer: 19, choices: [18, 19, 20], clue: 'Listen for the same rhythm between rooftops.' },
    { trail: [36, 30, 24], answer: 18, choices: [16, 18, 20], clue: 'A steady breeze takes the same charge each time.' },
  ]
  const hard = [
    { trail: [5, 10, 20], answer: 40, choices: [30, 35, 40], clue: 'The engine mirrors its last boost.' },
    { trail: [3, 6, 12, 24], answer: 48, choices: [42, 46, 48], clue: 'The skyline is doubling its pulse.' },
    { trail: [40, 35, 30], answer: 25, choices: [20, 25, 28], clue: 'The cloudbank takes an equal toll.' },
    { trail: [9, 18, 27], answer: 36, choices: [35, 36, 45], clue: 'Each gate gets the same power parcel.' },
    { trail: [2, 5, 10, 17], answer: 26, choices: [24, 26, 28], clue: 'Each boost is two stronger than the last.' },
  ]
  return difficulty === 'easy' ? easy : difficulty === 'medium' ? medium : hard
}

export function SkylineSignalGame({ difficulty = 'medium', onComplete, onBack }: { difficulty?: Difficulty; onComplete: (score: number, combo: number, time: number) => void; onBack: () => void }) {
  const rounds = signalRounds(difficulty)
  const livesMax = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 3 : 2
  const seconds = difficulty === 'easy' ? 18 : difficulty === 'medium' ? 14 : 11
  const [round, setRound] = useState(0); const [lives, setLives] = useState(livesMax); const [score, setScore] = useState(0); const [streak, setStreak] = useState(0); const [bestStreak, setBestStreak] = useState(0); const [timeLeft, setTimeLeft] = useState(seconds); const [elapsed, setElapsed] = useState(0); const [feedback, setFeedback] = useState<string | null>(null); const [finished, setFinished] = useState(false); const advancing = useRef(false)
  const moveOn = useCallback((nextLives: number) => { if (advancing.current) return; advancing.current = true; window.setTimeout(() => { if (nextLives <= 0 || round + 1 >= rounds.length) setFinished(true); else { setRound(value => value + 1); setTimeLeft(seconds); setFeedback(null) }; advancing.current = false }, 700) }, [round, rounds.length, seconds])
  useEffect(() => { if (finished || feedback) return; const timer = window.setInterval(() => { setTimeLeft(value => { if (value <= 1) { const nextLives = lives - 1; setLives(nextLives); setStreak(0); setFeedback('Signal faded — rerouting!'); moveOn(nextLives); return 0 }; return value - 1 }); setElapsed(value => value + 1) }, 1000); return () => window.clearInterval(timer) }, [finished, feedback, lives, moveOn])
  const chooseGate = (value: number) => { if (feedback || finished) return; const current = rounds[round]; if (value === current.answer) { const nextStreak = streak + 1; setStreak(nextStreak); setBestStreak(best => Math.max(best, nextStreak)); setScore(total => total + 100 + timeLeft * 10 + nextStreak * 25); setFeedback('Perfect boost!'); moveOn(lives) } else { const nextLives = lives - 1; setLives(nextLives); setStreak(0); setFeedback('That gate sputtered — try the next route!'); moveOn(nextLives) } }
  if (finished) { const finalScore = score + lives * 150; return <section className="mx-auto max-w-2xl py-10 text-center"><div className="mb-4 text-7xl">{lives > 0 ? '🏙️' : '🌙'}</div><h1 className="text-5xl font-black">{lives > 0 ? 'Skyline saved!' : 'Night flight complete!'}</h1><p className="mt-3 text-lg font-semibold text-muted-foreground">You navigated {round + (lives > 0 ? 1 : 0)} signal routes and built a {bestStreak}x boost streak.</p><StatCard className="from-violet-50 to-sky-50"><Stat label="Score" value={finalScore.toLocaleString()} icon={<Trophy className="size-5 text-primary" />} /><Stat label="Best boost" value={`${bestStreak}x`} icon={<Flame className="size-5 text-orange-500" />} /><Stat label="Time" value={`${elapsed}s`} icon={<Clock className="size-5 text-blue-500" />} /><Stat label="Power cells" value={`${lives}`} icon={<Zap className="size-5 text-yellow-500" />} /></StatCard><div className="flex justify-center gap-3"><Button size="lg" variant="outline" onClick={onBack}>Back to games</Button><Button size="lg" onClick={() => onComplete(finalScore, bestStreak, elapsed * 10)}>Collect rewards <ArrowRight data-icon="inline-end" /></Button></div></section> }
  const current = rounds[round]
  return <section className="mx-auto flex max-w-4xl flex-col gap-5 select-none"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex gap-1">{Array.from({ length: livesMax }).map((_, index) => <Heart key={index} className={`size-5 ${index < lives ? 'fill-pink-500 text-pink-500' : 'text-muted-foreground/30'}`} />)}</div><div className="rounded-full bg-violet-100 px-4 py-2 text-sm font-black text-violet-800">Route {round + 1}/{rounds.length}</div><div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">{score} pts</div></div><div className="h-3 overflow-hidden rounded-full border-2 border-foreground bg-card"><div className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-1000" style={{ width: `${(timeLeft / seconds) * 100}%` }} /></div><div className="relative overflow-hidden rounded-[2rem] border-4 border-foreground bg-gradient-to-b from-violet-950 via-indigo-800 to-sky-400 px-5 py-7 shadow-[0_10px_0_var(--foreground)] md:px-10"><div className="absolute inset-0 opacity-30 [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:28px_28px]" /><div className="relative text-center text-white"><p className="font-black uppercase tracking-[.2em] text-cyan-200">Skyline Signal</p><h2 className="mt-2 text-2xl font-black md:text-4xl">Pick the gate that keeps your glider charged</h2><p className="mt-3 font-semibold text-violet-100">{current.clue}</p><div className="my-7 flex flex-wrap items-center justify-center gap-3">{current.trail.map((charge, index) => <div key={index} className="grid size-14 place-items-center rounded-2xl border-3 border-white bg-white/15 text-xl font-black shadow-lg md:size-16">{charge}</div>)}<div className="grid size-14 place-items-center rounded-2xl border-3 border-dashed border-cyan-200 bg-cyan-300/20 text-2xl font-black md:size-16">?</div></div><div className="grid gap-3 sm:grid-cols-3">{current.choices.map((choice, index) => <button key={choice} onClick={() => chooseGate(choice)} className="group rounded-3xl border-4 border-foreground bg-card p-4 text-foreground shadow-[0_6px_0_#1e1b4b] transition-all hover:-translate-y-1 hover:bg-yellow-100 active:translate-y-1"><span className="text-xs font-black text-violet-600">GATE {String.fromCharCode(65 + index)}</span><span className="mt-1 block text-3xl font-black">{choice}</span></button>)}</div>{feedback && <div className="mt-6 rounded-2xl bg-white/95 px-4 py-3 font-black text-violet-900 animate-in fade-in zoom-in">{feedback}</div>}</div><div className="relative mt-7 flex items-end justify-between text-4xl"><span className="animate-bounce">🛸</span><span>🏢 🏢 🏢</span></div></div><div className="flex items-center justify-center gap-2 text-sm font-bold text-muted-foreground"><Sparkles className="size-4 text-primary" />The math is the engine — your mission is to keep flying. <span className="ml-2 rounded-full bg-muted px-3 py-1">{timeLeft}s</span></div><Button variant="ghost" className="self-center" onClick={() => { setRound(0); setLives(livesMax); setScore(0); setStreak(0); setBestStreak(0); setTimeLeft(seconds); setElapsed(0); setFeedback(null); setFinished(false) }}><RotateCcw data-icon="inline-start" />Restart flight</Button></section>
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
        <Button size="lg" variant="outline" onClick={onBack}>Back to games</Button>
      </div>
    </section>
  )
}
