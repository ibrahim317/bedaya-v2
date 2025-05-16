import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Clinic from '@/models/main/Clinic';
import { ICommonTreatment } from '@/types/CommonTreatment';

interface RouteParams {
  params: {
    id: string;
    treatmentId: string;
  };
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id, treatmentId } = params;
    const { name } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Treatment name is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const clinic = await Clinic.findOneAndUpdate(
      { 
        _id: id,
        'commonTreatments._id': treatmentId 
      },
      { 
        $set: { 
          'commonTreatments.$.name': name.trim() 
        } 
      },
      { new: true }
    );

    if (!clinic) {
      return NextResponse.json(
        { error: 'Clinic or treatment not found' },
        { status: 404 }
      );
    }

    const treatment = clinic.commonTreatments.find(t => (t as any)._id.toString() === treatmentId);
    return NextResponse.json(treatment);
  } catch (error) {
    console.error('Failed to update treatment:', error);
    return NextResponse.json(
      { error: 'Failed to update treatment' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id, treatmentId } = params;

    await connectDB();

    const clinic = await Clinic.findOneAndUpdate(
      { _id: id },
      { 
        $pull: { 
          commonTreatments: { _id: treatmentId } 
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
    console.error('Failed to delete treatment:', error);
    return NextResponse.json(
      { error: 'Failed to delete treatment' },
      { status: 500 }
    );
  }
} 