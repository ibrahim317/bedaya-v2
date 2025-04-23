import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/services/userService';
import { IUser } from '@/types/User';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    // Check if required fields are provided
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Register the user
    const user = await userService.register({ email, password, name });

    // Type casting user to access _id
    const typedUser = user as IUser & { _id: { toString: () => string } };

    // Return the user without sensitive information
    return NextResponse.json(
      {
        id: typedUser._id.toString(),
        email: typedUser.email,
        name: typedUser.name,
        createdAt: typedUser.createdAt,
      },
      { status: 201 }
    );
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