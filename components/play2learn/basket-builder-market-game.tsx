'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import { ArrowRight, Coins, Sparkles, Star, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Difficulty } from '@/lib/play2learn'
import { FruitApple, FruitBanana, FruitOrange, FruitPear, FruitGrapes, FruitCarrot, WovenBasket, CharacterAvatar, CoinBurst } from './basket-market-assets'

type ProduceKind = 'apple' | 'banana' | 'carrot' | 'grapes' | 'orange' | 'pear'

type ProduceMeta = {
  kind: ProduceKind
  EmojiIcon: React.ElementType
  label: string
}

type ShelfItem = {
  id: number
  kind: ProduceKind
  EmojiIcon: React.ElementType
  label: string
  price: number
  inBasket: boolean
  isDecoy: boolean
}

type Puzzle = {
  target: number
  items: ShelfItem[]
  solutions: number[][]
  minSolutionSize: number
}

type Customer = {
  id: number
  name: string
  avatar: string
}

type EfficientLog = {
  usedItems: number
  minimumItems: number
  efficient: boolean
}

const palette = {
  horizonBlue: '#4FB6C9',
  meadowGreen: '#6FBF73',
  sunGold: '#FFC94D',
  coralSpark: '#FF7A5C',
  deepPlum: '#3B2F5E',
  cloudWhite: '#FDFBF7',
}

const produceCatalog: ProduceMeta[] = [
  { kind: 'apple', EmojiIcon: FruitApple, label: 'Apple' },
  { kind: 'banana', EmojiIcon: FruitBanana, label: 'Banana' },
  { kind: 'orange', EmojiIcon: FruitOrange, label: 'Orange' },
  { kind: 'pear', EmojiIcon: FruitPear, label: 'Pear' },
  { kind: 'grapes', EmojiIcon: FruitGrapes, label: 'Grapes' },
  { kind: 'carrot', EmojiIcon: FruitCarrot, label: 'Carrot' },
]

const customerNames = ['Liya', 'Noah', 'Sami', 'Mina', 'Kiya', 'Tariq', 'Ari', 'Zuri', 'Nuru', 'Pia']

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle<T>(items: T[]): T[] {
  const cloned = [...items]
  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = cloned[i]
    cloned[i] = cloned[j]
    cloned[j] = temp
  }
  return cloned
}

function multisetUnion(valuesA: number[], valuesB: number[]): number[] {
  const countA = new Map<number, number>()
  const countB = new Map<number, number>()

  for (const value of valuesA) countA.set(value, (countA.get(value) ?? 0) + 1)
  for (const value of valuesB) countB.set(value, (countB.get(value) ?? 0) + 1)

  const keys = new Set([...countA.keys(), ...countB.keys()])
  const merged: number[] = []
  for (const key of keys) {
    const maxCount = Math.max(countA.get(key) ?? 0, countB.get(key) ?? 0)
    for (let i = 0; i < maxCount; i += 1) merged.push(key)
  }

  return merged
}

function buildComboWithLength(target: number, length: number): number[] | null {
  const combo: number[] = []

  const search = (depth: number, remaining: number): boolean => {
    if (depth === length) return remaining === 0

    const slotsLeft = length - depth - 1
    const minAllowed = Math.max(2, remaining - slotsLeft * 12)
    const maxAllowed = Math.min(12, remaining - slotsLeft * 2)
    if (minAllowed > maxAllowed) return false

    const options = shuffle(Array.from({ length: maxAllowed - minAllowed + 1 }, (_, index) => minAllowed + index))
    for (const option of options) {
      combo.push(option)
      if (search(depth + 1, remaining - option)) return true
      combo.pop()
    }

    return false
  }

  return search(0, target) ? shuffle(combo) : null
}

function buildRandomCombo(target: number): number[] | null {
  const lengths = shuffle([2, 3, 4])
  for (const length of lengths) {
    const combo = buildComboWithLength(target, length)
    if (combo) return combo
  }
  return null
}

function comboSignature(values: number[]): string {
  return [...values].sort((a, b) => a - b).join('-')
}

function findSolutionSubsets(values: number[], target: number): number[][] {
  const subsets: number[][] = []
  const totalMasks = 1 << values.length

  for (let mask = 1; mask < totalMasks; mask += 1) {
    let sum = 0
    const subset: number[] = []
    for (let i = 0; i < values.length; i += 1) {
      if ((mask & (1 << i)) !== 0) {
        sum += values[i]
        subset.push(i)
      }
    }
    if (sum === target) subsets.push(subset)
  }

  return subsets
}

function subsetValueSignature(subset: number[], values: number[]): string {
  const subsetValues = subset.map((index) => values[index])
  return comboSignature(subsetValues)
}

function generateCustomer(seed: number): Customer {
  return {
    id: seed,
    name: customerNames[randomInt(0, customerNames.length - 1)],
    avatar: String(seed), // We'll just pass seed down to CharacterAvatar
  }
}

function getShiftGoal(difficulty: Difficulty): number {
  if (difficulty === 'easy') return 4
  if (difficulty === 'medium') return 6
  if (difficulty === 'hard') return 7
  return 8
}

function generateBasketBuilderPuzzle(): Puzzle {
  for (let attempt = 0; attempt < 2200; attempt += 1) {
    const target = randomInt(15, 35)
    const comboA = buildRandomCombo(target)
    const comboB = buildRandomCombo(target)
    if (!comboA || !comboB) continue

    if (comboSignature(comboA) === comboSignature(comboB)) continue

    const coreValues = multisetUnion(comboA, comboB)
    if (coreValues.length < 4 || coreValues.length > 5) continue

    const decoySlots = 6 - coreValues.length
    if (decoySlots < 1 || decoySlots > 2) continue

    const decoyValues: number[] = []
    let tries = 0
    while (decoyValues.length < decoySlots && tries < 160) {
      tries += 1
      const candidate = randomInt(2, 12)
      const trialValues = [...coreValues, ...decoyValues, candidate]
      const trialSolutions = findSolutionSubsets(trialValues, target)
      const candidateIndex = trialValues.length - 1
      const candidateUsed = trialSolutions.some((subset) => subset.includes(candidateIndex))
      if (candidateUsed) continue
      decoyValues.push(candidate)
    }
    if (decoyValues.length !== decoySlots) continue

    const taggedValues = shuffle([
      ...coreValues.map((price) => ({ price, isDecoy: false })),
      ...decoyValues.map((price) => ({ price, isDecoy: true })),
    ])

    const shelfValues = taggedValues.map((entry) => entry.price)
    const solutions = findSolutionSubsets(shelfValues, target)
    if (solutions.length < 2) continue

    const decoyIndexes = new Set<number>()
    taggedValues.forEach((entry, index) => {
      if (entry.isDecoy) decoyIndexes.add(index)
    })

    const decoyInAnySolution = solutions.some((subset) => subset.some((index) => decoyIndexes.has(index)))
    if (decoyInAnySolution) continue

    const solutionSignatures = new Set(solutions.map((subset) => subsetValueSignature(subset, shelfValues)))
    const comboAPresent = solutionSignatures.has(comboSignature(comboA))
    const comboBPresent = solutionSignatures.has(comboSignature(comboB))
    if (!comboAPresent || !comboBPresent) continue
    if (solutionSignatures.size > 3) continue

    const minSolutionSize = Math.min(...solutions.map((subset) => subset.length))

    const items = taggedValues.map((entry, index) => {
      const produce = produceCatalog[index % produceCatalog.length]
      return {
        id: index,
        kind: produce.kind,
        EmojiIcon: produce.EmojiIcon,
        label: produce.label,
        price: entry.price,
        inBasket: false,
        isDecoy: entry.isDecoy,
      }
    })

    return {
      target,
      items,
      solutions,
      minSolutionSize,
    }
  }

  // Guaranteed fallback with 2 solutions and 2 strict decoys.
  const fallbackPrices = [8, 7, 9, 6, 2, 2]
  const fallbackTarget = 15
  const fallbackSolutions = findSolutionSubsets(fallbackPrices, fallbackTarget)
  const fallbackItems = fallbackPrices.map((price, index) => {
    const produce = produceCatalog[index % produceCatalog.length]
    return {
      id: index,
      kind: produce.kind,
      EmojiIcon: produce.EmojiIcon,
      label: produce.label,
      price,
      inBasket: false,
      isDecoy: index >= 4,
    }
  })

  return {
    target: fallbackTarget,
    items: fallbackItems,
    solutions: fallbackSolutions,
    minSolutionSize: Math.min(...fallbackSolutions.map((subset) => subset.length)),
  }
}

function startRound() {
  const puzzle = generateBasketBuilderPuzzle()
  return {
    puzzle,
    basketIds: [] as number[],
  }
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
  const shiftGoal = useMemo(() => getShiftGoal(difficulty), [difficulty])
  const sessionStart = useRef(Date.now())
  const customerSeed = useRef(100)

  const firstRound = useMemo(() => startRound(), [])
  const [puzzle, setPuzzle] = useState<Puzzle>(firstRound.puzzle)
  const [items, setItems] = useState<ShelfItem[]>(firstRound.puzzle.items)
  const [basketIds, setBasketIds] = useState<number[]>(firstRound.basketIds)
  const [activeCustomer, setActiveCustomer] = useState<Customer>(() => generateCustomer(customerSeed.current++))
  const [queue, setQueue] = useState<Customer[]>([
    generateCustomer(customerSeed.current++),
    generateCustomer(customerSeed.current++),
    generateCustomer(customerSeed.current++),
  ])

  const [bubbleText, setBubbleText] = useState(`I need exactly ${firstRound.puzzle.target} birr of fruit!`)
  const [bubbleMode, setBubbleMode] = useState<'request' | 'under' | 'over' | 'happy'>('request')
  const [nudgeBubble, setNudgeBubble] = useState(false)
  const [serveStreak, setServeStreak] = useState(0)
  const [bestCombo, setBestCombo] = useState(0)
  const [score, setScore] = useState(0)
  const [customersServed, setCustomersServed] = useState(0)
  const [showCoins, setShowCoins] = useState(false)
  const [roundPoints, setRoundPoints] = useState(0)
  const [efficientToast, setEfficientToast] = useState(false)
  const [efficiencyLog, setEfficiencyLog] = useState<EfficientLog[]>([])
  const [finished, setFinished] = useState(false)
  const [dragPayload, setDragPayload] = useState<{ id: number; source: 'shelf' | 'basket' } | null>(null)

  // Track dragging state for visual feedback on drop zones
  const [isDraggingOverBasket, setIsDraggingOverBasket] = useState(false)
  const [isDraggingOverShelf, setIsDraggingOverShelf] = useState(false)

  const basketItems = basketIds.map((id) => items.find((item) => item.id === id)).filter((item): item is ShelfItem => item !== undefined)
  const subtotal = basketItems.reduce((sum, item) => sum + item.price, 0)
  const canServeExactly = subtotal === puzzle.target
  const lastEfficiency = efficiencyLog.length > 0 ? efficiencyLog[efficiencyLog.length - 1] : null

  const refreshRequestBubble = (target: number) => {
    setBubbleMode('request')
    setBubbleText(`I need exactly ${target} birr of fruit!`)
  }

  const rotateQueue = () => {
    setQueue((prev) => {
      const [nextCustomer, ...rest] = prev
      if (!nextCustomer) return prev
      setActiveCustomer(nextCustomer)
      return [...rest, generateCustomer(customerSeed.current++)]
    })
  }

  const beginNextCustomer = () => {
    const nextRound = startRound()
    setPuzzle(nextRound.puzzle)
    setItems(nextRound.puzzle.items)
    setBasketIds([])
    refreshRequestBubble(nextRound.puzzle.target)
  }

  const addToBasket = (itemId: number) => {
    if (showCoins) return
    const item = items.find((entry) => entry.id === itemId)
    if (!item || item.inBasket || finished) return

    setItems((prev) => prev.map((entry) => (entry.id === itemId ? { ...entry, inBasket: true } : entry)))
    setBasketIds((prev) => [...prev, itemId])
    if (bubbleMode !== 'request' && bubbleMode !== 'happy') {
      refreshRequestBubble(puzzle.target)
    }
  }

  const removeFromBasket = (itemId: number) => {
    if (finished || showCoins) return
    const item = items.find((entry) => entry.id === itemId)
    if (!item || !item.inBasket) return

    setItems((prev) => prev.map((entry) => (entry.id === itemId ? { ...entry, inBasket: false } : entry)))
    setBasketIds((prev) => {
      const index = prev.indexOf(itemId)
      if (index < 0) return prev
      return [...prev.slice(0, index), ...prev.slice(index + 1)]
    })
    if (bubbleMode !== 'request' && bubbleMode !== 'happy') {
      refreshRequestBubble(puzzle.target)
    }
  }

  const onServeAttempt = () => {
    if (finished || showCoins) return

    if (subtotal < puzzle.target) {
      setBubbleMode('under')
      setBubbleText('Almost, I need a bit more!')
      setNudgeBubble(true)
      window.setTimeout(() => setNudgeBubble(false), 450)
      return
    }

    if (subtotal > puzzle.target) {
      setBubbleMode('over')
      setBubbleText("That's too much for me!")
      setNudgeBubble(true)
      window.setTimeout(() => setNudgeBubble(false), 450)
      return
    }

    const usedItems = basketIds.length
    const efficient = usedItems === puzzle.minSolutionSize
    const streakAfterServe = serveStreak + 1
    const comboAfterServe = Math.max(bestCombo, streakAfterServe)
    const streakBonus = Math.min(streakAfterServe, 5) * 20
    const efficientBonus = efficient ? 90 : 0
    const points = 120 + puzzle.target * 3 + streakBonus + efficientBonus

    setEfficiencyLog((prev) => [...prev, { usedItems, minimumItems: puzzle.minSolutionSize, efficient }])
    setScore((prev) => prev + points)
    setRoundPoints(points)
    setServeStreak(streakAfterServe)
    setBestCombo(comboAfterServe)
    setCustomersServed((prev) => prev + 1)
    setBubbleMode('happy')
    setBubbleText('Perfect! What a haul!')
    setShowCoins(true)
    if (efficient) {
      setEfficientToast(true)
      window.setTimeout(() => setEfficientToast(false), 1500)
    }

    window.setTimeout(() => {
      setShowCoins(false)
      rotateQueue()
      if (customersServed + 1 >= shiftGoal) {
        setFinished(true)
        return
      }
      beginNextCustomer()
    }, 1200)
  }

  const onDropShelf = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault()
    setIsDraggingOverShelf(false)
    const payload = dragPayload
    setDragPayload(null)
    if (!payload || payload.source !== 'basket') return
    removeFromBasket(payload.id)
  }

  const onDropBasket = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault()
    setIsDraggingOverBasket(false)
    const payload = dragPayload
    setDragPayload(null)
    if (!payload || payload.source !== 'shelf') return
    addToBasket(payload.id)
  }

  if (finished) {
    const elapsed = Math.max(1, Math.round((Date.now() - sessionStart.current) / 1000))

    return (
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-[3rem] border-4 p-10 shadow-[0_16px_0_var(--foreground)] animate-in fade-in zoom-in-95 duration-500" style={{ backgroundColor: palette.cloudWhite, borderColor: palette.deepPlum }}>
        <div className="text-center">
          <div className="mx-auto mb-6 grid size-24 place-items-center rounded-3xl border-4 shadow-[0_6px_0_var(--foreground)]" style={{ backgroundColor: palette.sunGold, color: palette.deepPlum, borderColor: palette.deepPlum }}>
            <Trophy className="size-12 animate-[bounce_2s_ease-in-out_infinite]" />
          </div>
          <h2 className="text-5xl font-black mb-3" style={{ color: palette.deepPlum }}>Shift complete!</h2>
          <p className="text-xl font-semibold opacity-80" style={{ color: palette.deepPlum }}>Stall's a hit! You served {customersServed} customers today.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border-4 p-5 text-center flex flex-col items-center justify-center transition-transform hover:-translate-y-1" style={{ borderColor: palette.deepPlum, backgroundColor: '#fff', boxShadow: `0 6px 0 ${palette.deepPlum}` }}>
            <p className="text-sm font-black uppercase tracking-wide opacity-80" style={{ color: palette.horizonBlue }}>Score</p>
            <p className="mt-2 text-4xl font-black font-mono flex items-center gap-2" style={{ color: palette.deepPlum }}>
              <Coins className="size-6 text-[#FFC94D] fill-[#FFC94D]" />
              {score}
            </p>
          </div>
          <div className="rounded-3xl border-4 p-5 text-center flex flex-col items-center justify-center transition-transform hover:-translate-y-1" style={{ borderColor: palette.deepPlum, backgroundColor: '#fff', boxShadow: `0 6px 0 ${palette.deepPlum}` }}>
            <p className="text-sm font-black uppercase tracking-wide opacity-80" style={{ color: palette.horizonBlue }}>Best combo</p>
            <p className="mt-2 text-4xl font-black font-mono flex items-center gap-2" style={{ color: palette.deepPlum }}>
              <Sparkles className="size-6 text-[#6FBF73]" />
              {bestCombo}x
            </p>
          </div>
          <div className="rounded-3xl border-4 p-5 text-center flex flex-col items-center justify-center transition-transform hover:-translate-y-1" style={{ borderColor: palette.deepPlum, backgroundColor: '#fff', boxShadow: `0 6px 0 ${palette.deepPlum}` }}>
            <p className="text-sm font-black uppercase tracking-wide opacity-80" style={{ color: palette.horizonBlue }}>Time</p>
            <p className="mt-2 text-4xl font-black font-mono" style={{ color: palette.deepPlum }}>{elapsed}s</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <Button size="lg" variant="outline" onClick={onBack} className="border-3 text-lg h-14 rounded-2xl transition-all" style={{ borderColor: palette.deepPlum, color: palette.deepPlum, boxShadow: `0 6px 0 ${palette.deepPlum}` }}>
            Back to games
          </Button>
          <Button
            size="lg"
            onClick={() => onComplete(score, bestCombo, elapsed * 10)}
            className="border-3 text-lg h-14 rounded-2xl transition-all hover:-translate-y-1"
            style={{ backgroundColor: palette.coralSpark, color: palette.cloudWhite, borderColor: palette.deepPlum, boxShadow: `0 6px 0 ${palette.deepPlum}` }}
          >
            Collect rewards
            <ArrowRight data-icon="inline-end" className="ml-2" />
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto flex h-full w-full max-w-5xl flex-col gap-4 overflow-hidden p-1">
      {/* HUD Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border-4 px-4 py-2 shrink-0 bg-white/50 backdrop-blur-md shadow-[0_6px_0_var(--foreground)]" style={{ borderColor: palette.deepPlum }}>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 rounded-2xl border-2 px-4 py-2 shadow-sm transition-transform hover:-translate-y-0.5" style={{ backgroundColor: '#ffffff', borderColor: palette.deepPlum }}>
            <Coins className="size-5" style={{ color: palette.sunGold }} />
            <span className="font-black text-lg" style={{ color: palette.deepPlum }}>{score}</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border-2 px-4 py-2 shadow-sm transition-transform hover:-translate-y-0.5" style={{ backgroundColor: '#ffffff', borderColor: palette.deepPlum }}>
            <Sparkles className="size-5" style={{ color: palette.meadowGreen }} />
            <span className="font-black text-lg" style={{ color: palette.deepPlum }}>{serveStreak}x</span>
          </div>
        </div>
        <div className="rounded-2xl border-2 px-5 py-2 font-black text-lg shadow-sm" style={{ backgroundColor: '#ffffff', borderColor: palette.deepPlum, color: palette.deepPlum }}>
          Customer {customersServed + 1} of {shiftGoal}
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex flex-col md:flex-row flex-1 min-h-0 gap-4">

        {/* Left Column: Customer & Basket */}
        <div className="flex flex-1 flex-col gap-4 min-w-0">

          {/* Customer Interaction Area (The Stall Counter) */}
          <div className="relative overflow-hidden rounded-[2.5rem] border-4 shrink-0 shadow-[0_8px_0_var(--foreground)] flex flex-col justify-end" style={{ borderColor: palette.deepPlum, height: '180px' }}>

            <div className="relative z-10 flex flex-wrap items-end justify-between p-4 px-6 w-full">
              {/* Active Customer & Speech Bubble */}
              <div className="flex items-end gap-4">
                <div className="relative grid size-20 place-items-center rounded-[1.5rem] border-3 shadow-md bg-white transition-transform" style={{ borderColor: palette.deepPlum }}>
                  <CharacterAvatar seed={Number(activeCustomer.id)} className={`w-24 h-24 absolute bottom-0 ${bubbleMode === 'happy' ? '[&_.happy-mouth]:block [&_.normal-mouth]:hidden [&_.happy-eyes]:block' : ''}`} />
                </div>

                <div className={`relative mb-6 max-w-[280px] rounded-[1.5rem] border-3 px-5 py-3 text-base font-black shadow-md bg-white text-[#3B2F5E] ${nudgeBubble ? 'animate-[gentle-nudge_.45s_ease]' : ''}`} style={{ borderColor: palette.deepPlum }}>
                  {/* Speech bubble tail */}
                  <div className="absolute -left-3 bottom-2 w-4 h-4 bg-white border-b-3 border-l-3 rotate-45" style={{ borderColor: palette.deepPlum }} />
                  {bubbleText}
                </div>
              </div>

              {/* Customer Queue */}
              <div className="flex items-end gap-2 mb-2">
                {queue.map((customer, index) => (
                  <div
                    key={customer.id}
                    className={`relative rounded-[1rem] border-3 px-2 py-1 text-center bg-white/90 shadow-sm transition-all ${index === 0 ? 'animate-[bounce_2s_ease-in-out_infinite]' : ''}`}
                    style={{
                      borderColor: palette.deepPlum,
                      filter: index === 0 ? 'blur(0px)' : 'blur(1px)',
                      opacity: index === 0 ? 1 : 0.6,
                      transform: `scale(${0.9 - index * 0.1})`,
                    }}
                  >
                    <div className="flex justify-center" aria-hidden="true">
                      <CharacterAvatar seed={Number(customer.id)} className="w-10 h-10" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Basket Area */}
          <div className="flex flex-1 flex-col rounded-[2.5rem] border-4 p-5 shadow-[0_8px_0_var(--foreground)]" style={{ borderColor: palette.deepPlum, backgroundColor: palette.cloudWhite }}>

            {/* Price Target & Subtotal */}
            <div className="flex justify-between items-center mb-4 px-2">
              <div className="flex flex-col">
                <p className="text-xs font-black uppercase tracking-wider opacity-60" style={{ color: palette.deepPlum }}>Target</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-4xl font-black leading-none" style={{ color: palette.horizonBlue }}>{puzzle.target}</span>
                  <span className="font-bold text-sm opacity-60" style={{ color: palette.deepPlum }}>birr</span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <p className="text-xs font-black uppercase tracking-wider opacity-60" style={{ color: palette.deepPlum }}>Current</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-5xl font-black leading-none" style={{ color: palette.sunGold }}>{subtotal}</span>
                  <span className="font-bold text-sm opacity-60" style={{ color: palette.deepPlum }}>birr</span>
                </div>
              </div>
            </div>

            {/* The Physical Basket */}
            <div
              className={`relative flex-1 rounded-[2rem] border-3 overflow-hidden flex flex-col items-center justify-end min-h-0 transition-colors duration-300 ${isDraggingOverBasket ? 'bg-[#FFC94D]/10 border-[#FFC94D]' : 'bg-[#FDFBF7]'}`}
              style={{ borderColor: isDraggingOverBasket ? palette.sunGold : palette.deepPlum }}
              onDragOver={(event) => { event.preventDefault(); setIsDraggingOverBasket(true); }}
              onDragLeave={() => setIsDraggingOverBasket(false)}
              onDrop={onDropBasket}
            >
              <div className="absolute inset-0 border-4 border-dashed rounded-[2rem] opacity-20 m-2 pointer-events-none" style={{ borderColor: palette.deepPlum }} />

              <WovenBasket className="absolute bottom-[-10px] w-full max-w-[280px] pointer-events-none drop-shadow-xl z-10" />

              {showCoins && (
                <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
                  <CoinBurst className="w-[200px] h-[200px]" />
                </div>
              )}

              {/* Items in Basket */}
              <div className="relative z-20 w-full flex flex-wrap justify-center gap-3 max-w-[320px] pb-6 px-4">
                {basketItems.length === 0 && (
                  <p className="absolute inset-0 flex items-center justify-center text-sm font-bold opacity-40 text-center px-8" style={{ color: palette.deepPlum }}>
                    Drag produce here or tap the shelf items to fill the basket.
                  </p>
                )}
                {basketItems.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    draggable
                    onDragStart={() => setDragPayload({ id: item.id, source: 'basket' })}
                    onDragEnd={() => setDragPayload(null)}
                    onClick={() => removeFromBasket(item.id)}
                    disabled={showCoins}
                    className="flex flex-col items-center gap-1 rounded-2xl border-3 px-3 py-2 transition-transform hover:-translate-y-2 hover:shadow-[0_4px_0_var(--foreground)] bg-white/95 backdrop-blur-sm cursor-grab active:cursor-grabbing"
                    style={{ borderColor: palette.deepPlum, transform: `translateY(${i % 2 === 0 ? '4px' : '-4px'})`, boxShadow: `0 4px 0 rgba(59,47,94,0.15)` }}
                    aria-label={`Remove ${item.label} costing ${item.price} birr`}
                  >
                    <item.EmojiIcon className="w-10 h-10 pointer-events-none" />
                    <span className="font-mono text-sm font-black bg-[#FFC94D] text-[#3B2F5E] px-2 py-0.5 rounded-full border-2 border-[#3B2F5E]">{item.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-col items-center gap-2 shrink-0 h-16 relative justify-center">
              {efficientToast && (
                <div className="absolute -top-10 inline-flex items-center gap-2 rounded-full border-3 px-4 py-1.5 text-sm font-black animate-in fade-in slide-in-from-bottom-2 shadow-md z-30" style={{ borderColor: palette.deepPlum, backgroundColor: '#fff', color: palette.deepPlum }}>
                  <Star className="size-4" style={{ color: palette.sunGold }} fill={palette.sunGold} />
                  Perfectly efficient!
                </div>
              )}
              <Button
                size="lg"
                onClick={onServeAttempt}
                aria-disabled={!canServeExactly}
                disabled={showCoins}
                className="h-14 min-w-[200px] w-full max-w-[280px] rounded-2xl border-3 text-lg font-black transition-all active:scale-95"
                style={{
                  backgroundColor: canServeExactly ? palette.coralSpark : '#F3D2C9',
                  color: canServeExactly ? palette.cloudWhite : '#A47F75',
                  borderColor: palette.deepPlum,
                  opacity: canServeExactly ? 1 : 0.9,
                  boxShadow: canServeExactly ? `0 6px 0 ${palette.deepPlum}` : `0 2px 0 rgba(59,47,94,.4)`,
                  transform: canServeExactly ? 'translateY(-2px)' : 'none',
                }}
              >
                Serve Basket
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Shelf */}
        <div
          className={`w-full md:w-[280px] shrink-0 rounded-[2.5rem] border-4 p-5 flex flex-col shadow-[0_8px_0_var(--foreground)] transition-colors duration-300 ${isDraggingOverShelf ? 'bg-[#FF7A5C]/10 border-[#FF7A5C]' : 'bg-white'}`}
          style={{ borderColor: isDraggingOverShelf ? palette.coralSpark : palette.deepPlum }}
          onDragOver={(event) => { event.preventDefault(); setIsDraggingOverShelf(true); }}
          onDragLeave={() => setIsDraggingOverShelf(false)}
          onDrop={onDropShelf}
        >
          <div className="mb-4 flex flex-col shrink-0 text-center gap-1">
            <h3 className="text-2xl font-black" style={{ color: palette.deepPlum }}>Market Shelf</h3>
            <p className="text-xs font-black uppercase tracking-widest opacity-60" style={{ color: palette.deepPlum }}>
              Tap to add
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-1 content-start overflow-y-auto pr-1">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                draggable={!item.inBasket}
                onDragStart={() => {
                  if (!item.inBasket) setDragPayload({ id: item.id, source: 'shelf' })
                }}
                onDragEnd={() => setDragPayload(null)}
                onClick={() => addToBasket(item.id)}
                disabled={item.inBasket || showCoins}
                className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-3 p-3 text-center transition-all ${item.inBasket ? 'opacity-30 grayscale-[0.8] scale-95 shadow-none' : 'hover:-translate-y-1 hover:shadow-[0_6px_0_var(--foreground)] hover:bg-[#FFF9EA] cursor-grab active:cursor-grabbing bg-white'
                  }`}
                style={{
                  borderColor: palette.deepPlum,
                  boxShadow: item.inBasket ? 'none' : `0 4px 0 ${palette.deepPlum}`,
                }}
                aria-label={`Add ${item.label} costing ${item.price} birr`}
              >
                <item.EmojiIcon className="w-12 h-12 pointer-events-none" aria-hidden="true" />
                <span className="font-mono text-xl font-black leading-none" style={{ color: palette.deepPlum }}>{item.price}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div
        className="hidden"
        aria-hidden="true"
        data-last-used={lastEfficiency ? String(lastEfficiency.usedItems) : 'none'}
        data-last-minimum={lastEfficiency ? String(lastEfficiency.minimumItems) : 'none'}
      />
    </section>
  )
}
