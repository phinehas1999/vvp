'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Award, BookOpen, Coins, Compass, LogIn, Map, Sparkles, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BasketBuilderGame, PatternFinderGameBoilerplate } from './enhanced-activities'
import { GameSelector } from './game-selector'
import { GameComplete } from './game-complete'
import { Character, Logo, StorybookHero, WorldMap } from './scenes'
import { DEFAULT_PROGRESS, loadProgress, saveProgress, type Explorer, type Game, type Progress, type Screen } from '@/lib/play2learn'

const explorers: Explorer[] = ['Milo', 'Nia', 'Pip']

export function Play2LearnApp() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [progress, setProgress] = useState<Progress>(DEFAULT_PROGRESS)
  const [name, setName] = useState('')
  const [ready, setReady] = useState(false)
  const [currentGame, setCurrentGame] = useState<Game | null>(null)
  const [gameScore, setGameScore] = useState(0)
  const [gameCombo, setGameCombo] = useState(0)
  const [gameTime, setGameTime] = useState(0)

  useEffect(() => {
    const saved = loadProgress()
    setProgress(saved)
    setName(saved.name)
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) saveProgress(progress)
  }, [progress, ready])

  const goWorld = () => setScreen('world')

  const handleGameComplete = (score: number, combo: number, time: number) => {
    setGameScore(score)
    setGameCombo(combo)
    setGameTime(time)

    if (currentGame && progress.gameState[currentGame]) {
      const updatedProgress = { ...progress }
      updatedProgress.gameState[currentGame].totalScore += score
      updatedProgress.gameState[currentGame].completed = true
      if (combo > updatedProgress.gameState[currentGame].bestCombo) {
        updatedProgress.gameState[currentGame].bestCombo = combo
      }
      if (time < updatedProgress.gameState[currentGame].bestTime || updatedProgress.gameState[currentGame].bestTime === 0) {
        updatedProgress.gameState[currentGame].bestTime = time
      }
      updatedProgress.coins += score * 2
      updatedProgress.stars += Math.min(Math.floor(score / 50) + 1, 5)

      setProgress(updatedProgress)
    }

    setScreen('game-complete')
  }

  const goToHarderLevel = () => {
    if (currentGame && progress.gameState[currentGame]) {
      const updatedProgress = { ...progress }
      updatedProgress.gameState[currentGame].level += 1
      setProgress(updatedProgress)
      setScreen(currentGame === 'basket-builder' ? 'basket-builder' : 'pattern-finder')
    }
  }

  return (
    <main className="min-h-dvh overflow-hidden bg-background font-sans text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <button onClick={() => setScreen('welcome')} aria-label="Go to welcome">
          <Logo compact />
        </button>
        {screen !== 'welcome' && (
          <div className="flex items-center gap-2 rounded-full border-2 border-foreground bg-card px-3 py-2 text-sm font-black shadow-[0_3px_0_var(--foreground)]">
            <Star className="size-4 fill-primary text-primary" aria-hidden="true" />
            {progress.stars}
            <Coins className="ml-2 size-4 text-accent" aria-hidden="true" />
            {progress.coins}
          </div>
        )}
      </header>

      <div className="mx-auto flex min-h-[calc(100dvh-80px)] max-w-6xl flex-col justify-center px-4 pb-10 md:px-8">
        {screen === 'welcome' && (
          <Welcome
            returning={Boolean(progress.name)}
            onStart={() => setScreen(progress.name ? 'world' : 'profile')}
            onNew={() => {
              setProgress(DEFAULT_PROGRESS)
              setName('')
              setScreen('profile')
            }}
          />
        )}
        {screen === 'profile' && (
          <Profile
            name={name}
            setName={setName}
            onBack={() => setScreen('welcome')}
            onNext={() => {
              setProgress({ ...progress, name: name.trim() || 'Explorer' })
              setScreen('explorer')
            }}
          />
        )}
        {screen === 'explorer' && (
          <ExplorerPicker
            selected={progress.explorer}
            onSelect={(explorer) => setProgress({ ...progress, explorer })}
            onBack={() => setScreen('profile')}
            onNext={() => setScreen('orientation')}
          />
        )}
        {screen === 'orientation' && (
          <Orientation explorer={progress.explorer} name={progress.name} onNext={goWorld} />
        )}
        {screen === 'world' && (
          <World
            progress={progress}
            onGameSelect={() => setScreen('game-selector')}
            onDiscoveries={() => setScreen('discoveries')}
          />
        )}
        {screen === 'game-selector' && (
          <GameSelector
            onSelectGame={(game) => {
              setCurrentGame(game)
              setScreen(game === 'basket-builder' ? 'basket-builder' : 'pattern-finder')
            }}
            onBack={goWorld}
            explorer={progress.explorer}
          />
        )}
        {screen === 'basket-builder' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-3">
              <Button variant="ghost" onClick={() => setScreen('game-selector')}>
                <ArrowLeft data-icon="inline-start" />
                Back
              </Button>
              <span className="rounded-full bg-muted px-4 py-2 text-sm font-black">
                Basket Builder · Level {progress.gameState['basket-builder'].level}
              </span>
            </div>
            <BasketBuilderGame
              difficulty={
                progress.gameState['basket-builder'].level === 1
                  ? 'easy'
                  : progress.gameState['basket-builder'].level === 2
                    ? 'medium'
                    : progress.gameState['basket-builder'].level === 3
                      ? 'hard'
                      : 'expert'
              }
              onComplete={handleGameComplete}
              onBack={() => setScreen('game-selector')}
            />
          </div>
        )}
        {screen === 'pattern-finder' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-3">
              <Button variant="ghost" onClick={() => setScreen('game-selector')}>
                <ArrowLeft data-icon="inline-start" />
                Back
              </Button>
              <span className="rounded-full bg-muted px-4 py-2 text-sm font-black">
                Pattern Finder · Level {progress.gameState['pattern-finder'].level}
              </span>
            </div>
            <PatternFinderGameBoilerplate
              difficulty={
                progress.gameState['pattern-finder'].level === 1
                  ? 'easy'
                  : progress.gameState['pattern-finder'].level === 2
                    ? 'medium'
                    : progress.gameState['pattern-finder'].level === 3
                      ? 'hard'
                      : 'expert'
              }
              onComplete={handleGameComplete}
              onBack={() => setScreen('game-selector')}
            />
          </div>
        )}
        {screen === 'game-complete' && (
          <GameComplete
            explorer={progress.explorer}
            game={currentGame || 'basket-builder'}
            score={gameScore}
            combo={gameCombo}
            time={gameTime}
            onNextLevel={goToHarderLevel}
            onSelectGame={() => setScreen('game-selector')}
            onDiscoveries={() => setScreen('discoveries')}
          />
        )}
        {screen === 'discoveries' && <Discoveries progress={progress} onBack={goWorld} />}
      </div>
    </main>
  )
}

function Welcome({ returning, onStart, onNew }: { returning: boolean; onStart: () => void; onNew: () => void }) {
  return (
    <section className="grid items-center gap-10 py-8 md:grid-cols-[1.1fr_.9fr]">
      <div className="flex flex-col items-start gap-6">
        <span className="rounded-full border-2 border-foreground bg-secondary px-4 py-2 text-sm font-black animate-in fade-in slide-in-from-left-4">
          A world that learns with you
        </span>
        <h1 className="text-balance text-5xl font-black leading-[.95] tracking-tight md:text-7xl animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
          Play with ideas. <span className="text-primary">Discover</span> your way.
        </h1>
        <p className="max-w-xl text-pretty text-lg font-semibold leading-relaxed text-muted-foreground animate-in fade-in slide-in-from-left-4 duration-500 delay-200">
          Choose an explorer, visit the game worlds, and solve challenging puzzles. No grades. No race. Just curious thinking and fun!
        </p>
        <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
          <Button size="lg" onClick={onStart}>
            {returning ? <LogIn data-icon="inline-start" /> : <Compass data-icon="inline-start" />}
            {returning ? 'Continue my journey' : 'Start exploring'}
            <ArrowRight data-icon="inline-end" />
          </Button>
          {returning && (
            <Button size="lg" variant="outline" onClick={onNew}>
              Start a new journey
            </Button>
          )}
        </div>
      </div>
      <StorybookHero />
    </section>
  )
}

function Profile({ name, setName, onBack, onNext }: { name: string; setName: (value: string) => void; onBack: () => void; onNext: () => void }) {
  return (
    <Panel icon={<BookOpen />} eyebrow="First, your explorer card" title="What should we call you?">
      <label htmlFor="name" className="font-black">
        Explorer name
      </label>
      <input
        id="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229 && name.trim())
            onNext()
        }}
        placeholder="Type your name"
        className="h-14 rounded-2xl border-3 border-foreground bg-background px-4 text-lg font-bold outline-none focus:ring-4 focus:ring-ring"
      />
      <Nav back={onBack} next={onNext} disabled={!name.trim()} />
    </Panel>
  )
}

function ExplorerPicker({ selected, onSelect, onBack, onNext }: { selected: Explorer; onSelect: (value: Explorer) => void; onBack: () => void; onNext: () => void }) {
  return (
    <Panel icon={<Compass />} eyebrow="Choose a travel buddy" title="Who will explore with you?">
      <div className="grid grid-cols-3 gap-3">
        {explorers.map((explorer) => (
          <button
            key={explorer}
            onClick={() => onSelect(explorer)}
            aria-pressed={selected === explorer}
            className="rounded-3xl border-4 border-foreground bg-card p-3 shadow-[0_5px_0_var(--foreground)] transition-all hover:-translate-y-1 aria-pressed:bg-secondary aria-pressed:ring-4 aria-pressed:ring-ring hover:enabled:shadow-[0_8px_0_var(--foreground)]"
          >
            <Character explorer={explorer} />
            <span className="font-black">{explorer}</span>
          </button>
        ))}
      </div>
      <Nav back={onBack} next={onNext} />
    </Panel>
  )
}

function Orientation({ explorer, name, onNext }: { explorer: Explorer; name: string; onNext: () => void }) {
  return (
    <section className="mx-auto max-w-3xl text-center">
      <Character explorer={explorer} className="scale-125" />
      <div className="mt-5 rounded-[2rem] border-4 border-foreground bg-card p-7 shadow-[0_8px_0_var(--foreground)] animate-in fade-in scale-in duration-500">
        <p className="text-2xl font-black">"Hi {name}! I'm {explorer}."</p>
        <p className="mt-3 text-lg font-semibold leading-relaxed text-muted-foreground">
          Our world has multiple game worlds waiting for you. Each one teaches different mathematical concepts through fun challenges. Try levels, improve your skills, and unlock new games!
        </p>
        <Button className="mt-6" size="lg" onClick={onNext}>
          Enter the Game Worlds
          <Map data-icon="inline-end" />
        </Button>
      </div>
    </section>
  )
}

function World({ progress, onGameSelect, onDiscoveries }: { progress: Progress; onGameSelect: () => void; onDiscoveries: () => void }) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-bold text-muted-foreground">Welcome back, {progress.name}</p>
          <h1 className="text-4xl font-black">Which game will you play today?</h1>
        </div>
        {progress.discoveries.length > 0 && (
          <Button variant="outline" onClick={onDiscoveries}>
            <Award data-icon="inline-start" />
            Your achievements
          </Button>
        )}
      </div>
      <WorldMap onGameSelect={onGameSelect} />
    </section>
  )
}

function Market({ explorer, onBack, onStart }: { explorer: Explorer; onBack: () => void; onStart: () => void }) {
  return null
}

function ActivityShell({ children, step, onBack }: { children: React.ReactNode; step: string; onBack: () => void }) {
  return null
}

function Discovery({ onNext }: { onNext: () => void }) {
  return null
}

function Adaptive({ mode, onEvent, onComplete }: { mode: 'guided' | 'stretch'; onEvent?: any; onComplete: () => void }) {
  return null
}

function Celebrate({ explorer, onWorld, onDiscoveries }: { explorer: Explorer; onWorld: () => void; onDiscoveries: () => void }) {
  return null
}

function Discoveries({ progress, onBack }: { progress: Progress; onBack: () => void }) {
  const achievements = [
    { id: 'basket-builder-1', title: 'Basket Master', description: 'Complete Basket Builder Level 1', unlocked: progress.gameState['basket-builder'].completed },
    { id: 'basket-builder-2', title: 'Division Expert', description: 'Reach Level 2 in Basket Builder', unlocked: progress.gameState['basket-builder'].level >= 2 },
    { id: 'high-score', title: 'High Score', description: 'Earn 500+ points in a single game', unlocked: progress.gameState['basket-builder'].totalScore >= 500 || progress.gameState['pattern-finder'].totalScore >= 500 },
    { id: 'combo-master', title: 'Combo Master', description: 'Achieve a 5+ combo streak', unlocked: progress.gameState['basket-builder'].bestCombo >= 5 || progress.gameState['pattern-finder'].bestCombo >= 5 },
    { id: 'speed-run', title: 'Lightning Fast', description: 'Complete a level in under 30 seconds', unlocked: progress.gameState['basket-builder'].bestTime > 0 && progress.gameState['basket-builder'].bestTime < 3000 },
    { id: 'star-collector', title: 'Star Collector', description: 'Earn 50 stars total', unlocked: progress.stars >= 50 },
  ]

  return (
    <section className="flex flex-col gap-6">
      <div>
        <p className="font-bold text-muted-foreground">Growing with every try</p>
        <h1 className="text-4xl font-black">Your achievements</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => (
          <article
            key={achievement.id}
            className={`rounded-3xl border-4 border-foreground p-6 shadow-[0_6px_0_var(--foreground)] transition-all ${
              achievement.unlocked
                ? 'bg-card'
                : 'bg-muted/30 opacity-50'
            }`}
          >
            <div className={`mb-4 grid size-12 place-items-center rounded-2xl ${achievement.unlocked ? 'bg-secondary' : 'bg-muted'}`}>
              <Award className={achievement.unlocked ? 'text-primary' : 'text-muted-foreground'} />
            </div>
            <h2 className="text-xl font-black">{achievement.title}</h2>
            <p className="mt-2 font-semibold leading-relaxed text-muted-foreground">{achievement.description}</p>
            {achievement.unlocked && <div className="mt-3 text-xs font-black text-primary">✓ UNLOCKED</div>}
          </article>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border-3 border-foreground bg-secondary p-6">
        <p className="text-center font-bold">
          <span className="text-2xl font-black text-primary">{progress.stars}</span> Stars • <span className="text-2xl font-black text-accent">{progress.coins}</span> Coins
        </p>
      </div>
      <Button className="self-start" size="lg" onClick={onBack}>
        <ArrowLeft data-icon="inline-start" />
        Back to the world
      </Button>
    </section>
  )
}

function Panel({ icon, eyebrow, title, children }: { icon: React.ReactNode; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto flex w-full max-w-xl flex-col gap-5 rounded-[2.5rem] border-4 border-foreground bg-card p-6 shadow-[0_10px_0_var(--foreground)] md:p-9 animate-in fade-in scale-in duration-500">
      <div className="grid size-12 place-items-center rounded-2xl bg-secondary">{icon}</div>
      <div>
        <p className="font-bold text-muted-foreground">{eyebrow}</p>
        <h1 className="text-balance text-3xl font-black md:text-4xl">{title}</h1>
      </div>
      {children}
    </section>
  )
}

function Nav({ back, next, disabled = false }: { back: () => void; next: () => void; disabled?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <Button variant="outline" size="lg" onClick={back}>
        <ArrowLeft data-icon="inline-start" />
        Back
      </Button>
      <Button size="lg" onClick={next} disabled={disabled}>
        Continue
        <ArrowRight data-icon="inline-end" />
      </Button>
    </div>
  )
}
