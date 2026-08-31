import { BrevoClient } from '@getbrevo/brevo';
import { env } from '../../../config/env.config';
import { logger } from '../../../common/utils/logger';

export class EmailService {
  async sendOtpEmail(to: string, otp: string): Promise<void> {
    const expiryMinutes = env.otp.expiresMinutes;

    // ── Dev / test: log to console, never call external services ─
    if (env.node.isTest || !this.hasBrevoKey()) {
      logger.info(`[DEV] OTP for ${to}: ${otp}`);
      return;
    }

    // ── Production: Brevo transactional email ────────────────────
    const brevo = new BrevoClient({ apiKey: env.email.brevoApiKey });

    try {
      const result = await brevo.transactionalEmails.sendTransacEmail({
        sender: {
          name: env.email.fromName,
          email: env.email.fromAddress,
        },
        to: [{ email: to }],
        subject: `Your MusicFlow verification code: ${otp}`,
        htmlContent: this.buildHtml(otp, expiryMinutes),
        textContent: this.buildText(otp, expiryMinutes),
      });

      logger.info(`OTP email sent to ${to} via Brevo`, {
        messageId: result.messageId,
      });
    } catch (error) {
      logger.error(`Failed to send OTP email to ${to}:`, error);
      throw error;
    }
  }

  private hasBrevoKey(): boolean {
    return (
      !!env.email.brevoApiKey &&
      env.email.brevoApiKey !== 'your_brevo_api_key_here' &&
      env.email.brevoApiKey.length > 20
    );
  }

  private buildHtml(otp: string, expiryMinutes: number): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 0;">
      <table width="480" cellpadding="0" cellspacing="0"
             style="background:#fff;border-radius:12px;padding:40px;box-shadow:0 2px 8px rgba(0,0,0,.08);">
        <tr><td style="padding-bottom:20px;">
          <span style="font-size:22px;font-weight:bold;color:#6c63ff;">🎵 MusicFlow</span>
        </td></tr>
        <tr><td>
          <h2 style="margin:0 0 8px;font-size:20px;color:#1a1a2e;">Password Reset Code</h2>
          <p style="margin:0 0 24px;font-size:14px;color:#555;line-height:1.6;">
            Use the code below to reset your MusicFlow account password.
          </p>
        </td></tr>
        <tr><td align="center" style="background:#f0eeff;border-radius:8px;padding:28px;">
          <div style="font-size:44px;font-weight:bold;letter-spacing:14px;color:#6c63ff;font-family:monospace;">
            ${otp}
          </div>
        </td></tr>
        <tr><td style="padding-top:20px;">
          <p style="margin:0;font-size:13px;color:#888;line-height:1.8;">
            ⏱ Expires in <strong>${expiryMinutes} minutes</strong>.<br>
            🔒 Maximum 5 attempts before the code is locked.<br>
            🛡 If you didn't request this, ignore this email — your account is safe.
          </p>
        </td></tr>
        <tr><td style="padding-top:28px;text-align:center;border-top:1px solid #f0f0f0;">
          <p style="margin:0;font-size:12px;color:#bbb;">
            © ${new Date().getFullYear()} MusicFlow. Automated message — do not reply.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
  }

  private buildText(otp: string, expiryMinutes: number): string {
    return [
      'MusicFlow — Password Reset Code',
      '',
      `Your verification code is: ${otp}`,
      '',
      `Expires in ${expiryMinutes} minutes. Max 5 attempts.`,
      "If you didn't request this, ignore this email.",
    ].join('\n');
  }
}
