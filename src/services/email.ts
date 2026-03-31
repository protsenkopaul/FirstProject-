import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';

export async function sendWelcomeEmail(to: string, username: string) {
  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: to,
    subject: 'Welcome to Our Platform!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333;">Welcome, ${username}!</h1>
        <p style="color: #666; font-size: 16px;">Thank you for registration!</p>
        <p style="color: #666; font-size: 14px;">We're excited to have you on board. Start exploring our platform today!</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">This is an automated message. Please do not reply.</p>
      </div>
    `,
  });

  if (error) {
    console.error('Failed to send welcome email:', error);
    throw new Error('Failed to send welcome email');
  }

  return data;
}
