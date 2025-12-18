export const otpEmailTemplate = ({ otp, expiresIn = 5 }) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>E-VOTE Email Verification</title>
  </head>

  <body style="margin:0; padding:0; background-color:#f4f6f8;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 0;">
          
          <!-- Card -->
          <table width="100%" max-width="500" cellpadding="0" cellspacing="0"
            style="background:#ffffff; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.08); font-family:Arial, Helvetica, sans-serif;">

            <!-- Header -->
            <tr>
              <td align="center" style="padding:30px 20px; background:#0f172a; border-radius:12px 12px 0 0;">
                <h1 style="color:#39FF14; margin:0; font-size:24px;">
                  E-VOTE SYSTEM
                </h1>
                <p style="color:#cbd5e1; margin:6px 0 0; font-size:13px;">
                  Secure Voter Portal
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px 24px; color:#1f2937;">
                <h2 style="margin-top:0; font-size:18px;">
                  Verify your email address
                </h2>

                <p style="font-size:14px; line-height:1.6;">
                  Thank you for registering on the <strong>E-VOTE SYSTEM</strong>.
                  Please use the One-Time Password (OTP) below to verify your email address.
                </p>

                <!-- OTP Box -->
                <div style="
                  margin:24px 0;
                  text-align:center;
                  background:#f0fdf4;
                  border:1px dashed #39FF14;
                  border-radius:8px;
                  padding:16px;
                ">
                  <p style="margin:0; font-size:13px; color:#065f46;">
                    Your verification code
                  </p>
                  <h1 style="
                    margin:8px 0 0;
                    font-size:32px;
                    letter-spacing:6px;
                    color:#065f46;
                  ">
                    ${otp}
                  </h1>
                </div>

                <p style="font-size:14px;">
                  ⏱️ This code will expire in <strong>${expiresIn || 5} minutes</strong>.
                </p>

                <p style="font-size:13px; color:#6b7280; margin-top:20px;">
                  If you did not initiate this request, please ignore this email.
                  For your security, do not share this OTP with anyone.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding:16px; background:#f8fafc; border-radius:0 0 12px 12px;">
                <p style="margin:0; font-size:12px; color:#9ca3af;">
                  © ${new Date().getFullYear()} E-VOTE SYSTEM. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
