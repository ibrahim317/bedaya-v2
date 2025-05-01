import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function PATCH() {
  try {
    // Check authentication and admin status
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Update all unverified users
    const result = await User.updateMany(
      { verified: false },
      { verified: true }
    );

    // Fetch updated users
    const updatedUsers = await User.find({ verified: true })
      .select('-password')
      .lean();

    return NextResponse.json({
      message: `${result.modifiedCount} users verified successfully`,
      users: updatedUsers
    });
  } catch (error) {
    console.error('Error verifying all users:', error);
    return NextResponse.json(
      { error: 'Failed to verify users' },
      { status: 500 }
    );
  }
} 