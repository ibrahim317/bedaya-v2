import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Clinic from '@/models/main/Clinic';

export async function GET() {
  try {
    await connectDB();
    const clinics = await Clinic.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          commonDiagnoses: { $size: { $ifNull: ['$commonDiagnoses', []] } },
          commonTreatments: { $size: { $ifNull: ['$commonTreatments', []] } }
        }
      },
      {
        $sort: { name: 1 }
      }
    ]);
    return NextResponse.json(clinics);
  } catch (error) {
    console.error('Failed to fetch clinics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clinics' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    
    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Clinic name is required' },
        { status: 400 }
      );
    }

    await connectDB();
    const clinic = new Clinic({ name: name.trim() });
    await clinic.save();

    return NextResponse.json(clinic, { status: 201 });
  } catch (error) {
    console.error('Failed to create clinic:', error);
    return NextResponse.json(
      { error: 'Failed to create clinic' },
      { status: 500 }
    );
  }
} 