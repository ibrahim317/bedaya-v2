import { NextResponse } from 'next/server';
import { 
  updateDispensedMedication, 
  deleteDispensedMedication 
} from '@/services/dispensedMedicationService';
import { DispensedMedicationData } from '@/types/DispensedMedication';

interface Params {
  params: {
    id: string;
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body: DispensedMedicationData = await request.json();
    const { patientId, medications } = body;

    if (!patientId || !medications || !Array.isArray(medications) || medications.length === 0) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const updatedRecord = await updateDispensedMedication(id, body);

    return NextResponse.json(updatedRecord, { status: 200 });
  } catch (error) {
    console.error('Error updating dispensed medication:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: 'Failed to update dispensed medication', error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    
    await deleteDispensedMedication(id);

    return NextResponse.json({ message: 'Dispensed medication deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting dispensed medication:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: 'Failed to delete dispensed medication', error: errorMessage }, { status: 500 });
  }
} 