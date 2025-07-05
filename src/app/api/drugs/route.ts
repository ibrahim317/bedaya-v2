import { NextRequest, NextResponse } from 'next/server';
import { drugService, DrugData } from '@/services/drugService';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');
    
        if (action === 'all') {
            const page = parseInt(searchParams.get('page') || '1', 10);
            const limit = parseInt(searchParams.get('limit') || '10', 10);
            const search = searchParams.get('search') || '';
            const paginatedData = await drugService.findAllPaginated(page, limit, search);
            return NextResponse.json(paginatedData);
        }
    
        if (action === 'byId') {
          const drugId = searchParams.get('drugId');
          if (!drugId) {
            return NextResponse.json({ error: 'Drug ID is required' }, { status: 400 });
          }
          const drug = await drugService.findById(drugId);
          return NextResponse.json(drug);
        }
        if (action === 'byName') {
          const name = searchParams.get('name');
          if (!name) {
            return NextResponse.json({ error: 'Drug name is required' }, { status: 400 });
          }
          const drug = await drugService.findByName(name);
          return NextResponse.json(drug);
        }
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
      } catch (error) {
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
      }
}

export async function DELETE(request: NextRequest) {
  try {
    
    const { drugId } = await request.json();
    
    if (!drugId) {
      return NextResponse.json(
        { error: 'Drug ID is required' },
        { status: 400 }
      );
    }

    await drugService.DeleteById(drugId);
    return NextResponse.json({ message: 'Drug deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete Drug' },
      { status: 500 }
    );
  }
} 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      barcode,          // barcode
      name,
      quantityByPills,       // number of strips
      stripsPerBox,     // strips per box
      pillsPerStrip,    // pills per strip
      sample = false,
      expiryDate,
    } = body;

    // Validate required fields
    if (!barcode || !name || !quantityByPills || !stripsPerBox || !pillsPerStrip || !expiryDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate data types
    if (
      typeof barcode !== 'string' ||
      typeof name !== 'string' ||
      typeof quantityByPills !== 'number' ||
      typeof stripsPerBox !== 'number' ||
      typeof pillsPerStrip !== 'number' ||
      typeof sample !== 'boolean' ||
      !expiryDate
    ) {
      return NextResponse.json(
        { error: 'Invalid data types' },
        { status: 400 }
      );
    }

    const data: DrugData = {
      barcode,
      name,
      quantityByPills,
      stripsPerBox,
      pillsPerStrip,
      sample,
      expiryDate: new Date(expiryDate),
    };

    const drug = await drugService.create(data);
    return NextResponse.json(drug);
  } catch (error) {
    if (error instanceof Error) {
      const errorMessage = error.message;
      
      // Check for specific errors
      if (errorMessage.includes('already exists')) {
        return NextResponse.json({ error: errorMessage }, { status: 409 });
      }
      
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 

