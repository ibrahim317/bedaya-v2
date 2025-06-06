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

    const treatments = await clinicService.getPatientTreatmentsForClinic(
      clinicId,
      patientId
    );

    return NextResponse.json(treatments);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 