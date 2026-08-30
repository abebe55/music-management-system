import { BrevoClient } from '@getbrevo/brevo';
import nodemailer from 'nodemailer';
import { env } from '../../../config/env.config';
import { logger } from '../../../common/utils/logger';

export class EmailService {
  async sendOtpEmail(to: string, otp: string): Promise<void> {
    // ── Dev / test mode fallback ────────────────────────────────
    if (env.node.isTest) {
      logger.info(`[DEV] OTP for ${to}: ${otp}`);
      return;
    }

    const html = this.buildHtml(otp);
    const text = this.buildText(otp);
    const subject = `Your MusicFlow verification code: ${otp}`;

    // ── Strategy 1: Gmail SMTP (direct — no DMARC issues) ──────
    if (process.env.USE_GMAIL_SMTP === 'true' && env.email.user && env.email.pass && env.email.pass !== 'your_app_password_here') {
      await this.sendViaGmailSmtp(to, subject, html, text);
      return;
    }

    // ── Strategy 2: Brevo SDK ───────────────────────────────────
    const hasBrevoKey =
      !!env.email.brevoApiKey &&
      env.email.brevoApiKey !== 'your_brevo_api_key_here' &&
      env.email.brevoApiKey.length > 20;

    if (hasBrevoKey) {
      await this.sendViaBrevo(to, subject, html, text);
      return;
    }

    // ── Final fallback: log to console ──────────────────────────
    logger.info(`[DEV] OTP for ${to}: ${otp}`);
  }

  // ── Gmail SMTP ─────────────────────────────────────────────────
  private async sendViaGmailSmtp(
    to: string,
    subject: string,
    html: string,
    text: string,
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: env.email.user,
        pass: env.email.pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"${env.email.fromName}" <${env.email.user}>`,
      to,
      subject,
      html,
      text,
    });

    logger.info(`OTP email sent to ${to} via Gmail SMTP`, {
      messageId: info.messageId,
    });
  }

  // ── Brevo SDK ──────────────────────────────────────────────────
  private async sendViaBrevo(
    to: string,
    subject: string,
    html: string,
    text: string,
  ): Promise<void> {
    const brevo = new BrevoClient({ apiKey: env.email.brevoApiKey });

    const result = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: env.email.fromName,
        email: env.email.fromAddress,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      textContent: text,
    });

    logger.info(`OTP email sent to ${to} via Brevo`, {
      messageId: result.messageId,
    });
  }

  // ── Email templates ────────────────────────────────────────────
  private buildHtml(otp: string): string {
    const expiryMinutes = env.otp.expiresMinutes;
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 0;">
      <table width="480" cellpadding="0" cellspacing="0"
             style="background:#fff;border-radius:12px;padding:40px;
                    box-shadow:0 2px 8px rgba(0,0,0,.08);">
        <tr><td style="padding-bottom:20px;">
          <span style="font-size:22px;font-weight:bold;color:#6c63ff;">🎵 MusicFlow</span>
        </td></tr>
        <tr><td>
          <h2 style="margin:0 0 8px;font-size:20px;color:#1a1a2e;">Password Reset Code</h2>
          <p style="margin:0 0 24px;font-size:14px;color:#555;line-height:1.6;">
            We received a request to reset your MusicFlow account password.
            Use the code below to continue.
          </p>
        </td></tr>
        <tr><td align="center"
                style="background:#f0eeff;border-radius:8px;padding:28px;">
          <div style="font-size:44px;font-weight:bold;letter-spacing:14px;
                      color:#6c63ff;font-family:monospace;">${otp}</div>
        </td></tr>
        <tr><td style="padding-top:20px;">
          <p style="margin:0;font-size:13px;color:#888;line-height:1.8;">
            ⏱ Expires in <strong>${expiryMinutes} minutes</strong>.<br>
            🔒 Maximum 5 attempts.<br>
            🛡 If you did not request this, ignore this email.
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

  private buildText(otp: string): string {
    return [
      'MusicFlow — Password Reset Code',
      '',
      `Your verification code is: ${otp}`,
      '',
      `Expires in ${env.otp.expiresMinutes} minutes. Max 5 attempts.`,
      "If you did not request this, ignore this email.",
    ].join('\n');
  }
}
