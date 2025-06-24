import { NextRequest, NextResponse } from 'next/server';
import { drugService, DrugData } from '@/services/drugService';

interface Params {
    params: {
      id: string;
    }
}

export async function PUT(request: NextRequest, { params }: Params) {
    try {
        const { id } = params;
        const body = await request.json();
        
        const updatedDrug = await drugService.update(id, body);
        if (!updatedDrug) {
            return NextResponse.json({ error: 'Drug not found' }, { status: 404 });
        }
        return NextResponse.json(updatedDrug);
    } catch (error) {
        console.error('Error updating drug:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        return NextResponse.json({ message: 'Failed to update drug', error: errorMessage }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        const { id } = params;
        await drugService.DeleteById(id);
        return NextResponse.json({ message: 'Drug deleted successfully' });
    } catch (error) {
        console.error('Error deleting drug:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        return NextResponse.json({ message: 'Failed to delete drug', error: errorMessage }, { status: 500 });
    }
} 