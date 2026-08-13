'use client'

import Image from 'next/image'
import { ArrowLeft, ArrowRight, Gem, Sparkles, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Game } from '@/lib/play2learn'

export function GameSelector({ onSelectGame, onBack }: { onSelectGame: (game: Game) => void; onBack: () => void; explorer: string }) {
  return (
    <section className="flex flex-col gap-8">
      <div>
        <p className="font-bold text-muted-foreground">Choose your adventure</p>
        <h1 className="text-4xl font-black md:text-5xl">Which game will you play today?</h1>
        <p className="mt-3 text-lg font-semibold text-muted-foreground">Every game hides a little brain magic inside the fun.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <GameCard icon={<Zap className="size-5 text-primary" />} badge="BEGINNER" title="Basket Builder" description="Group fruits into equal baskets. Discover how to divide, organize, and make smart moves." tags={['Division', 'Grouping', 'Strategy']} button="Play Basket Builder" image={<div className="relative h-32 w-40 transition-transform duration-700 group-hover:scale-110"><Image src="/play2learn/activity-objects.png" alt="Fruit baskets illustration" fill sizes="160px" className="object-contain drop-shadow-lg" /></div>} onClick={() => onSelectGame('basket-builder')} tone="from-orange-200 to-amber-200" />
        <GameCard icon={<Sparkles className="size-5 text-primary" />} badge="NEW ADVENTURE" title="Skyline Signal" description="Pilot a signal glider through the city. Choose the next energy gate and keep your boost streak alive." tags={['Quick thinking', 'Number sense', 'Streaks']} button="Play Skyline Signal" image={<div className="flex items-end gap-3"><div className="grid size-14 place-items-center rounded-full border-4 border-foreground bg-yellow-300 text-2xl shadow-[0_5px_0_var(--foreground)]">⚡</div><div className="grid size-20 place-items-center rounded-[2rem] border-4 border-foreground bg-card text-4xl shadow-[0_6px_0_var(--foreground)] transition-transform group-hover:-translate-y-2">🛸</div><div className="grid size-14 place-items-center rounded-full border-4 border-foreground bg-cyan-300 text-2xl shadow-[0_5px_0_var(--foreground)]">✦</div></div>} onClick={() => onSelectGame('pattern-finder')} tone="from-violet-300 via-fuchsia-200 to-sky-200" />
        <GameCard icon={<Gem className="size-5 text-purple-600" />} badge="KEYBOARD GAME" title="Crystal Cavern" description="Navigate a glowing cavern with keyboard controls. Solve math gates, collect crystals, and dodge falling rocks!" tags={['Keyboard', 'Math', 'Reflexes']} button="Play Crystal Cavern" image={<div className="flex items-end gap-3"><div className="grid size-14 place-items-center rounded-full border-4 border-foreground bg-purple-300 text-2xl shadow-[0_5px_0_var(--foreground)]">💎</div><div className="grid size-20 place-items-center rounded-[2rem] border-4 border-foreground bg-card text-4xl shadow-[0_6px_0_var(--foreground)] transition-transform group-hover:-translate-y-2">⛏️</div><div className="grid size-14 place-items-center rounded-full border-4 border-foreground bg-amber-200 text-2xl shadow-[0_5px_0_var(--foreground)]">🪨</div></div>} onClick={() => onSelectGame('crystal-cavern')} tone="from-purple-300 via-violet-200 to-indigo-200" />
      </div>
      <Button variant="outline" size="lg" onClick={onBack} className="self-start"><ArrowLeft data-icon="inline-start" />Back to the world</Button>
    </section>
  )
}

function GameCard({ icon, badge, title, description, tags, button, image, onClick, tone }: { icon: React.ReactNode; badge: string; title: string; description: string; tags: string[]; button: string; image: React.ReactNode; onClick: () => void; tone: string }) {
  return <div className="group relative overflow-hidden rounded-3xl border-4 border-foreground bg-card shadow-[0_8px_0_var(--foreground)] transition-transform hover:-translate-y-1"><div className={`relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br ${tone}`}><div className="absolute inset-0 flex items-center justify-center">{image}</div><div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" /></div><div className="p-6"><div className="mb-3 flex items-center gap-2"><div className="grid size-10 place-items-center rounded-xl bg-secondary">{icon}</div><span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-black text-primary">{badge}</span></div><h2 className="text-2xl font-black">{title}</h2><p className="mt-2 font-semibold text-muted-foreground">{description}</p><div className="mt-4 flex flex-wrap gap-2">{tags.map(tag => <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs font-bold">{tag}</span>)}</div><Button className="mt-6 w-full" onClick={onClick} size="lg">{button}<ArrowRight data-icon="inline-end" /></Button></div></div>
}
