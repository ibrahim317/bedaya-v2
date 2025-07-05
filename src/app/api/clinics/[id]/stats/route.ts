import { NextResponse } from 'next/server';
import { clinicService } from '@/services/clinicService';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const stats = await clinicService.getClinicStats(params.id);
    return NextResponse.json(stats);
  } catch (error) {
    console.error(`Failed to get stats for clinic ${params.id}:`, error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 