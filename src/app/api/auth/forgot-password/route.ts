import { NextRequest, NextResponse } from 'next/server';
import { PasswordResetService } from '@/services/passwordResetService';
import { verifyEmailConfig } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Check if email configuration is set up
    if (!verifyEmailConfig()) {
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    const { email } = await request.json();

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Request password reset
    const result = await PasswordResetService.requestPasswordReset(email);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
} 