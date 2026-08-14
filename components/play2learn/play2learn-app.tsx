'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Award, BarChart3, BookOpen, Coins, Compass, LogIn, LogOut, Map, RotateCcw, Sparkles, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getExplorerLabel, useLanguage } from '@/components/i18n/language-context'
import { SkylineSignalGame } from './enhanced-activities'
import { CrystalCavernGame } from './crystal-cavern-game'
import { BasketBuilderGame } from './basket-builder-market-game'
import { GameSelector } from './game-selector'
import { GameComplete } from './game-complete'
import { StudentStats } from './student-stats'
import { Character, Logo, StorybookHero, WorldMap } from './scenes'
import { DEFAULT_PROGRESS, loadProgress, saveProgress, type Explorer, type Game, type Progress, type Screen } from '@/lib/play2learn'

const explorers: Explorer[] = ['Abel', 'Hana', 'Lulit']

export function Play2LearnApp() {
  const { language } = useLanguage()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [screen, setScreen] = useState<Screen>('welcome')
  const [progress, setProgress] = useState<Progress>(DEFAULT_PROGRESS)
  const [name, setName] = useState('')
  const [ready, setReady] = useState(false)
  const [currentGame, setCurrentGame] = useState<Game | null>(null)
  const [gameScore, setGameScore] = useState(0)
  const [gameCombo, setGameCombo] = useState(0)
  const [gameTime, setGameTime] = useState(0)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

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
      setScreen(currentGame === 'basket-builder' ? 'basket-builder' : currentGame === 'crystal-cavern' ? 'crystal-cavern' : 'pattern-finder')
    }
  }

  const resetEverything = () => {
    setProgress(DEFAULT_PROGRESS)
    setName('')
    setCurrentGame(null)
    setGameScore(0)
    setGameCombo(0)
    setGameTime(0)
    setScreen('profile')
  }

  // Pick background image based on current screen
  const bgImages: Record<string, string> = {
    welcome: '/background/entry-bg.png',
    world: '/background/map-bg.png',
    'basket-builder': '/background/stall-bg.png',
    'crystal-cavern': '/background/ambient-bg.png',
  }
  const bgImage = bgImages[screen] ?? '/background/ambient-bg.png'

  return (
    <>
      <Head>
        <link rel="preload" as="image" href="/background/entry-bg.png" />
        <link rel="preload" as="image" href="/background/map-bg.png" />
        <link rel="preload" as="image" href="/background/stall-bg.png" />
        <link rel="preload" as="image" href="/background/ambient-bg.png" />
      </Head>
      <main
        className="h-dvh overflow-hidden font-sans text-[#3B2F5E] flex flex-col relative selection:bg-[#FFC94D] selection:text-[#3B2F5E]"
        style={{ 
          backgroundImage: `url(${bgImage})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
        }}
      >

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-8 shrink-0 z-10">
        <button onClick={() => setScreen('welcome')} aria-label="Go to welcome" className="transition-transform hover:scale-105 active:scale-95">
          <Logo compact />
        </button>
        {screen !== 'welcome' && (
          <div className="flex items-center gap-2 rounded-full border-3 border-[#3B2F5E] bg-[#FDFBF7] px-4 py-2 text-sm font-black shadow-[0_4px_0_#3B2F5E] transition-transform hover:-translate-y-0.5">
            <Star className="size-5 fill-[#FFC94D] text-[#FFC94D] animate-[pulse_2s_ease-in-out_infinite]" aria-hidden="true" />
            <span className="text-[#3B2F5E] text-base">{progress.stars}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#3B2F5E] mx-1 opacity-20" />
            <Coins className="size-5 text-[#FF7A5C]" aria-hidden="true" />
            <span className="text-[#3B2F5E] text-base">{progress.coins}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#3B2F5E] mx-1 opacity-20" />
            <button onClick={() => setScreen('stats')} className="hover:scale-110 transition-transform" title="My Stats">
              <BarChart3 className="size-5 text-[#4FB6C9]" aria-hidden="true" />
            </button>
            <button onClick={() => signOut({ callbackUrl: '/login' })} className="hover:scale-110 transition-transform ml-1" title="Sign out">
              <LogOut className="size-4 text-[#3B2F5E]/50" aria-hidden="true" />
            </button>
          </div>
        )}
      </header>

      <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col items-center justify-center overflow-hidden px-4 pb-4 md:px-8 z-10">
        <div className="w-full h-full animate-in fade-in zoom-in-95 duration-500 ease-out flex flex-col justify-center">
          {screen === 'welcome' && (
            <Welcome
              returning={Boolean(progress.name)}
              onStart={() => setScreen(progress.name ? 'world' : 'profile')}
              onNew={() => {
                setProgress(DEFAULT_PROGRESS)
                setName('')
                setScreen('profile')
              }}
              onReset={resetEverything}
            />
          )}
          {screen === 'profile' && (
            <Profile
              name={name}
              setName={setName}
              onBack={() => setScreen('welcome')}
              onNext={() => {
                setProgress({ ...progress, name: name.trim() || (language === 'am' ? 'ተማሪ' : 'Explorer') })
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
              onGameSelect={(game) => {
                if (game === 'basket-builder' || game === 'pattern-finder' || game === 'crystal-cavern') {
                  setCurrentGame(game as Game)
                  setScreen(game === 'basket-builder' ? 'basket-builder' : game === 'crystal-cavern' ? 'crystal-cavern' : 'pattern-finder')
                } else {
                  setScreen('game-selector')
                }
              }}
              onDiscoveries={() => setScreen('discoveries')}
            />
          )}
          {screen === 'game-selector' && (
            <GameSelector
              onSelectGame={(game) => {
                setCurrentGame(game)
                setScreen(game === 'basket-builder' ? 'basket-builder' : game === 'crystal-cavern' ? 'crystal-cavern' : 'pattern-finder')
              }}
              onBack={goWorld}
              explorer={progress.explorer}
            />
          )}
          {screen === 'basket-builder' && (
            <div className="flex h-full w-full flex-col gap-2 overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
              <div className="flex items-center justify-between gap-3 shrink-0">
                <Button variant="ghost" onClick={() => setScreen('world')} className="text-[#3B2F5E] hover:bg-[#3B2F5E]/10">
                  <ArrowLeft data-icon="inline-start" />
                  {language === 'am' ? 'ተመለስ' : 'Back'}
                </Button>
                <span className="rounded-full border-2 border-[#3B2F5E] bg-[#FFC94D] px-4 py-1.5 text-sm font-black shadow-[0_2px_0_#3B2F5E]">
                  {language === 'am' ? 'የቅርጫት ጨዋታ' : 'Basket Builder'} · {language === 'am' ? 'ደረጃ' : 'Level'} {progress.gameState['basket-builder'].level}
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
                onBack={() => setScreen('world')}
              />
            </div>
          )}
          {screen === 'pattern-finder' && (
            <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-8 duration-500">
              <div className="flex items-center justify-between gap-3">
                <Button variant="ghost" onClick={() => setScreen('world')} className="text-[#3B2F5E] hover:bg-[#3B2F5E]/10">
                  <ArrowLeft data-icon="inline-start" />
                  {language === 'am' ? 'ተመለስ' : 'Back'}
                </Button>
                <span className="rounded-full border-2 border-[#3B2F5E] bg-[#FFC94D] px-4 py-2 text-sm font-black shadow-[0_2px_0_#3B2F5E]">
                  {language === 'am' ? 'ሰማይ ምልክት' : 'Skyline Signal'} · {language === 'am' ? 'ደረጃ' : 'Level'} {progress.gameState['pattern-finder'].level}
                </span>
              </div>
              <SkylineSignalGame
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
                onBack={() => setScreen('world')}
              />
            </div>
          )}
          {screen === 'crystal-cavern' && (
            <div className="flex h-full w-full flex-col gap-2 overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
              <div className="flex items-center justify-between gap-3 shrink-0">
                <Button variant="ghost" onClick={() => setScreen('world')} className="text-[#3B2F5E] hover:bg-[#3B2F5E]/10">
                  <ArrowLeft data-icon="inline-start" />
                  {language === 'am' ? 'ተመለስ' : 'Back'}
                </Button>
                <span className="rounded-full border-2 border-[#3B2F5E] bg-[#9B59B6] text-[#FDFBF7] px-4 py-1.5 text-sm font-black shadow-[0_2px_0_#3B2F5E]">
                  {language === 'am' ? 'ክሪስታል ዋሻ' : 'Crystal Cavern'} · {language === 'am' ? 'ደረጃ' : 'Level'} {progress.gameState['crystal-cavern'].level}
                </span>
              </div>
              <CrystalCavernGame
                difficulty={
                  progress.gameState['crystal-cavern'].level === 1
                    ? 'easy'
                    : progress.gameState['crystal-cavern'].level === 2
                      ? 'medium'
                      : progress.gameState['crystal-cavern'].level === 3
                        ? 'hard'
                        : 'expert'
                }
                onComplete={handleGameComplete}
                onBack={() => setScreen('world')}
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
          {screen === 'stats' && <StudentStats progress={progress} onBack={goWorld} />}
        </div>
      </div>
      </main>
    </>
  )
}

function Welcome({ returning, onStart, onNew, onReset }: { returning: boolean; onStart: () => void; onNew: () => void; onReset: () => void }) {
  const { language } = useLanguage()
  return (
    <section className="flex flex-col items-center justify-center gap-6 py-6 text-center max-w-3xl mx-auto">
      <span className="rounded-full border-3 border-[#3B2F5E] bg-[#FFC94D] px-4 py-2 text-sm font-black text-[#3B2F5E] shadow-[0_4px_0_#3B2F5E] animate-in fade-in slide-in-from-bottom-4">
        {language === 'am' ? 'ከእርስዎ ጋር የሚማር ዓለም' : 'A world that learns with you'}
      </span>
      <h1 className="text-balance text-4xl font-black leading-[.95] tracking-tight md:text-6xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 text-[#3B2F5E]">
        {language === 'am'
          ? 'በሀሳቦች ጨዋታ ይማሩ። መንገድዎን ያግኙ።'
          : <>Play with ideas. <span className="text-[#4FB6C9] relative inline-block">Discover<svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0,10 Q50,20 100,5" fill="none" stroke="#FFC94D" strokeWidth="6" strokeLinecap="round" /></svg></span> your way.</>}
      </h1>
      <p className="max-w-xl text-pretty text-base font-semibold leading-relaxed text-[#3B2F5E]/70 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        {language === 'am'
          ? 'የጉዞ ጓደኛ ይምረጡ፣ የጨዋታ ዓለማትን ይጎብኙ እና አስቸጋሪ ጥያቄዎችን ይፍቱ። ውጤት ግፊት የለም፣ ደስታ ብቻ ነው።'
          : 'Choose an explorer, visit the game worlds, and solve challenging puzzles. No grades. No race. Just curious thinking and fun!'}
      </p>
      <div className="flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 mt-2">
        <Button size="lg" onClick={onStart} className="bg-[#4FB6C9] hover:bg-[#3A9CAB] text-[#FDFBF7] border-3 border-[#3B2F5E] shadow-[0_6px_0_#3B2F5E] hover:shadow-[0_8px_0_#3B2F5E] hover:-translate-y-1 transition-all rounded-2xl h-14 px-8 text-lg">
          {returning ? <LogIn data-icon="inline-start" className="mr-2" /> : <Compass data-icon="inline-start" className="mr-2" />}
          {returning ? (language === 'am' ? 'ጉዞዬን ቀጥል' : 'Continue my journey') : (language === 'am' ? 'ጉዞ ጀምር' : 'Start exploring')}
          <ArrowRight data-icon="inline-end" className="ml-2" />
        </Button>
        {returning && (
          <>
            <Button size="lg" variant="outline" onClick={onNew} className="border-3 border-[#3B2F5E] text-[#3B2F5E] hover:bg-[#FDFBF7]/80 shadow-[0_6px_0_#3B2F5E] hover:-translate-y-1 transition-all rounded-2xl h-14">
              {language === 'am' ? 'አዲስ ጉዞ' : 'New journey'}
            </Button>
            <Button size="lg" variant="destructive" onClick={onReset} className="border-3 border-[#3B2F5E] bg-[#FF7A5C] hover:bg-[#E65C3D] text-[#FDFBF7] shadow-[0_6px_0_#3B2F5E] hover:-translate-y-1 transition-all rounded-2xl h-14">
              <RotateCcw data-icon="inline-start" className="mr-2" />
              {language === 'am' ? 'ሁሉንም እንደገና ጀምር' : 'Reset everything'}
            </Button>
          </>
        )}
      </div>
    </section>
  )
}

function Profile({ name, setName, onBack, onNext }: { name: string; setName: (value: string) => void; onBack: () => void; onNext: () => void }) {
  const { language } = useLanguage()
  return (
    <Panel icon={<BookOpen className="text-[#4FB6C9]" />} eyebrow={language === 'am' ? 'መጀመሪያ የተማሪ መለያ' : 'First, your explorer card'} title={language === 'am' ? 'ምን ብለን እንጠራዎት?' : 'What should we call you?'}>
      <label htmlFor="name" className="font-black text-[#3B2F5E]">
        {language === 'am' ? 'የተማሪ ስም' : 'Explorer name'}
      </label>
      <input
        id="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229 && name.trim())
            onNext()
        }}
        placeholder={language === 'am' ? 'ስምዎን ያስገቡ' : 'Type your name'}
        className="h-16 rounded-2xl border-4 border-[#3B2F5E] bg-[#FDFBF7] px-5 text-xl font-bold text-[#3B2F5E] outline-none transition-all placeholder:text-[#3B2F5E]/30 focus:ring-4 focus:ring-[#FFC94D] focus:border-[#4FB6C9] shadow-inner"
      />
      <Nav back={onBack} next={onNext} disabled={!name.trim()} />
    </Panel>
  )
}

function ExplorerPicker({ selected, onSelect, onBack, onNext }: { selected: Explorer; onSelect: (value: Explorer) => void; onBack: () => void; onNext: () => void }) {
  const { language } = useLanguage()
  return (
    <Panel icon={<Compass className="text-[#FF7A5C]" />} eyebrow={language === 'am' ? 'የጉዞ ጓደኛ ይምረጡ' : 'Choose a travel buddy'} title={language === 'am' ? 'ከእርስዎ ጋር ማን ይጓዛል?' : 'Who will explore with you?'}>
      <div className="grid grid-cols-3 gap-4">
        {explorers.map((explorer) => (
          <button
            key={explorer}
            onClick={() => onSelect(explorer)}
            aria-pressed={selected === explorer}
            className={`rounded-[2rem] border-4 border-[#3B2F5E] bg-[#FDFBF7] p-4 shadow-[0_6px_0_#3B2F5E] transition-all duration-300 flex flex-col items-center gap-3 ${selected === explorer
                ? 'bg-[#FFC94D]/20 ring-4 ring-[#FFC94D] -translate-y-2 shadow-[0_10px_0_#3B2F5E]'
                : 'hover:-translate-y-1 hover:shadow-[0_8px_0_#3B2F5E]'
              }`}
          >
            <Character explorer={explorer} className="w-full aspect-square h-auto" />
            <span className="font-black text-xl text-[#3B2F5E]">{getExplorerLabel(explorer, language)}</span>
          </button>
        ))}
      </div>
      <Nav back={onBack} next={onNext} />
    </Panel>
  )
}

function Orientation({ explorer, name, onNext }: { explorer: Explorer; name: string; onNext: () => void }) {
  const { language } = useLanguage()
  return (
    <section className="mx-auto max-w-3xl text-center flex flex-col items-center gap-6">
      <Character explorer={explorer} className="mb-4" />
      <div className="rounded-[2.5rem] border-4 border-[#3B2F5E] bg-[#FDFBF7] p-8 md:p-10 shadow-[0_12px_0_#3B2F5E] animate-in fade-in zoom-in-95 duration-500 relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#FDFBF7] border-l-4 border-t-4 border-[#3B2F5E] rotate-45" />
        <p className="text-3xl md:text-4xl font-black text-[#3B2F5E]">{language === 'am' ? `"ሰላም ${name}! እኔ ${getExplorerLabel(explorer, language)} ነኝ።"` : `"Hi ${name}! I'm ${explorer}."`}</p>
        <p className="mt-4 text-xl font-semibold leading-relaxed text-[#3B2F5E]/70 max-w-xl mx-auto">
          {language === 'am'
            ? 'ዓለማችን ብዙ የጨዋታ ዓለማት አሉት። እያንዳንዱ በመዝናኛ ፈተናዎች የሒሳብ እውቀት ያስተምራል። ደረጃዎችን ይሞክሩ እና አዲስ ጨዋታዎችን ይክፈቱ።'
            : 'Our world has multiple game worlds waiting for you. Each one teaches different mathematical concepts through fun challenges. Try levels, improve your skills, and unlock new games!'}
        </p>
        <Button className="mt-8 bg-[#4FB6C9] hover:bg-[#3A9CAB] text-[#FDFBF7] border-3 border-[#3B2F5E] shadow-[0_6px_0_#3B2F5E] hover:shadow-[0_8px_0_#3B2F5E] hover:-translate-y-1 transition-all rounded-2xl h-14 px-8 text-lg" size="lg" onClick={onNext}>
          {language === 'am' ? 'ወደ ጨዋታ ዓለማት ግባ' : 'Enter the Game Worlds'}
          <Map data-icon="inline-end" className="ml-2" />
        </Button>
      </div>
    </section>
  )
}

function World({ progress, onGameSelect, onDiscoveries }: { progress: Progress; onGameSelect: (game?: string) => void; onDiscoveries: () => void }) {
  const { language } = useLanguage()
  return (
    <section className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-end justify-between gap-4 bg-[#FDFBF7]/90 backdrop-blur-sm border-3 border-[#3B2F5E] rounded-2xl p-4 shadow-[0_6px_0_#3B2F5E]">
        <div>
          <p className="font-bold text-[#FF7A5C] uppercase tracking-wider text-xs">{language === 'am' ? `እንኳን ደህና መጡ፣ ${progress.name}` : `Welcome back, ${progress.name}`}</p>
          <h1 className="text-2xl md:text-3xl font-black text-[#3B2F5E] mt-1">{language === 'am' ? 'ዛሬ የትኛውን ጨዋታ ይጫወታሉ?' : 'Which game will you play today?'}</h1>
        </div>
        <div className="flex gap-2">
          {progress.discoveries.length > 0 && (
            <Button variant="outline" onClick={onDiscoveries} className="border-3 border-[#3B2F5E] text-[#3B2F5E] bg-[#FFC94D] hover:bg-[#F5C047] shadow-[0_4px_0_#3B2F5E] hover:-translate-y-0.5 rounded-xl h-12">
              <Award data-icon="inline-start" className="mr-2" />
              {language === 'am' ? 'ስኬቶች' : 'Achievements'}
            </Button>
          )}
        </div>
      </div>
      <WorldMap onGameSelect={onGameSelect} />
    </section>
  )
}

function Discoveries({ progress, onBack }: { progress: Progress; onBack: () => void }) {
  const { language } = useLanguage()
  const achievements = [
    { id: 'basket-builder-1', title: 'Basket Master', description: 'Complete Basket Builder Level 1', unlocked: progress.gameState['basket-builder'].completed },
    { id: 'basket-builder-2', title: 'Division Expert', description: 'Reach Level 2 in Basket Builder', unlocked: progress.gameState['basket-builder'].level >= 2 },
    { id: 'high-score', title: 'High Score', description: 'Earn 500+ points in a single game', unlocked: progress.gameState['basket-builder'].totalScore >= 500 || progress.gameState['pattern-finder'].totalScore >= 500 },
    { id: 'combo-master', title: 'Combo Master', description: 'Achieve a 5+ combo streak', unlocked: progress.gameState['basket-builder'].bestCombo >= 5 || progress.gameState['pattern-finder'].bestCombo >= 5 },
    { id: 'speed-run', title: 'Lightning Fast', description: 'Complete a level in under 30 seconds', unlocked: progress.gameState['basket-builder'].bestTime > 0 && progress.gameState['basket-builder'].bestTime < 3000 },
    { id: 'star-collector', title: 'Star Collector', description: 'Earn 50 stars total', unlocked: progress.stars >= 50 },
    { id: 'crystal-cavern-1', title: 'Cave Explorer', description: 'Complete Crystal Cavern Level 1', unlocked: progress.gameState['crystal-cavern'].completed },
    { id: 'crystal-cavern-2', title: 'Deep Diver', description: 'Reach Level 2 in Crystal Cavern', unlocked: progress.gameState['crystal-cavern'].level >= 2 },
    { id: 'crystal-master', title: 'Crystal Master', description: 'Earn 500+ points in Crystal Cavern', unlocked: progress.gameState['crystal-cavern'].totalScore >= 500 },
  ]

  return (
    <section className="flex flex-col gap-6 h-full overflow-y-auto pb-10 px-2 pt-2">
      <div className="bg-[#FDFBF7] border-4 border-[#3B2F5E] rounded-3xl p-6 shadow-[0_8px_0_#3B2F5E] flex justify-between items-center">
        <div>
          <p className="font-bold text-[#FF7A5C] uppercase tracking-wider text-sm">Growing with every try</p>
          <h1 className="text-3xl md:text-4xl font-black text-[#3B2F5E] mt-1">{language === 'am' ? 'የእርስዎ ስኬቶች' : 'Your achievements'}</h1>
        </div>
        <Button className="self-start border-3 border-[#3B2F5E] text-[#3B2F5E] bg-transparent hover:bg-[#3B2F5E]/5 shadow-[0_4px_0_#3B2F5E] rounded-xl h-12" size="lg" onClick={onBack}>
          <ArrowLeft data-icon="inline-start" className="mr-2" />
          {language === 'am' ? 'ወደ ዓለም ተመለስ' : 'Back to world'}
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => (
          <article
            key={achievement.id}
            className={`rounded-3xl border-4 border-[#3B2F5E] p-6 transition-all duration-300 flex flex-col ${achievement.unlocked
                ? 'bg-[#FDFBF7] shadow-[0_6px_0_#3B2F5E] hover:-translate-y-1 hover:shadow-[0_8px_0_#3B2F5E]'
                : 'bg-[#FDFBF7]/50 shadow-none opacity-60 grayscale-[0.5]'
              }`}
          >
            <div className={`mb-4 grid size-14 place-items-center rounded-2xl border-2 border-[#3B2F5E] ${achievement.unlocked ? 'bg-[#FFC94D]' : 'bg-[#EAD9C4]'}`}>
              <Award className={`size-7 ${achievement.unlocked ? 'text-[#3B2F5E]' : 'text-[#8A5A33]'}`} />
            </div>
            <h2 className={`text-2xl font-black ${achievement.unlocked ? 'text-[#3B2F5E]' : 'text-[#8A5A33]'}`}>{achievement.title}</h2>
            <p className={`mt-2 font-semibold leading-relaxed flex-1 ${achievement.unlocked ? 'text-[#3B2F5E]/70' : 'text-[#8A5A33]/70'}`}>{achievement.description}</p>
            {achievement.unlocked && <div className="mt-4 text-sm font-black text-[#6FBF73] flex items-center gap-1"><Sparkles className="size-4" /> UNLOCKED</div>}
          </article>
        ))}
      </div>

      <div className="mt-2 rounded-3xl border-4 border-[#3B2F5E] bg-[#4FB6C9] p-6 shadow-[0_8px_0_#3B2F5E] flex justify-center">
        <p className="font-bold text-[#FDFBF7] text-xl flex items-center gap-4">
          <span className="flex items-center gap-2"><Star className="fill-[#FFC94D] text-[#FFC94D] size-8" /> <span className="text-3xl font-black">{progress.stars}</span> Stars</span>
          <span className="opacity-50 text-2xl">•</span>
          <span className="flex items-center gap-2"><Coins className="text-[#FFC94D] fill-[#FFC94D] size-8" /> <span className="text-3xl font-black">{progress.coins}</span> Coins</span>
        </p>
      </div>
    </section>
  )
}

function Panel({ icon, eyebrow, title, children }: { icon: React.ReactNode; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-[3rem] border-4 border-[#3B2F5E] bg-[#FDFBF7] p-8 shadow-[0_16px_0_#3B2F5E] md:p-10 animate-in fade-in zoom-in-95 duration-500 relative">
      <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-[#FFC94D] opacity-20 blur-xl" />
      <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-[#4FB6C9] opacity-20 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-6">
        <div className="grid size-16 place-items-center rounded-[1.5rem] bg-[#FDFBF7] border-4 border-[#3B2F5E] shadow-[0_4px_0_#3B2F5E] mb-2">{icon}</div>
        <div>
          <p className="font-bold text-[#FF7A5C] uppercase tracking-wider text-sm mb-1">{eyebrow}</p>
          <h1 className="text-balance text-4xl font-black text-[#3B2F5E] leading-[1.1]">{title}</h1>
        </div>
        {children}
      </div>
    </section>
  )
}

function Nav({ back, next, disabled = false }: { back: () => void; next: () => void; disabled?: boolean }) {
  const { language } = useLanguage()
  return (
    <div className="flex justify-between gap-4 mt-2">
      <Button variant="outline" size="lg" onClick={back} className="border-3 border-[#3B2F5E] text-[#3B2F5E] hover:bg-[#3B2F5E]/5 shadow-[0_4px_0_#3B2F5E] hover:-translate-y-0.5 rounded-2xl h-14 px-6">
        <ArrowLeft data-icon="inline-start" className="mr-2" />
        {language === 'am' ? 'ተመለስ' : 'Back'}
      </Button>
      <Button size="lg" onClick={next} disabled={disabled} className="bg-[#6FBF73] hover:bg-[#5AA65E] text-[#FDFBF7] border-3 border-[#3B2F5E] shadow-[0_4px_0_#3B2F5E] hover:shadow-[0_6px_0_#3B2F5E] hover:-translate-y-0.5 transition-all rounded-2xl h-14 px-8 text-lg disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none disabled:translate-y-0 disabled:bg-[#C9E585]">
        {language === 'am' ? 'ቀጥል' : 'Continue'}
        <ArrowRight data-icon="inline-end" className="ml-2" />
      </Button>
    </div>
  )
}
