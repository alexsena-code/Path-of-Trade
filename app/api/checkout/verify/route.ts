import Stripe from "stripe";
import { NextResponse } from "next/server";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-04-30.basil",
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer']
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_email,
      amount_total: session.amount_total,
      metadata: session.metadata,
    });
  } catch (error) {
    console.error('Error verifying session:', error);
    return NextResponse.json(
      { error: 'Error verifying session' },
      { status: 500 }
    );
  }
} 