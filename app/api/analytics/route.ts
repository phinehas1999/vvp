import { auth } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { game, difficulty, score, combo, time, level } = await request.json()
    const sql = getDb()
    const userId = (session.user as any).id

    await sql`
      INSERT INTO game_sessions (user_id, game, difficulty, score, combo, time_ms, level)
      VALUES (${userId}, ${game}, ${difficulty}, ${score}, ${combo}, ${time}, ${level})
    `

    // Update student progress
    await sql`
      INSERT INTO student_progress (user_id, coins, stars, total_play_time_ms, games_played, last_played_at)
      VALUES (${userId}, ${score * 2}, ${Math.min(Math.floor(score / 50) + 1, 5)}, ${time}, 1, NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        coins = student_progress.coins + ${score * 2},
        stars = student_progress.stars + ${Math.min(Math.floor(score / 50) + 1, 5)},
        total_play_time_ms = student_progress.total_play_time_ms + ${time},
        games_played = student_progress.games_played + 1,
        last_played_at = NOW(),
        updated_at = NOW()
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics save error:', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
