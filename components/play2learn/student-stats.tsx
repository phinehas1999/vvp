'use client'

import { AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ArrowLeft, BarChart3, Brain, Flame, Star, Target, TrendingUp, Trophy, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Progress } from '@/lib/play2learn'

// Mock data derived from actual progress
function generateMockHistory(progress: Progress) {
  const baseScore = progress.gameState['basket-builder'].totalScore > 0
    ? Math.min(progress.gameState['basket-builder'].totalScore / 5, 80)
    : 45

  return {
    scoreHistory: [
      { session: '1', score: Math.max(baseScore - 25, 20) },
      { session: '2', score: Math.max(baseScore - 18, 25) },
      { session: '3', score: Math.max(baseScore - 12, 30) },
      { session: '4', score: Math.max(baseScore - 5, 35) },
      { session: '5', score: baseScore },
      { session: '6', score: Math.min(baseScore + 5, 100) },
      { session: '7', score: Math.min(baseScore + 8, 100) },
    ],
    skills: [
      { skill: 'Division', value: Math.min(60 + progress.gameState['basket-builder'].level * 10, 95) },
      { skill: 'Patterns', value: Math.min(55 + progress.gameState['pattern-finder'].level * 10, 95) },
      { skill: 'Speed', value: progress.gameState['basket-builder'].bestTime > 0 ? Math.min(90 - Math.floor(progress.gameState['basket-builder'].bestTime / 1000), 95) : 40 },
      { skill: 'Combos', value: Math.min(40 + progress.gameState['basket-builder'].bestCombo * 8, 95) },
      { skill: 'Consistency', value: Math.min(50 + progress.stars, 90) },
    ],
    weeklyPlay: [
      { day: 'Mon', minutes: 12 },
      { day: 'Tue', minutes: 8 },
      { day: 'Wed', minutes: 15 },
      { day: 'Thu', minutes: 0 },
      { day: 'Fri', minutes: 20 },
      { day: 'Sat', minutes: 25 },
      { day: 'Sun', minutes: 10 },
    ],
  }
}

export function StudentStats({ progress, onBack }: { progress: Progress; onBack: () => void }) {
  const data = generateMockHistory(progress)
  const totalGames = (progress.gameState['basket-builder'].completed ? 1 : 0) + (progress.gameState['pattern-finder'].completed ? 1 : 0)
  const bestCombo = Math.max(progress.gameState['basket-builder'].bestCombo, progress.gameState['pattern-finder'].bestCombo)
  const totalScore = progress.gameState['basket-builder'].totalScore + progress.gameState['pattern-finder'].totalScore

  return (
    <section className="flex flex-col gap-5 h-full overflow-y-auto pb-10 px-1 pt-1">
      {/* Header */}
      <div className="bg-[#FDFBF7] border-4 border-[#3B2F5E] rounded-3xl p-5 shadow-[0_8px_0_#3B2F5E] flex flex-wrap justify-between items-center gap-4">
        <div>
          <p className="font-bold text-[#4FB6C9] uppercase tracking-wider text-xs">Your learning journey</p>
          <h1 className="text-2xl md:text-3xl font-black text-[#3B2F5E] mt-1 flex items-center gap-2">
            <BarChart3 className="size-7 text-[#4FB6C9]" />
            My Stats
          </h1>
        </div>
        <Button onClick={onBack} className="border-3 border-[#3B2F5E] text-[#3B2F5E] bg-transparent hover:bg-[#3B2F5E]/5 shadow-[0_4px_0_#3B2F5E] rounded-xl h-12">
          <ArrowLeft className="mr-2 size-4" />
          Back to world
        </Button>
      </div>

      {/* Quick stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MiniStat icon={<Star className="size-5 fill-[#FFC94D] text-[#FFC94D]" />} value={progress.stars} label="Stars earned" />
        <MiniStat icon={<Trophy className="size-5 text-[#6FBF73]" />} value={totalScore} label="Total score" />
        <MiniStat icon={<Zap className="size-5 text-[#FF7A5C]" />} value={bestCombo} label="Best combo" />
        <MiniStat icon={<Flame className="size-5 text-[#FF7A5C]" />} value={`Lv ${Math.max(progress.gameState['basket-builder'].level, progress.gameState['pattern-finder'].level)}`} label="Highest level" />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Score progression */}
        <div className="bg-[#FDFBF7] border-4 border-[#3B2F5E] rounded-3xl p-5 shadow-[0_6px_0_#3B2F5E]">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="size-5 text-[#4FB6C9]" />
            <h3 className="font-black text-[#3B2F5E]">Score Growth</h3>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={data.scoreHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3B2F5E10" />
              <XAxis dataKey="session" tick={{ fontSize: 11, fill: '#3B2F5E', fontWeight: 700 }} />
              <YAxis tick={{ fontSize: 11, fill: '#3B2F5E80' }} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '3px solid #3B2F5E', fontWeight: 700, background: '#FDFBF7' }} />
              <Area type="monotone" dataKey="score" stroke="#4FB6C9" fill="#4FB6C9" fillOpacity={0.2} strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Skill radar */}
        <div className="bg-[#FDFBF7] border-4 border-[#3B2F5E] rounded-3xl p-5 shadow-[0_6px_0_#3B2F5E]">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="size-5 text-[#6FBF73]" />
            <h3 className="font-black text-[#3B2F5E]">My Skills</h3>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <RadarChart data={data.skills}>
              <PolarGrid stroke="#3B2F5E20" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: '#3B2F5E', fontWeight: 700 }} />
              <PolarRadiusAxis tick={{ fontSize: 9, fill: '#3B2F5E80' }} domain={[0, 100]} />
              <Radar dataKey="value" stroke="#6FBF73" fill="#6FBF73" fillOpacity={0.3} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Play time chart */}
      <div className="bg-[#FDFBF7] border-4 border-[#3B2F5E] rounded-3xl p-5 shadow-[0_6px_0_#3B2F5E]">
        <div className="flex items-center gap-2 mb-3">
          <Target className="size-5 text-[#FF7A5C]" />
          <h3 className="font-black text-[#3B2F5E]">This Week&apos;s Play Time</h3>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={data.weeklyPlay}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3B2F5E10" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#3B2F5E', fontWeight: 700 }} />
            <YAxis tick={{ fontSize: 11, fill: '#3B2F5E80' }} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '3px solid #3B2F5E', fontWeight: 700, background: '#FDFBF7' }} />
            <Bar dataKey="minutes" fill="#FFC94D" radius={[8, 8, 0, 0]} name="Minutes" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Game-specific stats */}
      <div className="grid md:grid-cols-2 gap-4">
        <GameStatCard
          game="Basket Builder"
          level={progress.gameState['basket-builder'].level}
          score={progress.gameState['basket-builder'].totalScore}
          combo={progress.gameState['basket-builder'].bestCombo}
          time={progress.gameState['basket-builder'].bestTime}
          completed={progress.gameState['basket-builder'].completed}
          color="#FF7A5C"
        />
        <GameStatCard
          game="Skyline Signal"
          level={progress.gameState['pattern-finder'].level}
          score={progress.gameState['pattern-finder'].totalScore}
          combo={progress.gameState['pattern-finder'].bestCombo}
          time={progress.gameState['pattern-finder'].bestTime}
          completed={progress.gameState['pattern-finder'].completed}
          color="#4FB6C9"
        />
      </div>
    </section>
  )
}

function MiniStat({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="bg-[#FDFBF7] border-3 border-[#3B2F5E] rounded-2xl p-4 shadow-[0_4px_0_#3B2F5E] flex items-center gap-3">
      {icon}
      <div>
        <p className="text-xl font-black text-[#3B2F5E]">{value}</p>
        <p className="text-[10px] font-bold text-[#3B2F5E]/50 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  )
}

function GameStatCard({ game, level, score, combo, time, completed, color }: {
  game: string; level: number; score: number; combo: number; time: number; completed: boolean; color: string
}) {
  return (
    <div className="bg-[#FDFBF7] border-4 border-[#3B2F5E] rounded-3xl p-5 shadow-[0_6px_0_#3B2F5E]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-black text-[#3B2F5E]">{game}</h3>
        <span className="rounded-full px-3 py-1 text-xs font-black text-white" style={{ backgroundColor: color }}>
          Level {level}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className="text-lg font-black" style={{ color }}>{score}</p>
          <p className="text-[10px] font-bold text-[#3B2F5E]/50">Total Score</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-[#FFC94D]">{combo}</p>
          <p className="text-[10px] font-bold text-[#3B2F5E]/50">Best Combo</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-[#3B2F5E]">{time > 0 ? `${(time / 1000).toFixed(1)}s` : '—'}</p>
          <p className="text-[10px] font-bold text-[#3B2F5E]/50">Best Time</p>
        </div>
      </div>
      {completed && (
        <div className="mt-3 text-center text-xs font-black text-[#6FBF73] flex items-center justify-center gap-1">
          <Trophy className="size-3.5" /> Completed!
        </div>
      )}
    </div>
  )
}
