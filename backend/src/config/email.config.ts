export const emailConfig = {
  fromName: process.env.EMAIL_FROM_NAME ?? 'MusicFlow',
  fromAddress: process.env.EMAIL_FROM_ADDRESS ?? process.env.SMTP_USER ?? 'noreply@musicflow.com',
} as const;
