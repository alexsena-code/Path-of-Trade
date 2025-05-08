import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

// Helper function to get order status from payment intent status
function getOrderStatusFromPaymentStatus(paymentStatus: string): string {
  switch (paymentStatus) {
    case 'succeeded':
      return 'waiting_delivery';
    case 'requires_payment_method':
    case 'requires_confirmation':
    case 'requires_action':
      return 'processing';
    case 'canceled':
      return 'canceled';
    case 'failed':
    default:
      return 'failed';
  }
}

// Unified order update function
async function updateOrder(baseUrl: string, orderId: string, options: {
  status?: string;
  payment_status?: string;
  paymentIntent?: Stripe.PaymentIntent;
  stripe_session_id?: string;
}) {
  const updateEndpoint = `${baseUrl}/api/orders/update`;
  const requestBody: any = { orderId };

  console.log(`Updating order ${orderId} with:`, options);

  if (options.status) requestBody.status = options.status;
  if (options.payment_status) requestBody.payment_status = options.payment_status;
  if (options.stripe_session_id) requestBody.stripe_session_id = options.stripe_session_id;

  if (options.paymentIntent) {
    requestBody.paymentIntent = {
      id: options.paymentIntent.id,
      status: options.paymentIntent.status,
      amount: options.paymentIntent.amount,
      currency: options.paymentIntent.currency,
      customer: options.paymentIntent.customer,
      payment_method: options.paymentIntent.payment_method,
      created: options.paymentIntent.created,
      metadata: options.paymentIntent.metadata,
      receipt_email: options.paymentIntent.receipt_email,
    };
  }

  try {
    const response = await fetch(updateEndpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Order update failed:', error);
    throw error;
  }
}

// Checkout session handler
async function handleCheckoutSession(event: Stripe.Event, baseUrl: string) {
  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;

  if (!orderId) {
    throw new Error(`Missing order ID in session: ${session.id}`);
  }

  // Retrieve latest payment intent status
  const paymentIntent = await stripe.paymentIntents.retrieve(
    session.payment_intent as string
  );

  console.log(`Checkout session ${session.id} processed`, {
    paymentStatus: paymentIntent.status,
    orderId
  });

  return updateOrder(baseUrl, orderId, {
    status: getOrderStatusFromPaymentStatus(paymentIntent.status),
    payment_status: paymentIntent.status,
    paymentIntent: paymentIntent,
    stripe_session_id: session.id
  });
}

// Payment failure handler
async function handlePaymentFailure(event: Stripe.Event, baseUrl: string) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const orderId = paymentIntent.metadata?.orderId;

  if (!orderId) {
    throw new Error(`Missing order ID in payment intent: ${paymentIntent.id}`);
  }

  console.error(`Payment failed for order ${orderId}`, {
    error: paymentIntent.last_payment_error,
    status: paymentIntent.status
  });

  return updateOrder(baseUrl, orderId, {
    status: 'failed',
    payment_status: 'failed',
    paymentIntent: paymentIntent
  });
}

// Main webhook handler
export async function PATCH(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    const baseUrl = new URL(req.url).origin;

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSession(event, baseUrl);
        break;

      case 'payment_intent.payment_failed': 
        await handlePaymentFailure(event, baseUrl);
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await updateOrder(baseUrl, paymentIntent.metadata.orderId, {
          status: 'waiting_delivery',
          payment_status: 'succeeded',
          paymentIntent: paymentIntent
        });
        break;

      default:
        console.warn(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing failed:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed', details: (error as Error).message },
      { status: 400 }
    );
  }
}