import { NextRequest, NextResponse } from "next/server";
import { updatePatientLabTest } from "@/services/patientService";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patientId = params.id;
    const body = await req.json();
    const { labTestName, status, results } = body;

    if (!labTestName || !status) {
      return NextResponse.json(
        { message: "Missing labTestName or status" },
        { status: 400 }
      );
    }

    const updatedPatient = await updatePatientLabTest(
      patientId,
      labTestName,
      status,
      results
    );

    return NextResponse.json(updatedPatient, { status: 200 });
  } catch (error: any) {
    console.log("error", error);
    return NextResponse.json(
      { message: "Failed to update lab test status", error: error.message },
      { status: 500 }
    );
  }
} 