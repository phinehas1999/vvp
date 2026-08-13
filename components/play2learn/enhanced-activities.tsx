'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, Heart, Clock, Flame, Zap, Trophy, Star } from 'lucide-react'
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
      { baskets: [{ target: 3, label: '3', current: 0 }, { target: 3, label: '3', current: 0 }], totalFruits: 6, desc: 'Put 3 fruits in each basket' },
      { baskets: [{ target: 4, label: '4', current: 0 }, { target: 4, label: '4', current: 0 }], totalFruits: 8, desc: 'Sort 8 fruits into 2 equal groups' },
      { baskets: [{ target: 2, label: '2', current: 0 }, { target: 2, label: '2', current: 0 }, { target: 2, label: '2', current: 0 }], totalFruits: 6, desc: '3 baskets, 2 each' },
      { baskets: [{ target: 5, label: '5', current: 0 }, { target: 5, label: '5', current: 0 }], totalFruits: 10, desc: 'Fill each basket with 5' },
      { baskets: [{ target: 3, label: '3', current: 0 }, { target: 3, label: '3', current: 0 }, { target: 3, label: '3', current: 0 }], totalFruits: 9, desc: '9 fruits, 3 per basket' },
    ]
    const p = patterns[w]
    return { baskets: p.baskets, totalFruits: p.totalFruits, fruitKinds: ['apple'], timeLimit: 45, description: p.desc }
  }

  if (difficulty === 'medium') {
    const patterns = [
      { baskets: [{ target: 4, label: '4 🍎', current: 0 }, { target: 3, label: '3 🍊', current: 0 }], totalFruits: 7, desc: 'Sort by type: 4 apples, 3 oranges' },
      { baskets: [{ target: 5, label: '5', current: 0 }, { target: 5, label: '5', current: 0 }, { target: 5, label: '5', current: 0 }], totalFruits: 15, desc: '15 fruits into 3 groups of 5' },
      { baskets: [{ target: 6, label: '6', current: 0 }, { target: 6, label: '6', current: 0 }], totalFruits: 12, desc: '12 fruits, half in each' },
      { baskets: [{ target: 3, label: '3', current: 0 }, { target: 4, label: '4', current: 0 }, { target: 5, label: '5', current: 0 }], totalFruits: 12, desc: 'Fill baskets: 3, 4, and 5' },
      { baskets: [{ target: 4, label: '4', current: 0 }, { target: 4, label: '4', current: 0 }, { target: 4, label: '4', current: 0 }, { target: 4, label: '4', current: 0 }], totalFruits: 16, desc: '16 fruits, 4 per basket' },
    ]
    const p = patterns[w]
    return { baskets: p.baskets, totalFruits: p.totalFruits, fruitKinds: ['apple', 'orange'], timeLimit: 35, description: p.desc }
  }

  if (difficulty === 'hard') {
    const patterns = [
      { baskets: [{ target: 6, label: '6', current: 0 }, { target: 6, label: '6', current: 0 }, { target: 6, label: '6', current: 0 }], totalFruits: 18, desc: '18 fruits into equal groups of 6' },
      { baskets: [{ target: 5, label: '5 🍎', current: 0 }, { target: 7, label: '7 🍊', current: 0 }, { target: 3, label: '3 🍎', current: 0 }], totalFruits: 15, desc: 'Sort: 5 apples, 7 oranges, 3 apples' },
      { baskets: [{ target: 8, label: '8', current: 0 }, { target: 8, label: '8', current: 0 }, { target: 8, label: '8', current: 0 }], totalFruits: 24, desc: '24 fruits, 8 per basket' },
      { baskets: [{ target: 4, label: '4', current: 0 }, { target: 4, label: '4', current: 0 }, { target: 4, label: '4', current: 0 }, { target: 4, label: '4', current: 0 }, { target: 4, label: '4', current: 0 }], totalFruits: 20, desc: '20 fruits across 5 baskets' },
      { baskets: [{ target: 7, label: '7', current: 0 }, { target: 5, label: '5', current: 0 }, { target: 9, label: '9', current: 0 }], totalFruits: 21, desc: 'Fill baskets: 7, 5, and 9' },
    ]
    const p = patterns[w]
    return { baskets: p.baskets, totalFruits: p.totalFruits, fruitKinds: ['apple', 'orange'], timeLimit: 30, description: p.desc }
  }

  // expert
  const patterns = [
    { baskets: [{ target: 10, label: '10', current: 0 }, { target: 10, label: '10', current: 0 }, { target: 10, label: '10', current: 0 }], totalFruits: 30, desc: '30 fruits, 10 per basket!' },
    { baskets: [{ target: 8, label: '8', current: 0 }, { target: 6, label: '6', current: 0 }, { target: 4, label: '4', current: 0 }, { target: 7, label: '7', current: 0 }], totalFruits: 25, desc: 'Fill 4 baskets: 8, 6, 4, 7' },
    { baskets: [{ target: 9, label: '9', current: 0 }, { target: 9, label: '9', current: 0 }, { target: 9, label: '9', current: 0 }, { target: 9, label: '9', current: 0 }], totalFruits: 36, desc: '36 fruits, 9 each across 4 baskets' },
    { baskets: [{ target: 12, label: '12', current: 0 }, { target: 12, label: '12', current: 0 }], totalFruits: 24, desc: '24 fruits, 12 in each basket' },
    { baskets: [{ target: 5, label: '5', current: 0 }, { target: 7, label: '7', current: 0 }, { target: 3, label: '3', current: 0 }, { target: 6, label: '6', current: 0 }, { target: 4, label: '4', current: 0 }], totalFruits: 25, desc: '25 fruits, 5 different baskets' },
  ]
  const p = patterns[w]
  return { baskets: p.baskets, totalFruits: p.totalFruits, fruitKinds: ['apple', 'orange'], timeLimit: 25, description: p.desc }
}

function spawnFruits(count: number, kinds: FruitKind[], areaWidth: number): FruitItem[] {
  const fruits: FruitItem[] = []
  const cols = Math.min(count, 8)
  const spacing = Math.min(70, (areaWidth - 40) / cols)
  for (let i = 0; i < count; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    fruits.push({
      id: i,
      kind: kinds[Math.floor(Math.random() * kinds.length)],
      pos: { x: 20 + col * spacing, y: 10 + row * 72 },
      inBasket: null,
      grabbed: false,
    })
  }
  return fruits
}

// ─── Difficulty config ───

function getLevelConfig(difficulty: Difficulty) {
  return {
    easy: { lives: 5, waves: 5, pointsPerFruit: 10, timeBonusMultiplier: 5 },
    medium: { lives: 4, waves: 7, pointsPerFruit: 15, timeBonusMultiplier: 8 },
    hard: { lives: 3, waves: 8, pointsPerFruit: 20, timeBonusMultiplier: 10 },
    expert: { lives: 2, waves: 10, pointsPerFruit: 30, timeBonusMultiplier: 15 },
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
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Initialize wave
  const initWave = useCallback((wNum: number) => {
    const w = generateWave(difficulty, wNum)
    setWave(w)
    setBaskets(w.baskets.map(b => ({ ...b, current: 0 })))
    setTimeLeft(w.timeLimit)
    setWaveComplete(false)
    const width = gameAreaRef.current?.offsetWidth ?? 600
    setFruits(spawnFruits(w.totalFruits, w.fruitKinds, width))
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
      if (basket.current < wave.baskets[droppedBasket].target) {
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

  return (
    <section className="flex flex-col gap-4 max-w-4xl mx-auto select-none">
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
      <div className="text-center">
        <p className="text-lg font-black">{wave.description}</p>
        <p className="text-sm font-semibold text-muted-foreground">Drag the fruits into the correct baskets!</p>
      </div>

      {/* Wave complete overlay */}
      {waveComplete && (
        <div className="text-center py-4 rounded-2xl bg-green-50 border-4 border-green-400">
          <div className="text-4xl mb-2">✨</div>
          <p className="text-2xl font-black text-green-700">Wave Complete!</p>
          <p className="text-sm font-bold text-green-600">+{timeLeft * config.timeBonusMultiplier} time bonus</p>
        </div>
      )}

      {/* Game area */}
      <div
        ref={gameAreaRef}
        className="relative rounded-[2rem] border-4 border-foreground bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50 shadow-[0_10px_0_var(--foreground)] overflow-hidden touch-none"
        style={{ minHeight: 520 }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Shelf area label */}
        <div className="absolute top-2 left-4 text-xs font-black text-muted-foreground/60 uppercase tracking-widest">
          🍎 Fruit Shelf — drag fruits down into baskets
        </div>

        {/* Shelf divider */}
        <div className="absolute left-0 right-0 border-t-2 border-dashed border-foreground/20" style={{ top: '60%' }} />
        <div className="absolute left-4 text-xs font-bold text-muted-foreground/40" style={{ top: 'calc(60% + 4px)' }}>
          ↓ Basket Zone
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
                className={`flex-1 flex flex-col items-center justify-end p-2 pb-4 transition-all duration-300
                  ${isWrong ? 'animate-[shake_0.4s_ease]' : ''}
                  ${isCorrect ? 'scale-[1.03]' : ''}
                `}
              >
                {/* Basket visual */}
                <div className={`relative w-full max-w-[140px] rounded-t-3xl rounded-b-xl border-4 p-3 text-center transition-all duration-300 ${
                  full
                    ? 'border-green-500 bg-green-100 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                    : isWrong
                      ? 'border-red-500 bg-red-50'
                      : 'border-foreground bg-amber-50/80 shadow-[0_6px_0_var(--foreground)]'
                }`} style={{ minHeight: 120 }}>

                  {/* Fruits in basket visualization */}
                  <div className="flex flex-wrap justify-center gap-0.5 mb-2 min-h-[40px]">
                    {Array.from({ length: basket.current }).map((_, j) => (
                      <div key={j} className="relative size-5 rounded-full overflow-hidden border border-foreground/30">
                        <Image
                          src={`/play2learn/${wave.fruitKinds[j % wave.fruitKinds.length]}.png`}
                          alt=""
                          fill
                          sizes="20px"
                          className="object-cover scale-125 pointer-events-none"
                          draggable={false}
                        />
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
