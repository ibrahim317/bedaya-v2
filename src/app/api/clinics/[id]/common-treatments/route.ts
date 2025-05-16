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
    const { name } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Treatment name is required' },
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

    const treatment: ICommonTreatment = {
      name: name.trim(),
    };

    clinic.commonTreatments.push(treatment);
    await clinic.save();

    return NextResponse.json(treatment, { status: 201 });
  } catch (error) {
    console.error('Failed to add treatment:', error);
    return NextResponse.json(
      { error: 'Failed to add treatment' },
      { status: 500 }
    );
  }
}

// Bulk add treatments
export async function PUT(request: Request, { params }: RouteParams) {
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

    clinic.commonTreatments.push(...treatments);
    await clinic.save();

    return NextResponse.json(treatments, { status: 201 });
  } catch (error) {
    console.error('Failed to add treatments:', error);
    return NextResponse.json(
      { error: 'Failed to add treatments' },
      { status: 500 }
    );
  }
} 