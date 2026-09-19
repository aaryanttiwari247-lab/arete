import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/otpStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp, type = 'login', name } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    if (!otp || typeof otp !== 'string' || otp.trim().length !== 6) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 6-digit verification code.' },
        { status: 400 }
      );
    }

    if (type !== 'login' && type !== 'signup') {
      return NextResponse.json(
        { success: false, error: "Type must be either 'login' or 'signup'." },
        { status: 400 }
      );
    }

    // Verify code
    const verification = verifyOtp(email, otp.trim(), type);
    if (!verification.success) {
      return NextResponse.json(
        { success: false, error: verification.error || 'Verification failed.' },
        { status: 400 }
      );
    }

    const resolvedName = name || verification.name || email.split('@')[0];

    // Generate authenticated session response
    const mockToken = `daytrack_tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    return NextResponse.json({
      success: true,
      message: 'Email successfully verified.',
      token: mockToken,
      user: {
        id: `usr_${Date.now()}`,
        name: resolvedName,
        email: email.toLowerCase().trim(),
        avatar: '',
        bio: 'Focused productivity enthusiast',
        targetStudyMinutesPerDay: 180,
        targetWorkoutMinutesPerDay: 45,
        targetSleepMinutesPerDay: 480,
        emailVerified: true,
        joinedAt: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
