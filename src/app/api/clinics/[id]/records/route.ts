import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { clinicService } from '@/services/clinicService';
import PatientDiagnosis from '@/models/main/PatientDiagnosis';
import PatientTreatment from '@/models/main/PatientTreatment';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const clinicId = params.id;
    const { patientId, diagnoses, treatments } = await request.json();

    if (!patientId || !clinicId) {
      return NextResponse.json(
        { error: "Patient ID and Clinic ID are required" },
        { status: 400 }
      );
    }
    
    // Ensure models are initialized
    await PatientDiagnosis.find({_id: null});
    await PatientTreatment.find({_id: null});

    await clinicService.createPatientRecords({
        patientId,
        clinicId,
        diagnoses,
        treatments,
    });

    return NextResponse.json({ message: "Records created successfully" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 