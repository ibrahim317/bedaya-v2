import { NextResponse } from 'next/server';
import { getDailyDispensedMedicationStats } from '@/services/dispensedMedicationService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await getDailyDispensedMedicationStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to get daily dispensed medication stats:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 