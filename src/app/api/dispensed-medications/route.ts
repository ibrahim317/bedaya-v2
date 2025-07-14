import { NextResponse } from 'next/server';
import { createDispensedMedication } from '@/services/dispensedMedicationService';
import { DispensedMedicationData } from '@/types/DispensedMedication';

export async function POST(request: Request) {
  try {
    const body: DispensedMedicationData = await request.json();
    const { patientId, medications } = body;

    if (!patientId || !medications || !Array.isArray(medications) || medications.length === 0) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    for (const med of medications) {
      if (
        !med.drug ||
        !med.drug.name ||
        !med.drug.barcode ||
        !med.drug.expiryDate ||
        !med.quantity ||
        !med.quantityType ||
        !med.remainingQuantity ||
        !med.remainingUnit
      ) {
        return NextResponse.json({ message: 'Invalid medication data provided' }, { status: 400 });
      }
    }

    const newDispensedMedication = await createDispensedMedication(body);

    return NextResponse.json(newDispensedMedication, { status: 201 });
  } catch (error) {
    console.error('Error creating dispensed medication:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: 'Failed to create dispensed medication', error: errorMessage }, { status: 500 });
  }
} 