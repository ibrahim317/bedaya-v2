import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { clinicService } from '@/services/clinicService';
import ClinicVisit from '@/models/main/ClinicVisit';
import { Patient } from '@/models/main/Patient';
import Clinic from '@/models/main/Clinic';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const clinicId = params.id;
    const { patientId, diagnoses, treatments, followUpImages, radiologyImages } = await request.json();

    if (!patientId || !clinicId) {
      return NextResponse.json(
        { error: "Patient ID and Clinic ID are required" },
        { status: 400 }
      );
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
    }
    
    // Ensure model is initialized
    await ClinicVisit.find({_id: null});

    await clinicService.createClinicVisit({
        patientId,
        clinicId,
        patientName: patient.name,
        clinicName: clinic.name,
        diagnoses,
        treatments,
        followUpImages,
        radiologyImages,
    });

    return NextResponse.json({ message: "Visit recorded successfully" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 