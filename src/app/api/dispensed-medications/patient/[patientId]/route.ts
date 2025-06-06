import { NextResponse } from 'next/server';
import { getDispensedMedicationsByPatientId } from '@/services/dispensedMedicationService';

export async function GET(
  request: Request,
  { params }: { params: { patientId: string } }
) {
  try {
    const dispensedMedications = await getDispensedMedicationsByPatientId(
      params.patientId
    );
    return NextResponse.json(dispensedMedications);
  } catch (error) {
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
} 