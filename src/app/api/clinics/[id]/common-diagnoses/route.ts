import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Clinic from '@/models/main/Clinic';
import { ICommonDiagnosis } from '@/types/CommonDiagnosis';

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
        { error: 'Diagnosis name is required' },
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

    const diagnosis: ICommonDiagnosis = {
      name: name.trim(),
    };

    clinic.commonDiagnoses.push(diagnosis);
    await clinic.save();

    return NextResponse.json(diagnosis, { status: 201 });
  } catch (error) {
    console.error('Failed to add diagnosis:', error);
    return NextResponse.json(
      { error: 'Failed to add diagnosis' },
      { status: 500 }
    );
  }
}

// Bulk add diagnoses
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const { names } = await request.json();

    if (!Array.isArray(names) || names.length === 0) {
      return NextResponse.json(
        { error: 'At least one diagnosis name is required' },
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

    const diagnoses: ICommonDiagnosis[] = names
      .map(name => name?.trim())
      .filter(Boolean)
      .map(name => ({ name }));

    clinic.commonDiagnoses.push(...diagnoses);
    await clinic.save();

    return NextResponse.json(diagnoses, { status: 201 });
  } catch (error) {
    console.error('Failed to add diagnoses:', error);
    return NextResponse.json(
      { error: 'Failed to add diagnoses' },
      { status: 500 }
    );
  }
} 