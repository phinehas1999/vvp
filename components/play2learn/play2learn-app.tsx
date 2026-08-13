'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Award, BookOpen, Check, Coins, Compass, Eye, LogIn, Map, ShoppingBasket, Sparkles, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GroupingActivity, OpenChallenge } from './activities'
import { Character, Logo, MarketArtwork, StorybookHero, WorldMap } from './scenes'
import { adaptiveMode, DEFAULT_PROGRESS, loadProgress, saveProgress, type Explorer, type LearningEvent, type Progress, type Screen } from '@/lib/play2learn'

const explorers: Explorer[] = ['Milo', 'Nia', 'Pip']

export function Play2LearnApp() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [progress, setProgress] = useState<Progress>(DEFAULT_PROGRESS)
  const [events, setEvents] = useState<LearningEvent[]>([])
  const [name, setName] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => { const saved = loadProgress(); setProgress(saved); setName(saved.name); setReady(true) }, [])
  useEffect(() => { if (ready) saveProgress(progress) }, [progress, ready])

  const record = (event: LearningEvent) => setEvents((current) => [...current, event])
  const goWorld = () => setScreen('world')
  const finish = () => {
    const next = { ...progress, coins: progress.coins + 30, stars: progress.stars + 3, marketComplete: true, workshopUnlocked: true, arrangements: events.filter((event) => event.kind === 'arrangement').map((event) => event.value ?? 0), discoveries: ['Pattern Finder', 'Curious Explorer', 'Number Connector'] }
    setProgress(next)
    setScreen('celebrate')
  }

  return (
    <main className="min-h-dvh overflow-hidden bg-background font-sans text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <button onClick={() => setScreen('welcome')} aria-label="Go to welcome"><Logo compact /></button>
        {screen !== 'welcome' && <div className="flex items-center gap-2 rounded-full border-2 border-foreground bg-card px-3 py-2 text-sm font-black shadow-[0_3px_0_var(--foreground)]"><Star className="size-4 fill-primary text-primary" aria-hidden="true" />{progress.stars}<Coins className="ml-2 size-4 text-accent" aria-hidden="true" />{progress.coins}</div>}
      </header>

      <div className="mx-auto flex min-h-[calc(100dvh-80px)] max-w-6xl flex-col justify-center px-4 pb-10 md:px-8">
        {screen === 'welcome' && <Welcome returning={Boolean(progress.name)} onStart={() => setScreen(progress.name ? 'world' : 'profile')} onNew={() => { setProgress(DEFAULT_PROGRESS); setName(''); setScreen('profile') }} />}
        {screen === 'profile' && <Profile name={name} setName={setName} onBack={() => setScreen('welcome')} onNext={() => { setProgress({ ...progress, name: name.trim() || 'Explorer' }); setScreen('explorer') }} />}
        {screen === 'explorer' && <ExplorerPicker selected={progress.explorer} onSelect={(explorer) => setProgress({ ...progress, explorer })} onBack={() => setScreen('profile')} onNext={() => setScreen('orientation')} />}
        {screen === 'orientation' && <Orientation explorer={progress.explorer} name={progress.name} onNext={goWorld} />}
        {screen === 'world' && <World progress={progress} onMarket={() => setScreen('market')} onDiscoveries={() => setScreen('discoveries')} />}
        {screen === 'market' && <Market explorer={progress.explorer} onBack={goWorld} onStart={() => { setEvents([]); setScreen('apple') }} />}
        {screen === 'apple' && <ActivityShell step="1 of 4" onBack={() => setScreen('market')}><GroupingActivity type="apple" baskets={3} perBasket={4} onEvent={record} onComplete={() => setScreen('discovery')} /></ActivityShell>}
        {screen === 'discovery' && <Discovery onNext={() => setScreen('orange')} />}
        {screen === 'orange' && <ActivityShell step="2 of 4" onBack={() => setScreen('discovery')}><GroupingActivity type="orange" baskets={5} perBasket={3} onEvent={record} onComplete={() => setScreen('open')} /></ActivityShell>}
        {screen === 'open' && <ActivityShell step="3 of 4" onBack={() => setScreen('orange')}><OpenChallenge onEvent={record} onComplete={() => setScreen('adaptive')} /></ActivityShell>}
        {screen === 'adaptive' && <Adaptive mode={adaptiveMode(events)} onEvent={record} onComplete={finish} />}
        {screen === 'celebrate' && <Celebrate explorer={progress.explorer} onWorld={goWorld} onDiscoveries={() => setScreen('discoveries')} />}
        {screen === 'discoveries' && <Discoveries progress={progress} onBack={goWorld} />}
      </div>
    </main>
  )
}

function Welcome({ returning, onStart, onNew }: { returning: boolean; onStart: () => void; onNew: () => void }) {
  return <section className="grid items-center gap-10 py-8 md:grid-cols-[1.1fr_.9fr]">
    <div className="flex flex-col items-start gap-6"><span className="rounded-full border-2 border-foreground bg-secondary px-4 py-2 text-sm font-black">A world that learns with you</span><h1 className="text-balance text-5xl font-black leading-[.95] tracking-tight md:text-7xl">Play with ideas. <span className="text-primary">Discover</span> your way.</h1><p className="max-w-xl text-pretty text-lg font-semibold leading-relaxed text-muted-foreground">Choose an explorer, visit lively places, and solve hands-on puzzles. No grades. No race. Just curious thinking.</p><div className="flex flex-wrap gap-3"><Button size="lg" onClick={onStart}>{returning ? <LogIn data-icon="inline-start" /> : <Compass data-icon="inline-start" />}{returning ? 'Continue my journey' : 'Start exploring'}<ArrowRight data-icon="inline-end" /></Button>{returning && <Button size="lg" variant="outline" onClick={onNew}>Start a new journey</Button>}</div></div>
    <StorybookHero />
  </section>
}

function Profile({ name, setName, onBack, onNext }: { name: string; setName: (value: string) => void; onBack: () => void; onNext: () => void }) {
  return <Panel icon={<BookOpen />} eyebrow="First, your explorer card" title="What should we call you?"><label htmlFor="name" className="font-black">Explorer name</label><input id="name" value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229 && name.trim()) onNext() }} placeholder="Type your name" className="h-14 rounded-2xl border-3 border-foreground bg-background px-4 text-lg font-bold outline-none focus:ring-4 focus:ring-ring" /><Nav back={onBack} next={onNext} disabled={!name.trim()} /></Panel>
}

function ExplorerPicker({ selected, onSelect, onBack, onNext }: { selected: Explorer; onSelect: (value: Explorer) => void; onBack: () => void; onNext: () => void }) {
  return <Panel icon={<Compass />} eyebrow="Choose a travel buddy" title="Who will explore with you?"><div className="grid grid-cols-3 gap-3">{explorers.map((explorer) => <button key={explorer} onClick={() => onSelect(explorer)} aria-pressed={selected === explorer} className="rounded-3xl border-4 border-foreground bg-card p-3 shadow-[0_5px_0_var(--foreground)] transition-transform hover:-translate-y-1 aria-pressed:bg-secondary aria-pressed:ring-4 aria-pressed:ring-ring"><Character explorer={explorer} /><span className="font-black">{explorer}</span></button>)}</div><Nav back={onBack} next={onNext} /></Panel>
}

function Orientation({ explorer, name, onNext }: { explorer: Explorer; name: string; onNext: () => void }) {
  return <section className="mx-auto max-w-3xl text-center"><Character explorer={explorer} className="scale-125" /><div className="mt-5 rounded-[2rem] border-4 border-foreground bg-card p-7 shadow-[0_8px_0_var(--foreground)]"><p className="text-2xl font-black">“Hi {name}! I&apos;m {explorer}.”</p><p className="mt-3 text-lg font-semibold leading-relaxed text-muted-foreground">Our world is full of places that need clever helpers. Try things, change your mind, and follow the patterns you notice.</p><Button className="mt-6" size="lg" onClick={onNext}>Open the map<Map data-icon="inline-end" /></Button></div></section>
}

function World({ progress, onMarket, onDiscoveries }: { progress: Progress; onMarket: () => void; onDiscoveries: () => void }) {
  return <section className="flex flex-col gap-5"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-bold text-muted-foreground">Welcome back, {progress.name}</p><h1 className="text-4xl font-black">Where will curiosity lead?</h1></div>{progress.discoveries.length > 0 && <Button variant="outline" onClick={onDiscoveries}><Award data-icon="inline-start" />Your discoveries</Button>}</div><WorldMap completed={progress.marketComplete} onMarket={onMarket} onWorkshop={() => {}} /></section>
}

function Market({ explorer, onBack, onStart }: { explorer: Explorer; onBack: () => void; onStart: () => void }) {
  return <section className="grid items-center gap-8 md:grid-cols-[1.2fr_.8fr]"><MarketArtwork /><div className="relative rounded-[2.5rem] border-4 border-foreground bg-card p-7 shadow-[0_10px_0_var(--foreground)]"><Character explorer={explorer} className="-mt-28 mb-2" /><p className="font-bold text-primary">The bustling market</p><h1 className="text-4xl font-black md:text-5xl">Basket Builder</h1><p className="mt-4 text-lg font-semibold leading-relaxed text-muted-foreground">The fruit seller has baskets to fill. Move fruit into equal groups, spot what stays the same, and discover more than one way to build a total.</p><div className="mt-7 flex flex-wrap gap-3"><Button variant="outline" size="lg" onClick={onBack}><ArrowLeft data-icon="inline-start" />Map</Button><Button size="lg" onClick={onStart}>Help the seller<ShoppingBasket data-icon="inline-end" /></Button></div></div></section>
}

function ActivityShell({ children, step, onBack }: { children: React.ReactNode; step: string; onBack: () => void }) { return <div className="flex flex-col gap-6"><div className="flex items-center justify-between gap-3"><Button variant="ghost" onClick={onBack}><ArrowLeft data-icon="inline-start" />Back</Button><span className="rounded-full bg-muted px-4 py-2 text-sm font-black">Market path · {step}</span></div>{children}</div> }

function Discovery({ onNext }: { onNext: () => void }) { return <section className="mx-auto grid max-w-4xl overflow-hidden rounded-[2.5rem] border-4 border-foreground bg-card shadow-[0_10px_0_var(--foreground)] md:grid-cols-[.85fr_1.15fr]"><div className="relative min-h-72"><Image src="/play2learn/discovery-scene.png" alt="A sunlit treehouse discovery room filled with maps and curious objects" fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" /></div><div className="p-8 text-center"><Sparkles className="mx-auto size-12 text-accent" /><p className="mt-4 font-bold text-muted-foreground">You found a number connection</p><h2 className="mt-2 text-4xl font-black">3 groups of 4 make 12.</h2><div className="my-6 rounded-3xl bg-secondary p-5 text-3xl font-black">3 × 4 = 12</div><p className="font-semibold">Multiplication is a quick way to describe equal groups.</p><Button className="mt-6" size="lg" onClick={onNext}>Try it with oranges<ArrowRight data-icon="inline-end" /></Button></div></section> }

function Adaptive({ mode, onEvent, onComplete }: { mode: 'guided' | 'stretch'; onEvent: (event: LearningEvent) => void; onComplete: () => void }) { return <ActivityShell step="4 of 4" onBack={() => {}}>{mode === 'guided' ? <GroupingActivity type="apple" baskets={4} perBasket={2} onEvent={onEvent} onComplete={onComplete} /> : <section className="mx-auto max-w-3xl text-center"><Eye className="mx-auto size-12 text-primary" /><p className="mt-3 font-bold text-muted-foreground">A challenge chosen from your exploring</p><h2 className="text-balance text-4xl font-black">You found different ways to make 24. Can you name two arrangements that use the same apples?</h2><p className="mt-5 text-lg font-semibold">Think of the groups and the amount in each group. Say your ideas out loud, then continue when you&apos;re happy with them.</p><Button className="mt-7" size="lg" onClick={onComplete}>I found two ways<Check data-icon="inline-end" /></Button></section>}</ActivityShell> }

function Celebrate({ explorer, onWorld, onDiscoveries }: { explorer: Explorer; onWorld: () => void; onDiscoveries: () => void }) { return <section className="mx-auto max-w-3xl text-center"><div className="relative mx-auto h-44 w-80"><Image src="/play2learn/reward-celebration.png" alt="Golden stars, coins, and colorful celebration streamers" fill sizes="320px" className="object-contain motion-safe:animate-[bounce_2s_ease-in-out_infinite]" /></div><Character explorer={explorer} className="-mt-8" /><h1 className="mt-3 text-balance text-5xl font-black">The Market is shining!</h1><p className="mt-4 text-xl font-semibold text-muted-foreground">You earned 3 stars, 30 coins, and opened the Workshop by exploring equal groups.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Button size="lg" onClick={onDiscoveries}><Award data-icon="inline-start" />See discoveries</Button><Button size="lg" variant="outline" onClick={onWorld}>Return to world<Map data-icon="inline-end" /></Button></div></section> }

function Discoveries({ progress, onBack }: { progress: Progress; onBack: () => void }) { return <section className="flex flex-col gap-6"><div><p className="font-bold text-muted-foreground">Growing with every try</p><h1 className="text-4xl font-black">Your discoveries</h1></div><div className="grid gap-4 md:grid-cols-3">{progress.discoveries.map((item, i) => <article key={item} className="rounded-3xl border-4 border-foreground bg-card p-6 shadow-[0_6px_0_var(--foreground)]"><div className="mb-4 grid size-12 place-items-center rounded-2xl bg-secondary"><Award /></div><h2 className="text-xl font-black">{item}</h2><p className="mt-2 font-semibold leading-relaxed text-muted-foreground">{['You noticed how equal groups connect to multiplication.','You tried more than one way and kept exploring.','You connected group size, number of groups, and the total.'][i]}</p></article>)}</div><Button className="self-start" size="lg" onClick={onBack}><ArrowLeft data-icon="inline-start" />Back to the world</Button></section> }

function Panel({ icon, eyebrow, title, children }: { icon: React.ReactNode; eyebrow: string; title: string; children: React.ReactNode }) { return <section className="mx-auto flex w-full max-w-xl flex-col gap-5 rounded-[2.5rem] border-4 border-foreground bg-card p-6 shadow-[0_10px_0_var(--foreground)] md:p-9"><div className="grid size-12 place-items-center rounded-2xl bg-secondary">{icon}</div><div><p className="font-bold text-muted-foreground">{eyebrow}</p><h1 className="text-balance text-3xl font-black md:text-4xl">{title}</h1></div>{children}</section> }
function Nav({ back, next, disabled = false }: { back: () => void; next: () => void; disabled?: boolean }) { return <div className="flex justify-between gap-3"><Button variant="outline" size="lg" onClick={back}><ArrowLeft data-icon="inline-start" />Back</Button><Button size="lg" onClick={next} disabled={disabled}>Continue<ArrowRight data-icon="inline-end" /></Button></div> }
