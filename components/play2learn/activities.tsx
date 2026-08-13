'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ArrowRight, Lightbulb, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { LearningEvent } from '@/lib/play2learn'

function Fruit({ type, small = false }: { type: 'apple' | 'orange'; small?: boolean }) {
  return <span aria-hidden="true" className={`${small ? 'size-8' : 'size-12'} relative inline-block overflow-hidden rounded-full drop-shadow-md`}><Image src={`/play2learn/${type}.png`} alt="" fill sizes={small ? '32px' : '48px'} className="scale-125 object-cover" /></span>
}

export function GroupingActivity({ type, baskets, perBasket, onEvent, onComplete }: { type: 'apple' | 'orange'; baskets: number; perBasket: number; onEvent: (event: LearningEvent) => void; onComplete: () => void }) {
  const [counts, setCounts] = useState(() => Array(baskets).fill(0) as number[])
  const [hint, setHint] = useState(false)
  const total = counts.reduce((sum, count) => sum + count, 0)
  const target = baskets * perBasket
  const add = (index: number) => {
    if (counts[index] >= perBasket) return
    const next = counts.map((count, i) => i === index ? count + 1 : count)
    setCounts(next)
    onEvent({ kind: 'place', at: Date.now(), value: index })
  }
  const undo = () => {
    const index = counts.findLastIndex((count) => count > 0)
    if (index < 0) return
    setCounts(counts.map((count, i) => i === index ? count - 1 : count))
    onEvent({ kind: 'undo', at: Date.now() })
  }
  const finished = total === target
  return (
    <section className="flex flex-col gap-6" aria-labelledby="activity-title">
      <div className="text-center">
        <p className="font-bold text-muted-foreground">Market helper mission</p>
        <h2 id="activity-title" className="text-balance text-3xl font-black md:text-5xl">Put {perBasket} {type === 'apple' ? 'apples' : 'oranges'} in every basket.</h2>
        <p className="mt-2 text-lg font-semibold">Tap a basket to add one. You have placed {total} of {target}.</p>
      </div>
      <div className="rounded-[2rem] border-4 border-foreground bg-secondary p-4 shadow-[0_8px_0_var(--foreground)] md:p-8">
        <div className={`grid gap-4 ${baskets > 3 ? 'grid-cols-2 md:grid-cols-5' : 'grid-cols-3'}`}>
          {counts.map((count, index) => (
            <button key={index} onClick={() => add(index)} disabled={count === perBasket} aria-label={`Basket ${index + 1}, ${count} of ${perBasket} ${type}s`} className="relative flex min-h-40 flex-col items-center justify-end gap-3 overflow-hidden rounded-3xl border-3 border-foreground bg-card/95 p-3 shadow-[0_6px_0_var(--foreground)] transition-transform enabled:hover:-translate-y-1 active:translate-y-1 disabled:shadow-[0_3px_0_var(--foreground)] before:absolute before:inset-x-4 before:bottom-8 before:h-16 before:rounded-[50%] before:border-4 before:border-accent/50 before:bg-secondary">
              <span className="relative z-10 flex min-h-20 flex-wrap items-center justify-center gap-1">{Array.from({ length: count }).map((_, fruit) => <Fruit key={fruit} type={type} small={baskets > 3} />)}</span>
              <span className="relative z-10 rounded-full bg-card px-3 py-1 font-black shadow-sm">{count} / {perBasket}</span>
            </button>
          ))}
        </div>
      </div>
      {hint && <p className="rounded-2xl border-2 border-foreground bg-muted p-4 text-center font-bold">Try finishing one basket, then make every basket match it.</p>}
      <div className="flex flex-wrap justify-center gap-3">
        <Button size="lg" variant="outline" onClick={undo} disabled={total === 0}><RotateCcw data-icon="inline-start" />Undo</Button>
        <Button size="lg" variant="secondary" onClick={() => { setHint(true); onEvent({ kind: 'hint', at: Date.now() }) }}><Lightbulb data-icon="inline-start" />A little hint</Button>
        {finished && <Button size="lg" onClick={() => { onEvent({ kind: 'complete', at: Date.now() }); onComplete() }}>See what you found<ArrowRight data-icon="inline-end" /></Button>}
      </div>
    </section>
  )
}

export function OpenChallenge({ onEvent, onComplete }: { onEvent: (event: LearningEvent) => void; onComplete: () => void }) {
  const [groups, setGroups] = useState(4)
  const [found, setFound] = useState<number[]>([])
  const valid = 24 % groups === 0
  const discover = () => {
    if (!valid || found.includes(groups)) return
    const next = [...found, groups]
    setFound(next)
    onEvent({ kind: 'arrangement', at: Date.now(), value: groups })
  }
  return (
    <section className="flex flex-col gap-6 text-center">
      <div><p className="font-bold text-muted-foreground">Your idea, your way</p><h2 className="text-balance text-3xl font-black md:text-5xl">How many equal groups can 24 apples make?</h2></div>
      <div className="rounded-[2rem] border-4 border-foreground bg-secondary p-5 shadow-[0_8px_0_var(--foreground)]">
        <div className="mb-6 flex flex-wrap justify-center gap-2">{Array.from({ length: 24 }).map((_, i) => <Fruit key={i} type="apple" small />)}</div>
        <label htmlFor="groups" className="text-lg font-black">Choose the number of groups: <output className="text-primary">{groups}</output></label>
        <input id="groups" type="range" min="2" max="12" value={groups} onChange={(event) => setGroups(Number(event.target.value))} className="mt-4 w-full accent-[var(--primary)]" />
        <p className="mt-4 text-lg font-bold">{valid ? `${groups} equal groups with ${24 / groups} in each group.` : `${groups} groups would not be equal yet. Keep exploring.`}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button size="lg" onClick={discover} disabled={!valid || found.includes(groups)}>Save this discovery</Button>
        <Button size="lg" variant="outline" onClick={onComplete} disabled={found.length === 0}>I&apos;m ready for what&apos;s next<ArrowRight data-icon="inline-end" /></Button>
      </div>
      {found.length > 0 && <p className="font-bold">Found: {found.map((item) => `${item} × ${24 / item}`).join('  •  ')}</p>}
    </section>
  )
}
