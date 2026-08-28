import { getEmailTransporter, emailConfig } from '../../../config/email.config';
import { logger } from '../../../common/utils/logger';
import { env } from '../../../config/env.config';

export class EmailService {
  async sendOtpEmail(to: string, otp: string): Promise<void> {
    // In test/dev without SMTP, just log the OTP
    if (env.node.isTest || !env.email.user) {
      logger.info(`[DEV] OTP for ${to}: ${otp}`);
      return;
    }

    const transporter = getEmailTransporter();
    const expiryMinutes = env.otp.expiresMinutes;

    await transporter.sendMail({
      from: emailConfig.from,
      to,
      subject: 'Your MusicFlow Password Reset Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
            .container { max-width: 480px; margin: 40px auto; background: #fff; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
            .logo { font-size: 24px; font-weight: bold; color: #6c63ff; margin-bottom: 24px; }
            .otp-box { background: #f0eeff; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0; }
            .otp-code { font-size: 42px; font-weight: bold; letter-spacing: 12px; color: #6c63ff; }
            .note { color: #888; font-size: 13px; margin-top: 16px; }
            .footer { color: #bbb; font-size: 12px; margin-top: 32px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🎵 MusicFlow</div>
            <h2 style="color:#222;margin-bottom:8px">Password Reset Code</h2>
            <p style="color:#555">We received a request to reset your password. Use the code below:</p>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
            </div>
            <p class="note">This code expires in <strong>${expiryMinutes} minutes</strong>.</p>
            <p class="note">If you didn't request this, please ignore this email. Your account is safe.</p>
            <div class="footer">© ${new Date().getFullYear()} MusicFlow. All rights reserved.</div>
          </div>
        </body>
        </html>
      `,
      text: `Your MusicFlow password reset code is: ${otp}\n\nThis code expires in ${expiryMinutes} minutes.`,
    });
  }
}
