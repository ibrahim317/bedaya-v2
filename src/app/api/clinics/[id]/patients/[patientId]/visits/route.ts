import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { clinicService } from '@/services/clinicService';

export async function GET(
  request: Request,
  { params }: { params: { id: string; patientId: string } }
) {
  try {
    await connectDB();
    const { id: clinicId, patientId } = params;

    if (!clinicId || !patientId) {
        return NextResponse.json({ error: 'Clinic ID and Patient ID are required' }, { status: 400 });
    }

    const visits = await clinicService.getPatientVisitHistory(clinicId, patientId);

    return NextResponse.json(visits, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 