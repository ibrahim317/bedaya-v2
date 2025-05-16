import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Clinic from '@/models/main/Clinic';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    await connectDB();

    const clinic = await Clinic.findById(id)
      .populate('commonDiagnoses')
      .populate('commonTreatments');

    if (!clinic) {
      return NextResponse.json(
        { error: 'Clinic not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(clinic);
  } catch (error) {
    console.error('Failed to fetch clinic:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clinic' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const { name } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Clinic name is required' },
        { status: 400 }
      );
    }

    await connectDB();
    const clinic = await Clinic.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true }
    );

    if (!clinic) {
      return NextResponse.json(
        { error: 'Clinic not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(clinic);
  } catch (error) {
    console.error('Failed to update clinic:', error);
    return NextResponse.json(
      { error: 'Failed to update clinic' },
      { status: 500 }
    );
  }
} 