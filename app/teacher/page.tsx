'use client'

import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  BarChart3, BookOpen, Brain, Calendar, ChevronDown, Clock,
  Flame, GraduationCap, LayoutDashboard, LogOut, Medal,
  Search, Sparkles, Star, Target, TrendingUp, Trophy, Users, Zap
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

// Mock data for the dashboard
const weeklyActivity = [
  { day: 'Mon', sessions: 24, avgScore: 72 },
  { day: 'Tue', sessions: 31, avgScore: 78 },
  { day: 'Wed', sessions: 28, avgScore: 75 },
  { day: 'Thu', sessions: 35, avgScore: 82 },
  { day: 'Fri', sessions: 22, avgScore: 69 },
  { day: 'Sat', sessions: 12, avgScore: 85 },
  { day: 'Sun', sessions: 8, avgScore: 88 },
]

const monthlyProgress = [
  { week: 'Week 1', basketBuilder: 65, patternFinder: 58, overall: 62 },
  { week: 'Week 2', basketBuilder: 70, patternFinder: 64, overall: 67 },
  { week: 'Week 3', basketBuilder: 78, patternFinder: 72, overall: 75 },
  { week: 'Week 4', basketBuilder: 82, patternFinder: 79, overall: 80 },
]

const skillDistribution = [
  { skill: 'Division', value: 78 },
  { skill: 'Pattern Recognition', value: 72 },
  { skill: 'Speed', value: 85 },
  { skill: 'Accuracy', value: 68 },
  { skill: 'Problem Solving', value: 74 },
  { skill: 'Memory', value: 81 },
]

const difficultyBreakdown = [
  { name: 'Easy', value: 35, color: '#6FBF73' },
  { name: 'Medium', value: 40, color: '#4FB6C9' },
  { name: 'Hard', value: 18, color: '#FFC94D' },
  { name: 'Expert', value: 7, color: '#FF7A5C' },
]

const engagementData = [
  { hour: '8am', active: 5 },
  { hour: '9am', active: 12 },
  { hour: '10am', active: 18 },
  { hour: '11am', active: 22 },
  { hour: '12pm', active: 15 },
  { hour: '1pm', active: 20 },
  { hour: '2pm', active: 25 },
  { hour: '3pm', active: 19 },
  { hour: '4pm', active: 10 },
  { hour: '5pm', active: 6 },
]

const mockStudents = [
  { id: 1, name: 'Aster K.', explorer: 'Hana', stars: 142, coins: 890, gamesPlayed: 47, avgScore: 84, streak: 7, lastActive: '2 hours ago', trend: 'up' },
  { id: 2, name: 'Biruk T.', explorer: 'Abel', stars: 98, coins: 620, gamesPlayed: 35, avgScore: 72, streak: 3, lastActive: '5 hours ago', trend: 'up' },
  { id: 3, name: 'Lensa M.', explorer: 'Lulit', stars: 210, coins: 1340, gamesPlayed: 63, avgScore: 91, streak: 12, lastActive: '1 hour ago', trend: 'up' },
  { id: 4, name: 'Dawit L.', explorer: 'Abel', stars: 67, coins: 410, gamesPlayed: 22, avgScore: 65, streak: 1, lastActive: '1 day ago', trend: 'down' },
  { id: 5, name: 'Meklit W.', explorer: 'Hana', stars: 156, coins: 980, gamesPlayed: 51, avgScore: 87, streak: 9, lastActive: '3 hours ago', trend: 'up' },
  { id: 6, name: 'Nahom O.', explorer: 'Lulit', stars: 45, coins: 280, gamesPlayed: 15, avgScore: 58, streak: 0, lastActive: '3 days ago', trend: 'down' },
  { id: 7, name: 'Saron H.', explorer: 'Hana', stars: 178, coins: 1120, gamesPlayed: 56, avgScore: 89, streak: 5, lastActive: '4 hours ago', trend: 'up' },
  { id: 8, name: 'Henok S.', explorer: 'Abel', stars: 89, coins: 550, gamesPlayed: 30, avgScore: 70, streak: 2, lastActive: '1 day ago', trend: 'stable' },
]

const recentAlerts = [
  { type: 'achievement', student: 'Chloe M.', message: 'Reached a 12-day streak!', time: '1h ago' },
  { type: 'struggle', student: 'Finn O.', message: 'Hasn\'t played in 3 days', time: '3h ago' },
  { type: 'milestone', student: 'Emma W.', message: 'Completed all Easy levels', time: '4h ago' },
  { type: 'improvement', student: 'David L.', message: 'Score improved 15% this week', time: '5h ago' },
]

export default function TeacherDashboard() {
  const { data: session } = useSession()
  const routerNav = useRouter()
  const [view, setView] = useState<'overview' | 'student'>('overview')
  const [selectedStudent, setSelectedStudent] = useState<typeof mockStudents[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [timeRange, setTimeRange] = useState('This Week')

  if (session && (session.user as any)?.role !== 'teacher') {
    routerNav.push('/')
    return null
  }

  const filteredStudents = mockStudents.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalStudents = mockStudents.length
  const avgClassScore = Math.round(mockStudents.reduce((a, s) => a + s.avgScore, 0) / totalStudents)
  const totalGamesPlayed = mockStudents.reduce((a, s) => a + s.gamesPlayed, 0)
  const activeToday = mockStudents.filter(s => s.lastActive.includes('hour')).length

  return (
    <div className="min-h-dvh bg-gradient-to-br from-[#F7F5EF] via-[#F0F8F0] to-[#F7F5EF]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b-3 border-[#3B2F5E]/10 bg-[#FDFBF7]/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border-3 border-[#3B2F5E] bg-[#6FBF73] px-4 py-2 shadow-[0_3px_0_#3B2F5E]">
              <GraduationCap className="size-5 text-[#FDFBF7]" />
              <span className="font-black text-[#FDFBF7] text-sm">Play2Learn</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-black text-[#3B2F5E]">Teacher Dashboard</h1>
              <p className="text-xs font-semibold text-[#3B2F5E]/50">Monitor & inspire your learners</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Time range selector */}
            <div className="relative">
              <button className="flex items-center gap-2 rounded-xl border-2 border-[#3B2F5E]/20 bg-white px-4 py-2.5 font-bold text-sm text-[#3B2F5E] hover:border-[#3B2F5E]/40 transition-colors">
                <Calendar className="size-4 text-[#4FB6C9]" />
                {timeRange}
                <ChevronDown className="size-3 text-[#3B2F5E]/40" />
              </button>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-2 rounded-xl border-2 border-[#FF7A5C]/30 bg-[#FF7A5C]/5 px-4 py-2.5 font-bold text-sm text-[#FF7A5C] hover:bg-[#FF7A5C]/10 transition-colors"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {view === 'overview' ? (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={<Users />} label="Students" value={totalStudents} color="#4FB6C9" />
              <StatCard icon={<Target />} label="Avg Score" value={`${avgClassScore}%`} color="#6FBF73" />
              <StatCard icon={<Zap />} label="Games Today" value={totalGamesPlayed} color="#FFC94D" />
              <StatCard icon={<Flame />} label="Active Now" value={activeToday} color="#FF7A5C" />
            </div>

            {/* Charts Row 1 */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Weekly Activity */}
              <ChartCard title="Weekly Activity" subtitle="Sessions & performance this week">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3B2F5E10" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#3B2F5E', fontWeight: 700 }} />
                    <YAxis tick={{ fontSize: 12, fill: '#3B2F5E80' }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '2px solid #3B2F5E20', fontWeight: 700 }} />
                    <Bar dataKey="sessions" fill="#4FB6C9" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Monthly Progress */}
              <ChartCard title="Class Progress" subtitle="Average scores trending over 4 weeks">
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={monthlyProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3B2F5E10" />
                    <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#3B2F5E', fontWeight: 700 }} />
                    <YAxis tick={{ fontSize: 12, fill: '#3B2F5E80' }} domain={[50, 100]} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '2px solid #3B2F5E20', fontWeight: 700 }} />
                    <Legend />
                    <Line type="monotone" dataKey="basketBuilder" stroke="#FF7A5C" strokeWidth={3} dot={{ r: 5 }} name="Basket Builder" />
                    <Line type="monotone" dataKey="patternFinder" stroke="#4FB6C9" strokeWidth={3} dot={{ r: 5 }} name="Skyline Signal" />
                    <Line type="monotone" dataKey="overall" stroke="#6FBF73" strokeWidth={3} dot={{ r: 5 }} name="Overall" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Charts Row 2 */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Skill Radar */}
              <ChartCard title="Class Skills" subtitle="Average abilities across dimensions">
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={skillDistribution}>
                    <PolarGrid stroke="#3B2F5E20" />
                    <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: '#3B2F5E', fontWeight: 700 }} />
                    <PolarRadiusAxis tick={{ fontSize: 10, fill: '#3B2F5E80' }} domain={[0, 100]} />
                    <Radar name="Class Average" dataKey="value" stroke="#4FB6C9" fill="#4FB6C9" fillOpacity={0.3} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Difficulty Distribution */}
              <ChartCard title="Difficulty Levels" subtitle="Where students are playing">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={difficultyBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                      {difficultyBreakdown.map((entry, i) => (
                        <Cell key={i} fill={entry.color} stroke="#3B2F5E" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: '2px solid #3B2F5E20', fontWeight: 700 }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Engagement */}
              <ChartCard title="Peak Hours" subtitle="When students are most active">
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3B2F5E10" />
                    <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#3B2F5E', fontWeight: 700 }} />
                    <YAxis tick={{ fontSize: 10, fill: '#3B2F5E80' }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '2px solid #3B2F5E20', fontWeight: 700 }} />
                    <Area type="monotone" dataKey="active" stroke="#6FBF73" fill="#6FBF73" fillOpacity={0.2} strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Alerts & Notifications */}
            <div className="rounded-2xl border-3 border-[#3B2F5E]/10 bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="size-5 text-[#FFC94D]" />
                <h3 className="font-black text-[#3B2F5E] text-lg">Recent Highlights</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {recentAlerts.map((alert, i) => (
                  <div key={i} className={`flex items-start gap-3 rounded-xl border-2 p-4 transition-colors hover:bg-[#FDFBF7] ${
                    alert.type === 'achievement' ? 'border-[#FFC94D]/40 bg-[#FFC94D]/5' :
                    alert.type === 'struggle' ? 'border-[#FF7A5C]/40 bg-[#FF7A5C]/5' :
                    alert.type === 'milestone' ? 'border-[#6FBF73]/40 bg-[#6FBF73]/5' :
                    'border-[#4FB6C9]/40 bg-[#4FB6C9]/5'
                  }`}>
                    <div className={`rounded-lg p-2 ${
                      alert.type === 'achievement' ? 'bg-[#FFC94D]/20' :
                      alert.type === 'struggle' ? 'bg-[#FF7A5C]/20' :
                      alert.type === 'milestone' ? 'bg-[#6FBF73]/20' :
                      'bg-[#4FB6C9]/20'
                    }`}>
                      {alert.type === 'achievement' ? <Trophy className="size-4 text-[#FFC94D]" /> :
                       alert.type === 'struggle' ? <Clock className="size-4 text-[#FF7A5C]" /> :
                       alert.type === 'milestone' ? <Medal className="size-4 text-[#6FBF73]" /> :
                       <TrendingUp className="size-4 text-[#4FB6C9]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm text-[#3B2F5E]">{alert.student}</p>
                      <p className="text-xs font-semibold text-[#3B2F5E]/60 mt-0.5">{alert.message}</p>
                    </div>
                    <span className="text-xs font-bold text-[#3B2F5E]/40 shrink-0">{alert.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Student List */}
            <div className="rounded-2xl border-3 border-[#3B2F5E]/10 bg-white p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Users className="size-5 text-[#4FB6C9]" />
                  <h3 className="font-black text-[#3B2F5E] text-lg">All Students</h3>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#3B2F5E]/40" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 rounded-xl border-2 border-[#3B2F5E]/15 bg-[#FDFBF7] pl-10 pr-4 text-sm font-bold text-[#3B2F5E] placeholder:text-[#3B2F5E]/30 focus:ring-2 focus:ring-[#4FB6C9] focus:border-[#4FB6C9] outline-none transition-all w-56"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-[#3B2F5E]/10">
                      <th className="text-left py-3 px-2 font-black text-xs text-[#3B2F5E]/50 uppercase tracking-wider">Student</th>
                      <th className="text-center py-3 px-2 font-black text-xs text-[#3B2F5E]/50 uppercase tracking-wider">Explorer</th>
                      <th className="text-center py-3 px-2 font-black text-xs text-[#3B2F5E]/50 uppercase tracking-wider">Stars</th>
                      <th className="text-center py-3 px-2 font-black text-xs text-[#3B2F5E]/50 uppercase tracking-wider">Avg Score</th>
                      <th className="text-center py-3 px-2 font-black text-xs text-[#3B2F5E]/50 uppercase tracking-wider">Games</th>
                      <th className="text-center py-3 px-2 font-black text-xs text-[#3B2F5E]/50 uppercase tracking-wider">Streak</th>
                      <th className="text-center py-3 px-2 font-black text-xs text-[#3B2F5E]/50 uppercase tracking-wider">Last Active</th>
                      <th className="text-right py-3 px-2 font-black text-xs text-[#3B2F5E]/50 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="border-b border-[#3B2F5E]/5 hover:bg-[#FDFBF7] transition-colors">
                        <td className="py-3 px-2">
                          <span className="font-black text-[#3B2F5E]">{student.name}</span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-black ${
                            student.explorer === 'Abel' ? 'bg-[#4FB6C9]/15 text-[#4FB6C9]' :
                            student.explorer === 'Hana' ? 'bg-[#FF7A5C]/15 text-[#FF7A5C]' :
                            'bg-[#6FBF73]/15 text-[#6FBF73]'
                          }`}>
                            {student.explorer}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className="flex items-center justify-center gap-1 font-bold text-sm text-[#3B2F5E]">
                            <Star className="size-3.5 fill-[#FFC94D] text-[#FFC94D]" />{student.stars}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className={`font-black text-sm ${
                            student.avgScore >= 80 ? 'text-[#6FBF73]' :
                            student.avgScore >= 60 ? 'text-[#FFC94D]' :
                            'text-[#FF7A5C]'
                          }`}>
                            {student.avgScore}%
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center font-bold text-sm text-[#3B2F5E]">{student.gamesPlayed}</td>
                        <td className="py-3 px-2 text-center">
                          <span className="flex items-center justify-center gap-1 font-bold text-sm">
                            <Flame className={`size-3.5 ${student.streak >= 5 ? 'text-[#FF7A5C]' : 'text-[#3B2F5E]/30'}`} />
                            <span className="text-[#3B2F5E]">{student.streak}</span>
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center text-xs font-semibold text-[#3B2F5E]/50">{student.lastActive}</td>
                        <td className="py-3 px-2 text-right">
                          <button
                            onClick={() => { setSelectedStudent(student); setView('student') }}
                            className="rounded-lg border-2 border-[#4FB6C9]/30 bg-[#4FB6C9]/10 px-3 py-1.5 text-xs font-black text-[#4FB6C9] hover:bg-[#4FB6C9]/20 transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          selectedStudent && <StudentDetail student={selectedStudent} onBack={() => setView('overview')} />
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-2xl border-3 border-[#3B2F5E]/10 bg-white p-5 hover:border-[#3B2F5E]/20 transition-colors">
      <div className="flex items-center gap-3">
        <div className="rounded-xl p-2.5" style={{ backgroundColor: `${color}15` }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <div>
          <p className="text-2xl font-black text-[#3B2F5E]">{value}</p>
          <p className="text-xs font-bold text-[#3B2F5E]/50">{label}</p>
        </div>
      </div>
    </div>
  )
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-3 border-[#3B2F5E]/10 bg-white p-5">
      <div className="mb-4">
        <h3 className="font-black text-[#3B2F5E]">{title}</h3>
        <p className="text-xs font-semibold text-[#3B2F5E]/50 mt-0.5">{subtitle}</p>
      </div>
      {children}
    </div>
  )
}

// Individual student detail view
function StudentDetail({ student, onBack }: { student: typeof mockStudents[0]; onBack: () => void }) {
  const studentProgress = [
    { session: '1', score: 55, combo: 2 },
    { session: '2', score: 62, combo: 3 },
    { session: '3', score: 58, combo: 2 },
    { session: '4', score: 71, combo: 4 },
    { session: '5', score: 75, combo: 5 },
    { session: '6', score: 69, combo: 3 },
    { session: '7', score: 82, combo: 6 },
    { session: '8', score: 78, combo: 5 },
    { session: '9', score: 85, combo: 7 },
    { session: '10', score: student.avgScore, combo: 5 },
  ]

  const studentSkills = [
    { skill: 'Division', value: student.avgScore - 5 },
    { skill: 'Patterns', value: student.avgScore + 3 },
    { skill: 'Speed', value: Math.min(student.avgScore + 8, 100) },
    { skill: 'Accuracy', value: student.avgScore - 8 },
    { skill: 'Problem Solving', value: student.avgScore + 2 },
    { skill: 'Memory', value: student.avgScore - 2 },
  ]

  const gameBreakdown = [
    { game: 'Basket Builder', sessions: Math.floor(student.gamesPlayed * 0.6), avgScore: student.avgScore + 3, bestScore: student.avgScore + 15 },
    { game: 'Skyline Signal', sessions: Math.floor(student.gamesPlayed * 0.4), avgScore: student.avgScore - 2, bestScore: student.avgScore + 10 },
  ]

  const weeklyHeatmap = [
    { day: 'Mon', games: 3, minutes: 25 },
    { day: 'Tue', games: 2, minutes: 18 },
    { day: 'Wed', games: 4, minutes: 32 },
    { day: 'Thu', games: 1, minutes: 10 },
    { day: 'Fri', games: 3, minutes: 22 },
    { day: 'Sat', games: 5, minutes: 40 },
    { day: 'Sun', games: 2, minutes: 15 },
  ]

  return (
    <div className="space-y-6">
      {/* Back + Student header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="rounded-xl border-2 border-[#3B2F5E]/20 bg-white px-4 py-2.5 font-bold text-sm text-[#3B2F5E] hover:border-[#3B2F5E]/40 transition-colors"
        >
          ← Back to Overview
        </button>
      </div>

      <div className="rounded-2xl border-3 border-[#3B2F5E]/10 bg-white p-6">
        <div className="flex flex-wrap items-center gap-6">
          <div className={`size-16 rounded-2xl border-3 flex items-center justify-center font-black text-2xl text-white ${
            student.explorer === 'Abel' ? 'bg-[#4FB6C9] border-[#3B2F5E]' :
            student.explorer === 'Hana' ? 'bg-[#FF7A5C] border-[#3B2F5E]' :
            'bg-[#6FBF73] border-[#3B2F5E]'
          }`}>
            {student.name[0]}
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#3B2F5E]">{student.name}</h2>
            <p className="text-sm font-semibold text-[#3B2F5E]/50">Explorer: {student.explorer} · Joined 3 weeks ago</p>
          </div>
          <div className="ml-auto flex gap-4">
            <div className="text-center">
              <p className="text-2xl font-black text-[#6FBF73]">{student.avgScore}%</p>
              <p className="text-xs font-bold text-[#3B2F5E]/50">Avg Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-[#FFC94D]">{student.stars}</p>
              <p className="text-xs font-bold text-[#3B2F5E]/50">Stars</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-[#FF7A5C]">{student.streak}</p>
              <p className="text-xs font-bold text-[#3B2F5E]/50">Day Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts for individual student */}
      <div className="grid md:grid-cols-2 gap-6">
        <ChartCard title="Score Progression" subtitle="Last 10 game sessions">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={studentProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3B2F5E10" />
              <XAxis dataKey="session" tick={{ fontSize: 11, fill: '#3B2F5E', fontWeight: 700 }} />
              <YAxis tick={{ fontSize: 11, fill: '#3B2F5E80' }} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '2px solid #3B2F5E20', fontWeight: 700 }} />
              <Line type="monotone" dataKey="score" stroke="#4FB6C9" strokeWidth={3} dot={{ r: 4, fill: '#4FB6C9' }} />
              <Line type="monotone" dataKey="combo" stroke="#FFC94D" strokeWidth={2} dot={{ r: 3, fill: '#FFC94D' }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Skill Profile" subtitle="Strengths and areas to improve">
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={studentSkills}>
              <PolarGrid stroke="#3B2F5E20" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: '#3B2F5E', fontWeight: 700 }} />
              <PolarRadiusAxis tick={{ fontSize: 10, fill: '#3B2F5E80' }} domain={[0, 100]} />
              <Radar name={student.name} dataKey="value" stroke="#FF7A5C" fill="#FF7A5C" fillOpacity={0.3} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Game breakdown */}
        <ChartCard title="Game Breakdown" subtitle="Performance per game">
          <div className="space-y-4">
            {gameBreakdown.map((game) => (
              <div key={game.game} className="rounded-xl border-2 border-[#3B2F5E]/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-sm text-[#3B2F5E]">{game.game}</span>
                  <span className="text-xs font-bold text-[#3B2F5E]/50">{game.sessions} sessions</span>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-lg font-black text-[#4FB6C9]">{game.avgScore}%</p>
                    <p className="text-[10px] font-bold text-[#3B2F5E]/50">Average</p>
                  </div>
                  <div>
                    <p className="text-lg font-black text-[#6FBF73]">{game.bestScore}%</p>
                    <p className="text-[10px] font-bold text-[#3B2F5E]/50">Best</p>
                  </div>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[#3B2F5E]/10 overflow-hidden">
                  <div className="h-full rounded-full bg-[#4FB6C9]" style={{ width: `${game.avgScore}%` }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Weekly play pattern */}
        <ChartCard title="Weekly Pattern" subtitle="Play frequency by day">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyHeatmap}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3B2F5E10" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#3B2F5E', fontWeight: 700 }} />
              <YAxis tick={{ fontSize: 11, fill: '#3B2F5E80' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '2px solid #3B2F5E20', fontWeight: 700 }} />
              <Bar dataKey="minutes" fill="#6FBF73" radius={[6, 6, 0, 0]} name="Minutes" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recommendations */}
      <div className="rounded-2xl border-3 border-[#3B2F5E]/10 bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="size-5 text-[#6FBF73]" />
          <h3 className="font-black text-[#3B2F5E] text-lg">AI Insights</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-xl border-2 border-[#6FBF73]/30 bg-[#6FBF73]/5 p-4">
            <p className="font-black text-sm text-[#6FBF73] mb-1">Strength</p>
            <p className="text-sm font-semibold text-[#3B2F5E]/70">
              {student.name} excels at speed-based challenges and maintains strong combo streaks.
            </p>
          </div>
          <div className="rounded-xl border-2 border-[#FFC94D]/30 bg-[#FFC94D]/5 p-4">
            <p className="font-black text-sm text-[#FFC94D] mb-1">Growth Area</p>
            <p className="text-sm font-semibold text-[#3B2F5E]/70">
              Accuracy could improve — consider suggesting they slow down slightly on Hard levels.
            </p>
          </div>
          <div className="rounded-xl border-2 border-[#4FB6C9]/30 bg-[#4FB6C9]/5 p-4">
            <p className="font-black text-sm text-[#4FB6C9] mb-1">Recommendation</p>
            <p className="text-sm font-semibold text-[#3B2F5E]/70">
              Ready for Expert difficulty in Basket Builder. Skyline Signal could use more practice.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
