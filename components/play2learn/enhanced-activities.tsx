'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, Heart, Lightbulb, Clock, Flame, Zap, Trophy, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Difficulty } from '@/lib/play2learn'

// --- Round generation ---

type Round = {
  question: string
  answer: number
  choices: number[]
  type: 'multiply' | 'divide' | 'missing' | 'word'
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateChoices(answer: number, count: number): number[] {
  const choices = new Set<number>([answer])
  const offsets = [-3, -2, -1, 1, 2, 3, 4, 5, -4, -5]
  const shuffledOffsets = shuffle(offsets)
  for (const off of shuffledOffsets) {
    const v = answer + off
    if (v > 0 && !choices.has(v)) choices.add(v)
    if (choices.size >= count) break
  }
  while (choices.size < count) choices.add(answer + choices.size + 1)
  return shuffle([...choices])
}

function generateRound(difficulty: Difficulty, roundNum: number): Round {
  const ranges: Record<Difficulty, { maxA: number; maxB: number }> = {
    easy: { maxA: 5, maxB: 4 },
    medium: { maxA: 8, maxB: 6 },
    hard: { maxA: 10, maxB: 9 },
    expert: { maxA: 12, maxB: 12 },
  }
  const r = ranges[difficulty]

  const types: Round['type'][] =
    difficulty === 'easy'
      ? ['multiply', 'multiply', 'divide']
      : difficulty === 'medium'
        ? ['multiply', 'divide', 'missing', 'word']
        : ['multiply', 'divide', 'missing', 'word', 'missing']

  const type = types[roundNum % types.length]

  const a = Math.floor(Math.random() * (r.maxA - 1)) + 2
  const b = Math.floor(Math.random() * (r.maxB - 1)) + 2
  const product = a * b
  const choiceCount = difficulty === 'easy' ? 3 : 4

  switch (type) {
    case 'multiply':
      return { question: `${a} × ${b} = ?`, answer: product, choices: generateChoices(product, choiceCount), type }
    case 'divide':
      return { question: `${product} ÷ ${a} = ?`, answer: b, choices: generateChoices(b, choiceCount), type }
    case 'missing':
      return { question: `${a} × __ = ${product}`, answer: b, choices: generateChoices(b, choiceCount), type }
    case 'word': {
      const fruits = ['apples', 'oranges', 'bananas', 'mangos']
      const fruit = fruits[Math.floor(Math.random() * fruits.length)]
      return { question: `${a} baskets with ${b} ${fruit} each. How many total?`, answer: product, choices: generateChoices(product, choiceCount), type }
    }
  }
}

function getLevelConfig(difficulty: Difficulty) {
  return {
    easy: { lives: 5, startTime: 60, roundsToWin: 8, streakBonus: 3, pointsPerAnswer: 100 },
    medium: { lives: 4, startTime: 45, roundsToWin: 12, streakBonus: 4, pointsPerAnswer: 150 },
    hard: { lives: 3, startTime: 30, roundsToWin: 16, streakBonus: 5, pointsPerAnswer: 200 },
    expert: { lives: 2, startTime: 20, roundsToWin: 20, streakBonus: 6, pointsPerAnswer: 300 },
  }[difficulty]
}

// --- Main Game ---

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
  const [round, setRound] = useState<Round>(() => generateRound(difficulty, 0))
  const [roundNum, setRoundNum] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(config.lives)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(config.startTime)
  const [totalTime, setTotalTime] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [shakeWrong, setShakeWrong] = useState<number | null>(null)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [hintActive, setHintActive] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const feedbackRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (gameOver || won) return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setLives((l) => { const n = l - 1; if (n <= 0) setGameOver(true); return n })
          setStreak(0)
          setFeedback('wrong')
          advanceRound()
          return config.startTime
        }
        return t - 1
      })
      setTotalTime((t) => t + 1)
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [gameOver, won, roundNum])

  const advanceRound = useCallback(() => {
    const n = roundNum + 1
    setRoundNum(n)
    setRound(generateRound(difficulty, n))
    setTimeLeft(config.startTime)
    setHintActive(false)
  }, [roundNum, difficulty, config.startTime])

  const handleAnswer = (chosen: number) => {
    if (gameOver || won || feedback) return
    if (feedbackRef.current) clearTimeout(feedbackRef.current)

    if (chosen === round.answer) {
      const mult = Math.floor(streak / config.streakBonus) + 1
      const pts = (config.pointsPerAnswer + Math.floor(timeLeft * 2)) * mult
      setScore((s) => s + pts)
      setStreak((s) => { const n = s + 1; if (n > bestStreak) setBestStreak(n); return n })
      setFeedback('correct')

      if (roundNum + 1 >= config.roundsToWin) {
        setWon(true)
        if (timerRef.current) clearInterval(timerRef.current)
        return
      }
      feedbackRef.current = setTimeout(() => { setFeedback(null); advanceRound() }, 600)
    } else {
      setShakeWrong(chosen)
      setStreak(0)
      setLives((l) => { const n = l - 1; if (n <= 0) { setGameOver(true); if (timerRef.current) clearInterval(timerRef.current) } return n })
      setFeedback('wrong')
      feedbackRef.current = setTimeout(() => { setFeedback(null); setShakeWrong(null); advanceRound() }, 800)
    }
  }

  const useHint = () => {
    if (hintsUsed >= 3 || hintActive) return
    setHintsUsed((h) => h + 1)
    setHintActive(true)
    setScore((s) => Math.max(s - 200, 0))
  }

  if (gameOver) {
    return (
      <section className="mx-auto max-w-2xl text-center py-10">
        <div className="text-7xl mb-6">💀</div>
        <h1 className="text-5xl font-black mb-2">Game Over</h1>
        <p className="text-xl font-semibold text-muted-foreground mb-2">
          You reached round {roundNum + 1} of {config.roundsToWin}
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
    const finalScore = score + lives * 500 + bestStreak * 100
    return (
      <section className="mx-auto max-w-2xl text-center py-10">
        <div className="text-7xl mb-6 animate-bounce">🏆</div>
        <h1 className="text-5xl font-black mb-2">Level Complete!</h1>
        <p className="text-xl font-semibold text-muted-foreground mb-2">All {config.roundsToWin} rounds cleared!</p>
        <StatCard className="from-yellow-50 to-amber-50">
          <Stat label="Base" value={score.toLocaleString()} icon={<Trophy className="size-5 text-primary" />} />
          <Stat label="Lives" value={`+${lives * 500}`} icon={<Heart className="size-5 text-red-500" />} />
          <Stat label="Streak" value={`+${bestStreak * 100}`} icon={<Flame className="size-5 text-orange-500" />} />
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

  const timePercent = (timeLeft / config.startTime) * 100
  const timeBarColor = timeLeft > config.startTime * 0.5 ? 'bg-green-500' : timeLeft > config.startTime * 0.25 ? 'bg-orange-500' : 'bg-red-500'
  const mult = Math.floor(streak / config.streakBonus) + 1

  return (
    <section className="flex flex-col gap-5 max-w-3xl mx-auto">
      {/* HUD */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: config.lives }).map((_, i) => (
              <Heart key={i} className={`size-6 transition-all duration-300 ${i < lives ? 'fill-red-500 text-red-500' : 'fill-none text-muted-foreground/30 scale-75'}`} />
            ))}
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-sm font-black text-orange-700">
              <Flame className="size-4" /> {streak}x
              {mult > 1 && <span className="ml-1 text-xs text-orange-500">({mult}x pts)</span>}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm font-black">
          <span className="rounded-full bg-muted px-3 py-1">Round {roundNum + 1}/{config.roundsToWin}</span>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">{score.toLocaleString()} pts</span>
        </div>
      </div>

      {/* Timer */}
      <div className="relative h-3 w-full overflow-hidden rounded-full border-2 border-foreground bg-card">
        <div className={`h-full transition-all duration-1000 ease-linear ${timeBarColor}`} style={{ width: `${timePercent}%` }} />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-black text-foreground">{timeLeft}s</span>
      </div>

      {/* Question */}
      <div className={`rounded-[2rem] border-4 border-foreground p-8 shadow-[0_10px_0_var(--foreground)] text-center transition-colors duration-300 ${
        feedback === 'correct' ? 'bg-green-50 border-green-500' : feedback === 'wrong' ? 'bg-red-50 border-red-500' : 'bg-card'
      }`}>
        <span className={`inline-block rounded-full px-4 py-1 text-xs font-black mb-4 ${
          round.type === 'multiply' ? 'bg-blue-100 text-blue-800' :
          round.type === 'divide' ? 'bg-purple-100 text-purple-800' :
          round.type === 'missing' ? 'bg-amber-100 text-amber-800' :
          'bg-green-100 text-green-800'
        }`}>
          {round.type === 'multiply' ? 'MULTIPLY' : round.type === 'divide' ? 'DIVIDE' : round.type === 'missing' ? 'FIND THE MISSING' : 'WORD PROBLEM'}
        </span>

        <h2 className={`text-3xl md:text-5xl font-black leading-relaxed ${feedback === 'wrong' ? 'animate-[shake_0.4s_ease]' : ''}`}>
          {round.question}
        </h2>

        {feedback === 'correct' && (
          <div className="mt-4 flex items-center justify-center gap-2 text-green-600 font-black text-xl">
            <Check className="size-6" /> Correct!
            {streak > 1 && <span className="text-orange-500">🔥 {streak}x streak!</span>}
          </div>
        )}
        {feedback === 'wrong' && (
          <div className="mt-4 flex items-center justify-center gap-2 text-red-600 font-black text-xl">
            <X className="size-6" /> Answer: {round.answer}
          </div>
        )}

        {hintActive && (
          <p className="mt-3 text-sm font-bold text-muted-foreground">
            Hint: the answer is {round.answer % 2 === 0 ? 'even' : 'odd'} and {round.answer > 10 ? 'greater than 10' : '10 or less'}.
          </p>
        )}
      </div>

      {/* Choices */}
      <div className={`grid gap-3 ${round.choices.length > 3 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-3'}`}>
        {round.choices.map((choice, idx) => {
          const isWrong = shakeWrong === choice
          const isCorrectReveal = feedback === 'wrong' && choice === round.answer
          const isCorrectPick = feedback === 'correct' && choice === round.answer
          const isHidden = hintActive && choice !== round.answer && idx === 0

          if (isHidden) {
            return (
              <div key={choice} className="rounded-2xl border-3 border-dashed border-muted-foreground/20 bg-muted/20 p-6 text-center opacity-40">
                <span className="text-2xl font-black text-muted-foreground">—</span>
              </div>
            )
          }

          return (
            <button
              key={choice}
              onClick={() => handleAnswer(choice)}
              disabled={!!feedback}
              className={`rounded-2xl border-3 border-foreground p-6 text-center font-black text-3xl shadow-[0_6px_0_var(--foreground)] transition-all
                ${isWrong ? 'animate-[shake_0.4s_ease] bg-red-100 border-red-500' : ''}
                ${isCorrectReveal ? 'bg-green-100 border-green-500 ring-4 ring-green-300' : ''}
                ${isCorrectPick ? 'bg-green-200 border-green-600 scale-105' : ''}
                ${!feedback ? 'bg-card hover:-translate-y-1 hover:shadow-[0_10px_0_var(--foreground)] active:translate-y-1 active:shadow-[0_2px_0_var(--foreground)]' : ''}
                disabled:cursor-default
              `}
            >
              {choice}
            </button>
          )
        })}
      </div>

      <div className="flex justify-center gap-3">
        <Button size="sm" variant="secondary" onClick={useHint} disabled={hintsUsed >= 3 || hintActive || !!feedback}>
          <Lightbulb data-icon="inline-start" /> Hint ({3 - hintsUsed} left)
        </Button>
      </div>
    </section>
  )
}

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
