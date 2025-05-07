import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { supabase } from '@/lib/db';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-04-30.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const orderStatuses = {
  PENDING: "pending",
  PAYMENT_APPROVED: "payment_approved",
  PAYMENT_FAILED: "payment_failed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature')!;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Update order status
        await supabase
          .from('orders')
          .update({ 
            status: orderStatuses.PAYMENT_APPROVED,
            email: session.customer_email,
            stripe_session_id: session.id
          })
          .eq('id', session.metadata?.orderId);

        // Send email notification
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: session.customer_email,
            subject: 'Order Payment Confirmed',
            template: 'order-confirmation',
            data: {
              orderId: session.metadata?.orderId,
              amount: session.amount_total,
            }
          })
        });
        break;
      }
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        await supabase
          .from('orders')
          .update({ status: orderStatuses.CANCELLED })
          .eq('id', session.metadata?.orderId);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
} 