export type Screen = 'welcome' | 'profile' | 'explorer' | 'orientation' | 'world' | 'market' | 'apple' | 'discovery' | 'orange' | 'open' | 'adaptive' | 'celebrate' | 'discoveries'

export type Explorer = 'Milo' | 'Nia' | 'Pip'
export type EventKind = 'place' | 'undo' | 'hint' | 'complete' | 'arrangement'

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
  marketComplete: boolean
  workshopUnlocked: boolean
  arrangements: number[]
  discoveries: string[]
}

export const DEFAULT_PROGRESS: Progress = {
  name: '',
  explorer: 'Milo',
  coins: 0,
  stars: 0,
  marketComplete: false,
  workshopUnlocked: false,
  arrangements: [],
  discoveries: [],
}

export function adaptiveMode(events: LearningEvent[]) {
  const hints = events.filter((event) => event.kind === 'hint').length
  const undos = events.filter((event) => event.kind === 'undo').length
  const arrangements = events.filter((event) => event.kind === 'arrangement').length
  return hints + undos >= 3 || arrangements === 0 ? 'guided' : 'stretch'
}

export function loadProgress(): Progress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS
  try {
    const saved = window.localStorage.getItem('play2learn-progress')
    return saved ? { ...DEFAULT_PROGRESS, ...JSON.parse(saved) } : DEFAULT_PROGRESS
  } catch {
    return DEFAULT_PROGRESS
  }
}

export function saveProgress(progress: Progress) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('play2learn-progress', JSON.stringify(progress))
  }
}
