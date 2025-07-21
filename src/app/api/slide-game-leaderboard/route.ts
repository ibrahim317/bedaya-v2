import { NextRequest, NextResponse } from 'next/server';
import SlideGameLeaderboard from '@/models/main/SlideGameLeaderboard';
import { connectDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  await connectDB();
  const { ip, moves, name } = await req.json();
  if (!ip || typeof moves !== 'number') {
    return NextResponse.json({ error: 'Missing ip or moves' }, { status: 400 });
  }
  // Upsert: update if better, else keep old
  const existing = await SlideGameLeaderboard.findOne({ ip });
  if (!existing) {
    const created = await SlideGameLeaderboard.create({ ip, bestMoves: moves, lastPlayed: new Date(), name });
    return NextResponse.json({ bestMoves: created.bestMoves });
  } else {
    if (typeof name === 'string' && name && name !== existing.name) {
      existing.name = name;
    }
    if (moves < existing.bestMoves) {
      existing.bestMoves = moves;
      existing.lastPlayed = new Date();
      await existing.save();
      return NextResponse.json({ bestMoves: existing.bestMoves });
    } else {
      // Just update lastPlayed
      existing.lastPlayed = new Date();
      await existing.save();
      return NextResponse.json({ bestMoves: existing.bestMoves });
    }
  }
}

export async function GET() {
  await connectDB();
  const top = await SlideGameLeaderboard.find({})
    .sort({ bestMoves: 1, lastPlayed: 1 })
    .limit(10)
    .select('-_id ip bestMoves lastPlayed name');
  return NextResponse.json(top);
} 