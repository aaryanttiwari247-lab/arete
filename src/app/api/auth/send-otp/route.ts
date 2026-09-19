import { NextRequest, NextResponse } from 'next/server';
import { createOtp } from '@/lib/otpStore';
import { sendOtpEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, type = 'login', name } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    if (type !== 'login' && type !== 'signup') {
      return NextResponse.json(
        { success: false, error: "Type must be either 'login' or 'signup'." },
        { status: 400 }
      );
    }

    // Generate and store OTP in memory store
    const otpResult = createOtp(email, type, name);
    if (!otpResult.success || !otpResult.code) {
      return NextResponse.json(
        { success: false, error: otpResult.error || 'Failed to generate verification code.' },
        { status: 429 }
      );
    }

    // Send email (or dev simulation)
    const emailResult = await sendOtpEmail(email, otpResult.code, type, name);

    return NextResponse.json({
      success: true,
      message: emailResult.message,
      devMode: emailResult.devMode,
      // Provide devOtp when SMTP is not configured so user can easily test in development
      devOtp: emailResult.devMode ? emailResult.devOtp : undefined,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
