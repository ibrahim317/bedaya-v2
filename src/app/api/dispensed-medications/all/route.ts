import { NextRequest, NextResponse } from 'next/server';
import { dispensedMedicationService } from '@/services/dispensedMedicationService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';

    const result = await dispensedMedicationService.findAllPaginated(page, limit, search);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch dispensed medications:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { message: 'Failed to fetch dispensed medications', error: errorMessage },
      { status: 500 }
    );
  }
} 