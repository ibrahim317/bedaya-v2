import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { clinicService } from '@/services/clinicService';
import ClinicVisit from '@/models/main/ClinicVisit';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const clinicId = params.id;
    const { patientId, diagnoses, treatments, images } = await request.json();

    if (!patientId || !clinicId) {
      return NextResponse.json(
        { error: "Patient ID and Clinic ID are required" },
        { status: 400 }
      );
    }
    
    // Ensure model is initialized
    await ClinicVisit.find({_id: null});

    await clinicService.createClinicVisit({
        patientId,
        clinicId,
        diagnoses,
        treatments,
        images,
    });

    return NextResponse.json({ message: "Visit recorded successfully" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 