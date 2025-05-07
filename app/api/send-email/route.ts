import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { to, subject, template, data } = await req.json();

    const emailContent = {
      orderConfirmation: `
        <h1>Order Confirmation</h1>
        <p>Thank you for your order!</p>
        <p>Order ID: ${data.orderId}</p>
        <p>Amount: $${data.amount / 100}</p>
      `,
      orderStatusUpdate: `
        <h1>Order Status Update</h1>
        <p>Your order status has been updated.</p>
        <p>Order ID: ${data.orderId}</p>
        <p>New Status: ${data.status}</p>
      `,
    };

    await resend.emails.send({
      from: 'orders@yourdomain.com',
      to,
      subject,
      html: emailContent[template as keyof typeof emailContent],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 