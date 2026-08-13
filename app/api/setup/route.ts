import { getDb } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const sql = getDb()

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash TEXT NOT NULL DEFAULT '',
        role VARCHAR(20) NOT NULL DEFAULT 'student',
        explorer VARCHAR(20) DEFAULT 'Milo',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS game_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        game VARCHAR(50) NOT NULL,
        difficulty VARCHAR(20) NOT NULL,
        score INTEGER NOT NULL DEFAULT 0,
        combo INTEGER NOT NULL DEFAULT 0,
        time_ms INTEGER NOT NULL DEFAULT 0,
        level INTEGER NOT NULL DEFAULT 1,
        completed_at TIMESTAMP DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        game VARCHAR(50) NOT NULL,
        event_kind VARCHAR(50) NOT NULL,
        value INTEGER DEFAULT 0,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS student_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE REFERENCES users(id),
        coins INTEGER DEFAULT 0,
        stars INTEGER DEFAULT 0,
        total_play_time_ms INTEGER DEFAULT 0,
        games_played INTEGER DEFAULT 0,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        last_played_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    return NextResponse.json({ success: true, message: 'Database tables created successfully' })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ error: 'Setup failed', details: String(error) }, { status: 500 })
  }
}
