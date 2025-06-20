import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Report, { IReport } from '@/models/main/Report';

export async function GET() {
  try {
    await connectDB();
    const reports = await Report.find().sort({ createdAt: -1 });
    return NextResponse.json(reports);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body: { name: string; description: string; query: any } =
      await req.json();

    const { name, description, query } = body;

    if (!name || !description || !query) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newReport: IReport = new Report({
      name,
      description,
      query,
    });

    await newReport.save();

    return NextResponse.json(newReport, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { ids }: { ids: string[] } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: 'Report IDs are required' },
        { status: 400 }
      );
    }

    const result = await Report.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: 'No reports found with the given IDs' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `${result.deletedCount} reports deleted successfully`,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
} 