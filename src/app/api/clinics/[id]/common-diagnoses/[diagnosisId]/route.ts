import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Clinic from '@/models/main/Clinic';
import { ICommonDiagnosis } from '@/types/CommonDiagnosis';

interface RouteParams {
  params: {
    id: string;
    diagnosisId: string;
  };
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id, diagnosisId } = params;
    const { name } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Diagnosis name is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const clinic = await Clinic.findOneAndUpdate(
      { 
        _id: id,
        'commonDiagnoses._id': diagnosisId 
      },
      { 
        $set: { 
          'commonDiagnoses.$.name': name.trim() 
        } 
      },
      { new: true }
    );

    if (!clinic) {
      return NextResponse.json(
        { error: 'Clinic or diagnosis not found' },
        { status: 404 }
      );
    }

    const diagnosis = clinic.commonDiagnoses.find(d => (d as any)._id.toString() === diagnosisId);
    return NextResponse.json(diagnosis);
  } catch (error) {
    console.error('Failed to update diagnosis:', error);
    return NextResponse.json(
      { error: 'Failed to update diagnosis' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id, diagnosisId } = params;

    await connectDB();

    const clinic = await Clinic.findOneAndUpdate(
      { _id: id },
      { 
        $pull: { 
          commonDiagnoses: { _id: diagnosisId } 
        } 
      },
      { new: true }
    );

    if (!clinic) {
      return NextResponse.json(
        { error: 'Clinic not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete diagnosis:', error);
    return NextResponse.json(
      { error: 'Failed to delete diagnosis' },
      { status: 500 }
    );
  }
} 