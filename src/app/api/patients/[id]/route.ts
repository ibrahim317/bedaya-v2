import { NextRequest, NextResponse } from "next/server";
import { patientService } from "@/services/patientService";

const { getPatientById, updatePatientById, deletePatientById } = patientService;

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patient = await getPatientById(params.id);
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    return NextResponse.json(patient);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch patient" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const updated = await updatePatientById(params.id, data);
    if (!updated) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update patient" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deletePatientById(params.id);
    return NextResponse.json({ message: "Patient deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete patient" }, { status: 500 });
  }
} 