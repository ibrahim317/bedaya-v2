import { NextResponse } from "next/server";
import { Patient } from "@/models/main/Patient";
import { connectDB } from "@/lib/db";
import { PatientType } from "@/types/Patient";
import type { SortOrder } from "mongoose";
import { patientService } from "@/services/patientService";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    const type = searchParams.get("type") as PatientType;
    const search = searchParams.get("search") || "";
    const sortField = searchParams.get("sortField") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as SortOrder;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    // Build query
    const query: any = {};
    if (type) {
      query.type = type;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
        { mobileNumber: { $regex: search, $options: "i" } },
      ];
    }

    // Execute query with pagination and sorting
    const total = await Patient.countDocuments(query);
    const patients = await Patient.find(query)
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select("type name code sex age mobileNumber checkupDay createdAt labTest");

    return NextResponse.json({
      data: patients,
      pagination: {
        total,
        page,
        pageSize,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const patient = await patientService.createPatient(data);
    return NextResponse.json({ data: patient }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
} 