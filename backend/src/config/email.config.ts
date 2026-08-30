/**
 * Email configuration.
 *
 * The application uses Brevo (formerly Sendinblue) for transactional email
 * via sib-api-v3-sdk. Configuration is read from env.email.brevoApiKey.
 *
 * If BREVO_API_KEY is not set (dev without credentials), the email service
 * falls back to logging the OTP to the console instead of sending it.
 *
 * Set in .env:
 *   BREVO_API_KEY=your_brevo_api_key_here
 *   SMTP_USER=your_verified_sender@example.com  ← used as the "from" address
 */

export const emailConfig = {
  // Brevo "from" address — must match a verified sender in your Brevo account
  fromName: process.env.EMAIL_FROM_NAME ?? 'MusicFlow',
  fromAddress: process.env.EMAIL_FROM_ADDRESS ?? process.env.SMTP_USER ?? 'noreply@musicflow.com',
} as const;
