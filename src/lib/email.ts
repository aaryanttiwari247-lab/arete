import nodemailer from 'nodemailer';

export interface SendOtpResult {
  success: boolean;
  message: string;
  devMode?: boolean;
  devOtp?: string;
  error?: string;
}

/**
 * Generates an accessible, clean HTML email template for DayTrack OTP
 */
function buildOtpEmailHtml(otp: string, type: 'login' | 'signup', name?: string): string {
  const greeting = name ? `Hello ${name},` : 'Hello,';
  const actionText =
    type === 'signup'
      ? 'complete your DayTrack account creation'
      : 'log in to your DayTrack account';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your DayTrack Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #1e293b; border-radius: 16px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 36px 20px 36px; text-align: center; border-bottom: 1px solid #334155;">
              <table border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #f59e0b; width: 36px; height: 36px; border-radius: 10px; text-align: center; vertical-align: middle; color: #ffffff; font-weight: bold; font-size: 20px;">
                    ✦
                  </td>
                  <td style="padding-left: 12px; text-align: left;">
                    <div style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">DayTrack</div>
                    <div style="font-size: 11px; color: #94a3b8; letter-spacing: 0.5px; text-transform: uppercase;">Plan • Track • Improve</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px;">
              <div style="font-size: 16px; font-weight: 600; color: #f8fafc; margin-bottom: 8px;">
                ${greeting}
              </div>
              
              <div style="font-size: 14px; color: #cbd5e1; line-height: 1.6; margin-bottom: 24px;">
                Use the 6-digit verification code below to ${actionText}. This code will expire in <strong>10 minutes</strong>.
              </div>

              <!-- OTP Code Display Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: #090d16; border: 2px dashed #f59e0b; border-radius: 12px; padding: 18px 36px; text-align: center;">
                      <span style="font-family: 'SF Mono', Monaco, Menlo, Consolas, monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #fbbf24; text-shadow: 0 0 20px rgba(245, 158, 11, 0.4);">
                        ${otp}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <div style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin-top: 24px; text-align: center;">
                If you did not request this verification code, you can safely ignore this email. Someone may have typed your email address by mistake.
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 36px; background-color: #0f172a; border-top: 1px solid #334155; text-align: center;">
              <div style="font-size: 11px; color: #64748b;">
                DayTrack Productivity Platform • Secure Email Verification
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Sends the verification code to the target email address
 */
export async function sendOtpEmail(
  email: string,
  otp: string,
  type: 'login' | 'signup',
  name?: string
): Promise<SendOtpResult> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT || 587);
  const from = process.env.SMTP_FROM || '"DayTrack Security" <no-reply@daytrack.app>';

  // Check if SMTP is configured
  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      const subject =
        type === 'signup'
          ? `Verify your DayTrack account (${otp})`
          : `DayTrack login verification code: ${otp}`;

      await transporter.sendMail({
        from,
        to: email,
        subject,
        text: `Your DayTrack verification code is: ${otp}. It expires in 10 minutes.`,
        html: buildOtpEmailHtml(otp, type, name),
      });

      return {
        success: true,
        message: 'Verification code sent to your email address.',
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error('[DayTrack Email Error]', errorMsg);
      // Fallback to dev mode if SMTP fails
      return {
        success: true,
        devMode: true,
        devOtp: otp,
        message: 'SMTP delivery failed; verification code simulated in developer preview.',
      };
    }
  }

  // Developer Test Mode (When SMTP is not configured in .env.local)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`[DayTrack DEV OTP SIMULATION]`);
  console.log(`To:      ${email}`);
  console.log(`Type:    ${type.toUpperCase()}`);
  console.log(`Code:    👉 ${otp} 👈`);
  console.log(`Expires: 10 minutes`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  return {
    success: true,
    devMode: true,
    devOtp: otp,
    message: 'Verification code sent! (Running in developer mode)',
  };
}
