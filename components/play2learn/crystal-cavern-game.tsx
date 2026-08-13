'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, Heart, Clock, Flame, Zap, Trophy, Star, RotateCcw, Sparkles, Gem } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Difficulty } from '@/lib/play2learn'

// ─── Types ───

type CellType = 'wall' | 'floor' | 'crystal' | 'gate' | 'exit' | 'rock' | 'lava'

type Cell = {
  type: CellType
  emoji?: string
  gateEquation?: { a: number; b: number; op: string; answer: number }
  gateOpen?: boolean
  crystalCollected?: boolean
  rockFalling?: boolean
  rockTimer?: number
}

type Position = { row: number; col: number }

type GamePhase = 'playing' | 'gate-puzzle' | 'won' | 'lost'

type Level = {
  grid: Cell[][]
  playerStart: Position
  exitPos: Position
  timeLimit: number
  description: string
  depth: number
}

// ─── Constants ───

const COLS = 14
const ROWS = 10
const TICK_MS = 200 // rock falling speed

// ─── Equation generation ───

function generateEquation(difficulty: Difficulty): { a: number; b: number; op: string; answer: number } {
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
  switch (difficulty) {
    case 'easy': {
      const a = rand(1, 9)
      const b = rand(1, 9)
      return { a, b, op: '+', answer: a + b }
    }
    case 'medium': {
      const ops = ['+', '-', '×']
      const op = ops[rand(0, 2)]
      if (op === '×') {
        const a = rand(2, 6)
        const b = rand(2, 5)
        return { a, b, op, answer: a * b }
      }
      if (op === '-') {
        const a = rand(5, 18)
        const b = rand(1, a - 1)
        return { a, b, op, answer: a - b }
      }
      const a = rand(3, 15)
      const b = rand(3, 15)
      return { a, b, op, answer: a + b }
    }
    case 'hard': {
      const ops = ['+', '-', '×']
      const op = ops[rand(0, 2)]
      if (op === '×') {
        const a = rand(3, 9)
        const b = rand(3, 9)
        return { a, b, op, answer: a * b }
      }
      if (op === '-') {
        const a = rand(10, 30)
        const b = rand(1, a - 1)
        return { a, b, op, answer: a - b }
      }
      const a = rand(10, 50)
      const b = rand(10, 50)
      return { a, b, op, answer: a + b }
    }
    case 'expert': {
      const ops = ['+', '-', '×', '÷']
      const op = ops[rand(0, 3)]
      if (op === '÷') {
        const b = rand(2, 9)
        const answer = rand(2, 9)
        return { a: b * answer, b, op, answer }
      }
      if (op === '×') {
        const a = rand(4, 12)
        const b = rand(4, 12)
        return { a, b, op, answer: a * b }
      }
      if (op === '-') {
        const a = rand(20, 60)
        const b = rand(5, a - 1)
        return { a, b, op, answer: a - b }
      }
      const a = rand(15, 70)
      const b = rand(15, 70)
      return { a, b, op, answer: a + b }
    }
  }
}

// ─── Level generation ───

function generateLevel(difficulty: Difficulty, depth: number): Level {
  // Create empty grid
  const grid: Cell[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ type: 'floor' as CellType }))
  )

  // Walls around the border
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (r === 0 || r === ROWS - 1 || c === 0 || c === COLS - 1) {
        grid[r][c] = { type: 'wall' }
      }
    }
  }

  // Interior walls — create maze-like passages
  const wallPatterns = getWallPatterns(difficulty, depth)
  for (const [r, c] of wallPatterns) {
    if (r > 0 && r < ROWS - 1 && c > 0 && c < COLS - 1) {
      grid[r][c] = { type: 'wall' }
    }
  }

  // Place gates (math puzzles)
  const gateCount = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : difficulty === 'hard' ? 4 : 5
  const gateCells = getGatePositions(grid, gateCount)
  for (const [r, c] of gateCells) {
    grid[r][c] = { type: 'gate', gateEquation: generateEquation(difficulty), gateOpen: false }
  }

  // Place crystals
  const crystalCount = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : difficulty === 'hard' ? 8 : 10
  const crystalCells = getCrystalPositions(grid, crystalCount)
  for (const [r, c] of crystalCells) {
    grid[r][c] = { type: 'crystal', crystalCollected: false }
  }

  // Place falling rock spawners — spread across multiple rows near the top
  const rockCount = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : difficulty === 'hard' ? 8 : 10
  for (let i = 0; i < rockCount; i++) {
    const c = 2 + Math.floor(Math.random() * (COLS - 4))
    const spawnRow = 1 + (i % 2) // rows 1 and 2
    if (grid[spawnRow][c].type === 'floor') {
      const baseTimer = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 10 : difficulty === 'hard' ? 8 : 6
      const variance = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 10 : difficulty === 'hard' ? 8 : 6
      grid[spawnRow][c] = { type: 'rock', rockFalling: false, rockTimer: baseTimer + Math.floor(Math.random() * variance) }
    }
  }

  // Place lava patches on hard+ (decorative hazards)
  if (difficulty === 'hard' || difficulty === 'expert') {
    const lavaCount = difficulty === 'hard' ? 2 : 4
    for (let i = 0; i < lavaCount; i++) {
      const r = 2 + Math.floor(Math.random() * (ROWS - 4))
      const c = 2 + Math.floor(Math.random() * (COLS - 4))
      if (grid[r][c].type === 'floor') {
        grid[r][c] = { type: 'lava' }
      }
    }
  }

  // Player start (top-left area)
  const playerStart: Position = { row: 1, col: 1 }
  grid[playerStart.row][playerStart.col] = { type: 'floor' }

  // Exit (bottom-right area)
  const exitPos: Position = { row: ROWS - 2, col: COLS - 2 }
  grid[exitPos.row][exitPos.col] = { type: 'exit' }
  // Clear a path around exit
  if (grid[exitPos.row - 1][exitPos.col].type === 'wall') grid[exitPos.row - 1][exitPos.col] = { type: 'floor' }
  if (grid[exitPos.row][exitPos.col - 1].type === 'wall') grid[exitPos.row][exitPos.col - 1] = { type: 'floor' }

  const timeLimit = difficulty === 'easy' ? 60 : difficulty === 'medium' ? 50 : difficulty === 'hard' ? 40 : 35

  const descriptions = [
    'Navigate through the cavern and reach the glowing exit!',
    'Crystal gates block your path — solve them to pass!',
    'Dodge the falling rocks as you collect gems!',
    'The deeper you go, the trickier it gets!',
    'Find the exit before time runs out!',
  ]

  return {
    grid,
    playerStart,
    exitPos,
    timeLimit,
    description: descriptions[depth % descriptions.length],
    depth: depth + 1,
  }
}

function getWallPatterns(difficulty: Difficulty, depth: number): [number, number][] {
  const walls: [number, number][] = []
  const seed = depth * 7 + 3

  // Create a maze-like structure with corridors
  // Horizontal barriers
  const barrierRows = difficulty === 'easy' ? [3, 6] : difficulty === 'medium' ? [3, 5, 7] : [2, 4, 6, 8]
  for (const r of barrierRows) {
    if (r <= 0 || r >= ROWS - 1) continue
    const gapCol = ((seed * r + 5) % (COLS - 4)) + 2
    for (let c = 1; c < COLS - 1; c++) {
      // Leave gaps for passage
      if (Math.abs(c - gapCol) <= 1) continue
      if (Math.abs(c - (COLS - 1 - gapCol)) <= 1) continue
      if (Math.random() < 0.55) {
        walls.push([r, c])
      }
    }
  }

  // Vertical pillars
  const pillarCols = difficulty === 'easy' ? [5, 9] : [4, 7, 10]
  for (const c of pillarCols) {
    if (c <= 0 || c >= COLS - 1) continue
    const gapRow = ((seed * c + 3) % (ROWS - 4)) + 2
    for (let r = 1; r < ROWS - 1; r++) {
      if (Math.abs(r - gapRow) <= 1) continue
      if (Math.random() < 0.3) {
        walls.push([r, c])
      }
    }
  }

  return walls
}

function getGatePositions(grid: Cell[][], count: number): [number, number][] {
  const positions: [number, number][] = []
  let attempts = 0
  while (positions.length < count && attempts < 200) {
    const r = 2 + Math.floor(Math.random() * (ROWS - 4))
    const c = 2 + Math.floor(Math.random() * (COLS - 4))
    if (grid[r][c].type === 'floor' && !positions.some(([pr, pc]) => pr === r && pc === c)) {
      positions.push([r, c])
    }
    attempts++
  }
  return positions
}

function getCrystalPositions(grid: Cell[][], count: number): [number, number][] {
  const positions: [number, number][] = []
  let attempts = 0
  while (positions.length < count && attempts < 200) {
    const r = 1 + Math.floor(Math.random() * (ROWS - 2))
    const c = 1 + Math.floor(Math.random() * (COLS - 2))
    if (grid[r][c].type === 'floor' && !positions.some(([pr, pc]) => pr === r && pc === c)) {
      positions.push([r, c])
    }
    attempts++
  }
  return positions
}

// ─── Tile rendering ───

function tileEmoji(cell: Cell, isPlayer: boolean, isExit: boolean, exitUnlocked: boolean): string {
  if (isPlayer) return '⛏️'
  if (isExit) return exitUnlocked ? '🚪' : '🔐'
  switch (cell.type) {
    case 'wall': return '🪨'
    case 'crystal': return cell.crystalCollected ? '' : '💎'
    case 'gate': return cell.gateOpen ? '' : '🔒'
    case 'rock': return cell.rockFalling ? '🪨' : ''
    case 'lava': return '🔥'
    case 'exit': return exitUnlocked ? '🚪' : '🔐'
    default: return ''
  }
}

function tileBg(cell: Cell, isPlayer: boolean, isExit: boolean, exitUnlocked: boolean): string {
  if (isPlayer) return 'bg-amber-200 border-amber-400 shadow-[inset_0_0_12px_rgba(251,191,36,0.5)]'
  if (isExit) return exitUnlocked ? 'bg-emerald-200 border-emerald-400 animate-pulse' : 'bg-red-300/70 border-red-500'
  switch (cell.type) {
    case 'wall': return 'bg-slate-700 border-slate-800'
    case 'floor': return 'bg-stone-800/40 border-stone-700/30'
    case 'crystal': return cell.crystalCollected ? 'bg-stone-800/40 border-stone-700/30' : 'bg-purple-300/60 border-purple-400/80 animate-[pulse_2s_ease-in-out_infinite]'
    case 'gate': return cell.gateOpen ? 'bg-stone-800/40 border-stone-700/30' : 'bg-rose-300/70 border-rose-500'
    case 'rock': return cell.rockFalling ? 'bg-orange-400/80 border-orange-600 animate-bounce' : 'bg-stone-800/40 border-stone-700/30'
    case 'lava': return 'bg-red-500/60 border-red-600 animate-pulse'
    case 'exit': return exitUnlocked ? 'bg-emerald-200 border-emerald-400 animate-pulse' : 'bg-red-300/70 border-red-500'
    default: return 'bg-stone-800/40 border-stone-700/30'
  }
}

// ─── Config ───

function getLevelConfig(difficulty: Difficulty) {
  return {
    easy:   { lives: 5, levels: 3, pointsPerCrystal: 20, gateBonus: 50, timeBonusMultiplier: 5 },
    medium: { lives: 4, levels: 4, pointsPerCrystal: 30, gateBonus: 80, timeBonusMultiplier: 8 },
    hard:   { lives: 3, levels: 4, pointsPerCrystal: 40, gateBonus: 120, timeBonusMultiplier: 12 },
    expert: { lives: 2, levels: 5, pointsPerCrystal: 60, gateBonus: 200, timeBonusMultiplier: 18 },
  }[difficulty]
}

// ─── Main Game Component ───

export function CrystalCavernGame({
  difficulty = 'medium',
  onComplete,
  onBack,
}: {
  difficulty?: Difficulty
  onComplete: (score: number, combo: number, time: number) => void
  onBack: () => void
}) {
  const config = getLevelConfig(difficulty)

  const [levelNum, setLevelNum] = useState(0)
  const [level, setLevel] = useState<Level>(() => generateLevel(difficulty, 0))
  const [grid, setGrid] = useState<Cell[][]>(level.grid)
  const [playerPos, setPlayerPos] = useState<Position>(level.playerStart)
  const [lives, setLives] = useState(config.lives)
  const [score, setScore] = useState(0)
  const [crystalsCollected, setCrystalsCollected] = useState(0)
  const [gatesSolved, setGatesSolved] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(level.timeLimit)
  const [totalTime, setTotalTime] = useState(0)
  const [phase, setPhase] = useState<GamePhase>('playing')
  const [currentGate, setCurrentGate] = useState<{ row: number; col: number; equation: NonNullable<Cell['gateEquation']> } | null>(null)
  const [gateInput, setGateInput] = useState('')
  const [gateFeedback, setGateFeedback] = useState<string | null>(null)
  const [levelComplete, setLevelComplete] = useState(false)
  const [moveCount, setMoveCount] = useState(0)
  const [shakeWrong, setShakeWrong] = useState(false)
  const [flashCorrect, setFlashCorrect] = useState(false)
  const [lastDirection, setLastDirection] = useState<string>('down')

  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const rockTickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ─── Initialize level ───
  const initLevel = useCallback((num: number) => {
    const lv = generateLevel(difficulty, num)
    setLevel(lv)
    setGrid(lv.grid.map(row => row.map(cell => ({ ...cell }))))
    setPlayerPos({ ...lv.playerStart })
    setTimeLeft(lv.timeLimit)
    setLevelComplete(false)
    setCurrentGate(null)
    setGateInput('')
    setGateFeedback(null)
    setPhase('playing')
    setMoveCount(0)
  }, [difficulty])

  useEffect(() => { initLevel(0) }, [initLevel])

  // ─── Focus container for keyboard ───
  useEffect(() => {
    containerRef.current?.focus()
  }, [phase, levelComplete])

  // ─── Timer ───
  useEffect(() => {
    if (phase !== 'playing' || levelComplete) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setLives(l => {
            const n = l - 1
            if (n <= 0) setPhase('lost')
            return n
          })
          setStreak(0)
          // Move to next level even on timeout
          const next = levelNum + 1
          if (next >= config.levels) {
            setPhase('won')
          } else {
            setLevelNum(next)
            initLevel(next)
          }
          return 0
        }
        return t - 1
      })
      setTotalTime(t => t + 1)
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase, levelComplete, levelNum, config.levels, initLevel])

  // ─── Rock falling tick ───
  useEffect(() => {
    if (phase !== 'playing' || levelComplete) return
    rockTickRef.current = setInterval(() => {
      setGrid(prev => {
        const next = prev.map(row => row.map(cell => ({ ...cell })))
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            const cell = next[r][c]
            if (cell.type === 'rock' && cell.rockTimer !== undefined) {
              cell.rockTimer--
              if (cell.rockTimer <= 0) {
                // Rock falls — mark it as falling for visual
                cell.rockFalling = true
                // After a brief moment, reset
                cell.rockTimer = 10 + Math.floor(Math.random() * 15)
                setTimeout(() => {
                  setGrid(g => {
                    const updated = g.map(row => row.map(c => ({ ...c })))
                    if (updated[r] && updated[r][c] && updated[r][c].type === 'rock') {
                      updated[r][c].rockFalling = false
                    }
                    return updated
                  })
                }, 1500)

                // Check if player is hit (same column, rows below until wall)
                setPlayerPos(pos => {
                  if (pos.col === c && pos.row > r && pos.row < ROWS - 1) {
                    // Player is in the falling path!
                    setLives(l => {
                      const n = l - 1
                      if (n <= 0) setPhase('lost')
                      return n
                    })
                    setStreak(0)
                    setShakeWrong(true)
                    setTimeout(() => setShakeWrong(false), 500)
                  }
                  return pos
                })
              }
            }
          }
        }
        return next
      })
    }, TICK_MS)
    return () => { if (rockTickRef.current) clearInterval(rockTickRef.current) }
  }, [phase, levelComplete])

  // ─── Keyboard handler ───
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (phase === 'lost' || phase === 'won' || levelComplete) return

    // ─── Gate puzzle mode ───
    if (phase === 'gate-puzzle' && currentGate) {
      if (e.key === 'Escape') {
        // Cancel gate attempt — move player back
        setPhase('playing')
        setCurrentGate(null)
        setGateInput('')
        setGateFeedback(null)
        return
      }
      if (e.key >= '0' && e.key <= '9') {
        const newInput = gateInput + e.key
        setGateInput(newInput)
        return
      }
      if (e.key === 'Backspace') {
        setGateInput(prev => prev.slice(0, -1))
        return
      }
      if (e.key === 'Enter' && gateInput.length > 0) {
        const userAnswer = parseInt(gateInput, 10)
        if (userAnswer === currentGate.equation.answer) {
          // Correct!
          setGrid(prev => {
            const next = prev.map(row => row.map(cell => ({ ...cell })))
            next[currentGate.row][currentGate.col] = { type: 'floor' }
            return next
          })
          const newStreak = streak + 1
          setStreak(newStreak)
          if (newStreak > bestStreak) setBestStreak(newStreak)
          setScore(s => s + config.gateBonus * Math.min(newStreak, 5))
          setGatesSolved(g => g + 1)
          setGateFeedback('✅ Correct! Gate opened!')
          setFlashCorrect(true)
          setTimeout(() => setFlashCorrect(false), 600)
          setTimeout(() => {
            // Move player to where the gate was
            setPlayerPos({ row: currentGate.row, col: currentGate.col })
            setPhase('playing')
            setCurrentGate(null)
            setGateInput('')
            setGateFeedback(null)
          }, 600)
        } else {
          // Wrong!
          setStreak(0)
          setLives(l => {
            const n = l - 1
            if (n <= 0) setPhase('lost')
            return n
          })
          setGateFeedback(`❌ Wrong! The answer was ${currentGate.equation.answer}`)
          setShakeWrong(true)
          setTimeout(() => setShakeWrong(false), 500)
          setTimeout(() => {
            // Give the gate a new equation
            setGrid(prev => {
              const next = prev.map(row => row.map(cell => ({ ...cell })))
              next[currentGate.row][currentGate.col] = {
                type: 'gate',
                gateEquation: generateEquation(difficulty),
                gateOpen: false,
              }
              return next
            })
            setPhase('playing')
            setCurrentGate(null)
            setGateInput('')
            setGateFeedback(null)
          }, 1200)
        }
        return
      }
      return
    }

    // ─── Movement mode ───
    let dr = 0, dc = 0
    switch (e.key) {
      case 'ArrowUp': case 'w': case 'W': dr = -1; setLastDirection('up'); break
      case 'ArrowDown': case 's': case 'S': dr = 1; setLastDirection('down'); break
      case 'ArrowLeft': case 'a': case 'A': dc = -1; setLastDirection('left'); break
      case 'ArrowRight': case 'd': case 'D': dc = 1; setLastDirection('right'); break
      default: return
    }

    e.preventDefault()

    setPlayerPos(prev => {
      const nr = prev.row + dr
      const nc = prev.col + dc

      // Bounds check
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return prev

      const targetCell = grid[nr][nc]

      // Wall — can't pass
      if (targetCell.type === 'wall') return prev

      // Lava — lose a life, still move through
      if (targetCell.type === 'lava') {
        setLives(l => {
          const n = l - 1
          if (n <= 0) setPhase('lost')
          return n
        })
        setStreak(0)
        setShakeWrong(true)
        setTimeout(() => setShakeWrong(false), 500)
      }

      // Gate — enter puzzle mode
      if (targetCell.type === 'gate' && !targetCell.gateOpen && targetCell.gateEquation) {
        setCurrentGate({ row: nr, col: nc, equation: targetCell.gateEquation })
        setPhase('gate-puzzle')
        setGateInput('')
        setGateFeedback(null)
        return prev // Don't move onto gate yet
      }

      // Crystal — collect it
      if (targetCell.type === 'crystal' && !targetCell.crystalCollected) {
        setGrid(g => {
          const next = g.map(row => row.map(cell => ({ ...cell })))
          next[nr][nc] = { type: 'crystal', crystalCollected: true }
          return next
        })
        setScore(s => s + config.pointsPerCrystal)
        setCrystalsCollected(c => c + 1)
        setFlashCorrect(true)
        setTimeout(() => setFlashCorrect(false), 300)
      }

      // Falling rock — take damage
      if (targetCell.type === 'rock' && targetCell.rockFalling) {
        setLives(l => {
          const n = l - 1
          if (n <= 0) setPhase('lost')
          return n
        })
        setStreak(0)
        setShakeWrong(true)
        setTimeout(() => setShakeWrong(false), 500)
      }

      // Exit — check if all gates are solved first
      if (targetCell.type === 'exit') {
        // Count remaining unsolved gates
        const remainingGates = grid.flat().filter(c => c.type === 'gate' && !c.gateOpen).length
        if (remainingGates > 0) {
          // Can't exit yet — gates still locked
          setShakeWrong(true)
          setTimeout(() => setShakeWrong(false), 500)
          return prev // Block movement onto exit
        }

        // All gates solved — level complete!
        setLevelComplete(true)
        const timeBonus = timeLeft * config.timeBonusMultiplier
        const newStreak = streak + 1
        setStreak(newStreak)
        if (newStreak > bestStreak) setBestStreak(newStreak)
        setScore(s => s + timeBonus)

        setTimeout(() => {
          const next = levelNum + 1
          if (next >= config.levels) {
            setPhase('won')
          } else {
            setLevelNum(next)
            initLevel(next)
          }
        }, 1500)
      }

      setMoveCount(m => m + 1)
      return { row: nr, col: nc }
    })
  }, [phase, currentGate, gateInput, grid, streak, bestStreak, config, difficulty, levelNum, levelComplete, timeLeft, initLevel])

  // ─── Game Over ───
  if (phase === 'lost') {
    return (
      <section className="mx-auto max-w-2xl text-center py-10">
        <div className="text-7xl mb-6">💀</div>
        <h1 className="text-5xl font-black mb-2">Cave Collapsed!</h1>
        <p className="text-xl font-semibold text-muted-foreground mb-2">
          You reached depth {levelNum + 1} of {config.levels}
        </p>
        <div className="my-8 rounded-3xl border-4 border-foreground bg-gradient-to-br from-card to-card p-6 shadow-[0_8px_0_var(--foreground)]">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <Stat label="Score" value={score.toLocaleString()} icon={<Trophy className="size-5 text-primary" />} />
            <Stat label="Best Streak" value={`${bestStreak}x`} icon={<Flame className="size-5 text-orange-500" />} />
            <Stat label="Crystals" value={`${crystalsCollected}`} icon={<Gem className="size-5 text-purple-500" />} />
            <Stat label="Time" value={`${totalTime}s`} icon={<Clock className="size-5 text-blue-500" />} />
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button size="lg" variant="outline" onClick={onBack}>Back to Games</Button>
          <Button size="lg" onClick={() => onComplete(score, bestStreak, totalTime * 10)}>
            Save Score <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </section>
    )
  }

  // ─── Victory ───
  if (phase === 'won') {
    const finalScore = score + lives * 500 + bestStreak * 200 + gatesSolved * 100
    return (
      <section className="mx-auto max-w-2xl text-center py-10">
        <div className="text-7xl mb-6 animate-bounce">💎</div>
        <h1 className="text-5xl font-black mb-2">Cavern Conquered!</h1>
        <p className="text-xl font-semibold text-muted-foreground mb-2">You cleared all {config.levels} depths!</p>
        <div className="my-8 rounded-3xl border-4 border-foreground bg-gradient-to-br from-purple-50 to-violet-50 p-6 shadow-[0_8px_0_var(--foreground)]">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <Stat label="Base" value={score.toLocaleString()} icon={<Trophy className="size-5 text-primary" />} />
            <Stat label="Lives" value={`+${lives * 500}`} icon={<Heart className="size-5 text-red-500" />} />
            <Stat label="Streak" value={`+${bestStreak * 200}`} icon={<Flame className="size-5 text-orange-500" />} />
            <Stat label="Total" value={finalScore.toLocaleString()} icon={<Zap className="size-5 text-yellow-500" />} />
          </div>
        </div>
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
  const timePercent = level.timeLimit > 0 ? (timeLeft / level.timeLimit) * 100 : 0
  const timeBarColor = timeLeft > level.timeLimit * 0.5 ? 'bg-emerald-500' : timeLeft > level.timeLimit * 0.25 ? 'bg-orange-500' : 'bg-red-500 animate-pulse'
  const remainingGates = grid.flat().filter(c => c.type === 'gate' && !c.gateOpen).length
  const exitUnlocked = remainingGates === 0

  return (
    <section
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`flex w-full h-full flex-col gap-1.5 select-none outline-none overflow-hidden ${shakeWrong ? 'animate-[shake_0.4s_ease]' : ''}`}
    >
      {/* HUD */}
      <div className="flex items-center justify-between gap-2 flex-wrap shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: config.lives }).map((_, i) => (
              <Heart key={i} className={`size-4 transition-all duration-300 ${i < lives ? 'fill-red-500 text-red-500' : 'fill-none text-muted-foreground/30 scale-75'}`} />
            ))}
          </div>
          {streak > 1 && (
            <div className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-black text-orange-700">
              <Flame className="size-3" /> {streak}x streak!
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs font-black">
          <span className="rounded-full bg-purple-100 px-2 py-0.5 text-purple-800">Depth {level.depth}/{config.levels}</span>
          <span className="flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-violet-800"><Gem className="size-3" /> {crystalsCollected}</span>
          <span className={`rounded-full px-2 py-0.5 ${exitUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{exitUnlocked ? '🚪 Exit open' : `🔒 ${remainingGates} gate${remainingGates !== 1 ? 's' : ''}`}</span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">{score.toLocaleString()} pts</span>
        </div>
      </div>

      {/* Timer */}
      <div className="relative h-2 w-full overflow-hidden rounded-full border border-foreground bg-card shrink-0">
        <div className={`h-full transition-all duration-1000 ease-linear ${timeBarColor}`} style={{ width: `${timePercent}%` }} />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-black">{timeLeft}s</span>
      </div>

      {/* Level complete overlay */}
      {levelComplete && (
        <div className="text-center py-2 rounded-xl bg-purple-50 border-3 border-purple-400 shrink-0">
          <div className="text-2xl mb-1">✨</div>
          <p className="text-lg font-black text-purple-700">Depth Cleared!</p>
          <p className="text-xs font-bold text-purple-600">+{timeLeft * config.timeBonusMultiplier} time bonus</p>
        </div>
      )}

      {/* Main game area — fills remaining height */}
      <div className="flex-1 min-h-0 grid gap-2 xl:grid-cols-[minmax(0,1fr)_220px]">
        {/* ─── Game Grid ─── */}
        <div className={`relative overflow-hidden rounded-2xl border-4 border-foreground bg-gradient-to-b from-[#1a0a2e] via-[#16213e] to-[#0a0a1a] shadow-[0_6px_0_var(--foreground)] p-1.5 ${flashCorrect ? 'ring-4 ring-emerald-400/60' : ''}`}>
          {/* Ambient glow effects */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 w-32 h-32 bg-cyan-500/15 rounded-full blur-3xl" />

          <div
            className="grid gap-[2px] mx-auto h-full"
            style={{
              gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
              maxWidth: '100%',
            }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const isPlayer = playerPos.row === r && playerPos.col === c
                const isExit = level.exitPos.row === r && level.exitPos.col === c && cell.type === 'exit'
                return (
                  <div
                    key={`${r}-${c}`}
                    className={`relative flex items-center justify-center rounded-[3px] border text-[10px] sm:text-xs md:text-sm transition-all duration-150 ${tileBg(cell, isPlayer, isExit, exitUnlocked)} ${isPlayer ? 'z-20 scale-110' : 'z-10'}`}
                  >
                    <span className="pointer-events-none select-none leading-none">
                      {tileEmoji(cell, isPlayer, isExit, exitUnlocked)}
                    </span>
                    {isPlayer && (
                      <div className="absolute inset-0 rounded-[3px] bg-amber-300/30 animate-ping pointer-events-none" />
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* Gate puzzle overlay */}
          {phase === 'gate-puzzle' && currentGate && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-2xl">
              <div className={`relative rounded-2xl border-4 border-purple-400 bg-[#1a0a2e] p-6 text-center text-white shadow-[0_0_60px_rgba(168,85,247,0.4)] max-w-sm w-full mx-4 ${shakeWrong ? 'animate-[shake_0.4s_ease]' : ''}`}>
                <div className="text-3xl mb-2">🔒</div>
                <p className="text-xs font-black uppercase tracking-[.2em] text-purple-300 mb-1">Crystal Gate</p>
                <p className="text-sm font-bold text-purple-100 mb-4">Solve to open the gate!</p>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="grid size-12 place-items-center rounded-xl border-2 border-purple-400 bg-purple-900/50 text-2xl font-black shadow-lg">
                    {currentGate.equation.a}
                  </span>
                  <span className="text-2xl font-black text-purple-300">{currentGate.equation.op}</span>
                  <span className="grid size-12 place-items-center rounded-xl border-2 border-purple-400 bg-purple-900/50 text-2xl font-black shadow-lg">
                    {currentGate.equation.b}
                  </span>
                  <span className="text-2xl font-black text-purple-300">=</span>
                  <span className={`grid size-12 place-items-center rounded-xl border-2 text-2xl font-black shadow-lg ${gateInput ? 'border-amber-400 bg-amber-900/50 text-amber-200' : 'border-dashed border-purple-400 bg-purple-900/30 text-purple-400'}`}>
                    {gateInput || '?'}
                  </span>
                </div>

                <p className="text-[10px] font-bold text-purple-400 mb-1">Type answer → Enter to submit</p>
                <p className="text-[10px] text-purple-500">Esc to cancel • Backspace to delete</p>

                {gateFeedback && (
                  <div className={`mt-3 rounded-xl px-3 py-2 text-sm font-black animate-in fade-in zoom-in ${gateFeedback.startsWith('✅') ? 'bg-emerald-900/50 text-emerald-300' : 'bg-red-900/50 text-red-300'}`}>
                    {gateFeedback}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ─── Side Panel ─── */}
        <aside className="hidden xl:flex flex-col gap-2 rounded-2xl border-4 border-foreground bg-white p-3 shadow-[0_6px_0_var(--foreground)] overflow-y-auto">
          <div>
            <p className="text-[10px] font-black uppercase text-purple-600">Controls</p>
            <h3 className="text-sm font-black">How to play</h3>
          </div>

          <div className="rounded-xl bg-purple-50 p-2 text-xs font-bold space-y-1.5">
            <div className="flex items-center gap-1.5">
              <kbd className="grid size-6 place-items-center rounded border-2 border-foreground bg-card text-[10px] font-black shadow-[0_1px_0_var(--foreground)]">W</kbd>
              <kbd className="grid size-6 place-items-center rounded border-2 border-foreground bg-card text-[10px] font-black shadow-[0_1px_0_var(--foreground)]">A</kbd>
              <kbd className="grid size-6 place-items-center rounded border-2 border-foreground bg-card text-[10px] font-black shadow-[0_1px_0_var(--foreground)]">S</kbd>
              <kbd className="grid size-6 place-items-center rounded border-2 border-foreground bg-card text-[10px] font-black shadow-[0_1px_0_var(--foreground)]">D</kbd>
              <span className="text-[10px] text-muted-foreground">Move</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="grid h-6 min-w-[32px] place-items-center rounded border-2 border-foreground bg-card text-[10px] font-black shadow-[0_1px_0_var(--foreground)] px-1">0-9</kbd>
              <span className="text-[10px] text-muted-foreground">Type answer</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="grid h-6 min-w-[32px] place-items-center rounded border-2 border-foreground bg-card text-[10px] font-black shadow-[0_1px_0_var(--foreground)] px-1">Enter</kbd>
              <span className="text-[10px] text-muted-foreground">Submit</span>
            </div>
          </div>

          <div className="rounded-xl border-2 border-foreground bg-card p-2">
            <p className="text-[10px] font-black uppercase text-purple-600 mb-1">Legend</p>
            <div className="grid grid-cols-2 gap-1 text-[10px] font-bold">
              <span>⛏️ You</span>
              <span>💎 Crystal</span>
              <span>🔒 Gate</span>
              <span>🚪 Exit</span>
              <span>🪨 Wall/Rock</span>
              <span>🔥 Lava</span>
            </div>
          </div>

          <div className="rounded-xl border-2 border-foreground bg-card p-2">
            <p className="text-[10px] font-black uppercase text-purple-600 mb-0.5">Progress</p>
            <div className="space-y-0.5 text-[10px] font-bold text-muted-foreground">
              <p>💎 Crystals: {crystalsCollected}</p>
              <p>🔓 Gates: {gatesSolved}</p>
              <p>👣 Moves: {moveCount}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            className="mt-auto"
            size="sm"
            onClick={() => {
              setLevelNum(0)
              setLives(config.lives)
              setScore(0)
              setCrystalsCollected(0)
              setGatesSolved(0)
              setStreak(0)
              setBestStreak(0)
              setTotalTime(0)
              initLevel(0)
            }}
          >
            <RotateCcw data-icon="inline-start" /> Restart
          </Button>
        </aside>
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
