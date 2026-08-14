export type Screen = 'welcome' | 'profile' | 'explorer' | 'orientation' | 'world' | 'game-selector' | 'basket-builder' | 'pattern-finder' | 'crystal-cavern' | 'game-complete' | 'discoveries' | 'stats'
export type Game = 'basket-builder' | 'pattern-finder' | 'crystal-cavern'

export type Explorer = 'Abel' | 'Hana' | 'Lulit'
export type EventKind = 'place' | 'undo' | 'hint' | 'complete' | 'arrangement' | 'time-bonus' | 'combo' | 'error'
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

export type LearningEvent = {
  kind: EventKind
  at: number
  value?: number
}

export type Progress = {
  name: string
  explorer: Explorer
  coins: number
  stars: number
  gameState: {
    'basket-builder': {
      completed: boolean
      bestTime: number
      bestCombo: number
      level: number
      totalScore: number
    }
    'pattern-finder': {
      completed: boolean
      bestTime: number
      bestCombo: number
      level: number
      totalScore: number
    }
    'crystal-cavern': {
      completed: boolean
      bestTime: number
      bestCombo: number
      level: number
      totalScore: number
    }
  }
  discoveries: string[]
  lastGame?: Game
}

export const DEFAULT_PROGRESS: Progress = {
  name: '',
  explorer: 'Abel',
  coins: 0,
  stars: 0,
  gameState: {
    'basket-builder': {
      completed: false,
      bestTime: 0,
      bestCombo: 0,
      level: 1,
      totalScore: 0,
    },
    'pattern-finder': {
      completed: false,
      bestTime: 0,
      bestCombo: 0,
      level: 1,
      totalScore: 0,
    },
    'crystal-cavern': {
      completed: false,
      bestTime: 0,
      bestCombo: 0,
      level: 1,
      totalScore: 0,
    },
  },
  discoveries: [],
}

export function calculateDifficulty(level: number): Difficulty {
  if (level === 1) return 'easy'
  if (level === 2) return 'medium'
  if (level === 3) return 'hard'
  return 'expert'
}

export function calculateScore(time: number, hints: number, errors: number, combo: number): number {
  const baseScore = Math.max(100 - Math.floor(time / 100), 10)
  const hintPenalty = hints * 10
  const errorPenalty = errors * 5
  const comboBonus = combo * 50
  return Math.max(baseScore - hintPenalty - errorPenalty + comboBonus, 0)
}

export function getDifficultyConfig(difficulty: Difficulty) {
  const configs = {
    easy: { baskets: 3, perBasket: 4, timeLimit: 120, comboThreshold: 5 },
    medium: { baskets: 4, perBasket: 5, timeLimit: 90, comboThreshold: 3 },
    hard: { baskets: 5, perBasket: 6, timeLimit: 60, comboThreshold: 2 },
    expert: { baskets: 6, perBasket: 8, timeLimit: 45, comboThreshold: 1 },
  }
  return configs[difficulty]
}

export function loadProgress(): Progress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS
  try {
    const saved = window.localStorage.getItem('play2learn-progress')
    if (!saved) return DEFAULT_PROGRESS
    const parsed = JSON.parse(saved)

    const explorerAlias: Record<string, Explorer> = {
      Milo: 'Abel',
      Nia: 'Hana',
      Pip: 'Lulit',
      Abel: 'Abel',
      Hana: 'Hana',
      Lulit: 'Lulit',
    }

    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      explorer: explorerAlias[String(parsed.explorer)] ?? DEFAULT_PROGRESS.explorer,
      gameState: {
        ...DEFAULT_PROGRESS.gameState,
        ...(parsed.gameState ?? {}),
      },
    }
  } catch {
    return DEFAULT_PROGRESS
  }
}

export function saveProgress(progress: Progress) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('play2learn-progress', JSON.stringify(progress))
  }
}
