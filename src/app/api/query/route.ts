import { connectDB } from '@/lib/db';
import {
  getQueryResults,
  getCollectionSchema,
  getAvailableCollections,
} from '@/services/queryService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { collectionName, filters, fields, aggregation, groupBy } =
      await req.json();
    if (!collectionName) {
      return NextResponse.json(
        { message: 'Collection name is required' },
        { status: 400 }
      );
    }
    const results = await getQueryResults(
      collectionName,
      filters,
      fields,
      groupBy,
      aggregation
    );
    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const collectionName = url.searchParams.get('collection');

    if (collectionName) {
      const schema = await getCollectionSchema(collectionName);
      return NextResponse.json(schema);
    } else {
      const collections = getAvailableCollections();
      return NextResponse.json(collections);
    }
  } catch (error: any) {
    console.log("error", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
} 