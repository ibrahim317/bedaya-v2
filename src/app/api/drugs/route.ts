import { NextRequest,NextResponse } from 'next/server';
import { drugService,DrugData} from '@/services/drugService';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');
    
        if (action === 'all') {
          const drugs = await drugService.findAll();
          return NextResponse.json(drugs);
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
  console.log('Parsed JSON:', await req.json());
  try {
    const {drugId ,name,Quantity,stripInTHeBox,sample,ExpiryDate} = await req.json();
    // Check if required fields are provided
    if (
      typeof drugId !== 'string' ||
      typeof name !== 'string' ||
      typeof Quantity !== 'number' ||
      typeof stripInTHeBox !== 'number' ||
      typeof sample !== 'boolean' ||
      typeof ExpiryDate !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Invalid data types or missing fields' },
        { status: 400 }
      );
    }
    const data: DrugData = {drugId, name, Quantity, stripInTHeBox, sample, ExpiryDate: new Date(ExpiryDate)} as DrugData;
    const d:DrugData =  {
      "drugId": '2',
      "name": 'para',
      "Quantity": 2,
      "stripInTHeBox": 2,
      "sample": false,
      "ExpiryDate":new Date('2023-10-10'),
    }as DrugData;

    const drug = await drugService.create(d);

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

