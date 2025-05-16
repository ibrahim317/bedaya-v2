import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Clinic from '@/models/main/Clinic';
import { ICommonTreatment } from '@/types/CommonTreatment';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const { names } = await request.json();

    if (!Array.isArray(names) || names.length === 0) {
      return NextResponse.json(
        { error: 'At least one treatment name is required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const clinic = await Clinic.findById(id);
    if (!clinic) {
      return NextResponse.json(
        { error: 'Clinic not found' },
        { status: 404 }
      );
    }

    const treatments: ICommonTreatment[] = names
      .map(name => name?.trim())
      .filter(Boolean)
      .map(name => ({ name }));

    const updatedClinic = await Clinic.findByIdAndUpdate(
      id,
      { $push: { commonTreatments: { $each: treatments } } },
      { new: true }
    );

    if (!updatedClinic) {
      return NextResponse.json(
        { error: 'Failed to update clinic' },
        { status: 500 }
      );
    }

    // Return the newly added treatments
    const addedTreatments = updatedClinic.commonTreatments.slice(-treatments.length);
    return NextResponse.json(addedTreatments, { status: 201 });
  } catch (error) {
    console.error('Failed to add treatments:', error);
    return NextResponse.json(
      { error: 'Failed to add treatments' },
      { status: 500 }
    );
  }
} 