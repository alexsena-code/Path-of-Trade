import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

// Helper function to get appropriate order status from payment event type
function getOrderStatusFromEvent(eventType: string): string {
  switch (eventType) {
    case 'payment_intent.succeeded':
      return 'waiting_delivery';
    case 'payment_intent.payment_failed':
      return 'failed';
    case 'payment_intent.canceled':
      return 'canceled';
    default:
      return 'processing';
  }
}

// Helper function to update an order with payment data
async function updateOrder(orderId: string, options: {
  status?: string;
  payment_status?: string;
  paymentIntent?: Stripe.PaymentIntent;
  stripe_session_id?: string;
}) {
  console.log(`Updating order ${orderId} via API`);
  
  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    throw new Error('NEXT_PUBLIC_SITE_URL is not defined in environment variables');
  }
  
  // Construct the API endpoint URL using the site URL from environment variables
  const updateEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/orders/update`;
  
  // Build request body with only the properties that are provided
  const requestBody: any = { orderId };
  
  // Add overall order status if provided
  if (options.status) {
    requestBody.status = options.status;
    console.log(`Setting order status to: ${options.status}`);
  }
  
  // Add payment status if provided
  if (options.payment_status) {
    requestBody.payment_status = options.payment_status;
    console.log(`Setting payment status to: ${options.payment_status}`);
  }
  
  // Add stripe session ID if provided
  if (options.stripe_session_id) {
    requestBody.stripe_session_id = options.stripe_session_id;
    console.log(`Setting stripe session ID: ${options.stripe_session_id}`);
  }
  
  // Add payment intent if provided
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
    console.log(`Including payment intent: ${options.paymentIntent.id}`);
    
    // If payment_status is not explicitly set but we have a paymentIntent,
    // use the payment intent status as payment_status
    if (!options.payment_status) {
      requestBody.payment_status = options.paymentIntent.status;
      console.log(`Setting payment status from intent: ${options.paymentIntent.status}`);
    }
  }
  
  console.log("Request payload:", JSON.stringify(requestBody));
  
  const response = await fetch(updateEndpoint, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  let responseData;
  try {
    responseData = await response.json();
    console.log(`API response status: ${response.status}, data:`, responseData);
  } catch (e) {
    const text = await response.text();
    console.log(`API response status: ${response.status}, text:`, text);
    responseData = { text };
  }
  
  if (!response.ok) {
    console.error('Failed to update order:', responseData);
    throw new Error(`Failed to update order: API returned ${response.status}`);
  }

  console.log(`Order ${orderId} successfully updated`);
  return responseData;
}

// Process payment intent events
async function handlePaymentIntent(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const orderId = paymentIntent.metadata?.orderId;

  if (!orderId) {
    throw new Error(`No order ID in payment intent metadata: ${paymentIntent.id}`);
  }

  console.log(`Processing payment intent: ${paymentIntent.id} for order: ${orderId}, event: ${event.type}, status: ${paymentIntent.status}`);
  
  // Determine appropriate order status based on the event type AND payment intent status
  let orderStatus;
  
  if (event.type === 'payment_intent.payment_failed') {
    // For failed payments, set order status to failed regardless of payment intent status
    orderStatus = 'failed';
    console.log(`Payment failed for order ${orderId}. Payment status: ${paymentIntent.status}`);
    
    // Log additional error details if available
    if (paymentIntent.last_payment_error) {
      console.log('Payment error details:', {
        code: paymentIntent.last_payment_error.code,
        message: paymentIntent.last_payment_error.message,
        decline_code: paymentIntent.last_payment_error.decline_code
      });
    }
  } else {
    // For other events, get status from event type
    orderStatus = getOrderStatusFromEvent(event.type);
  }
  
  // Update with both status and payment status
  return await updateOrder(orderId, {
    status: orderStatus,
    payment_status: paymentIntent.status,
    paymentIntent: paymentIntent
  });
}

// For status-only updates (no payment data needed)
async function updateOrderStatus(orderId: string, status: string) {
  return await updateOrder(orderId, { status });
}

// For payment-status updates (no order status change)
async function updatePaymentStatus(orderId: string, paymentStatus: string) {
  return await updateOrder(orderId, { payment_status: paymentStatus });
}

// Process checkout session events
async function handleCheckoutSession(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;
  
  if (!orderId) {
    throw new Error(`No order ID in session metadata: ${session.id}`);
  }

  if (!session.payment_intent) {
    throw new Error(`No payment intent in session: ${session.id}`);
  }

  // Get payment intent details
  const paymentIntent = typeof session.payment_intent === 'string'
    ? await stripe.paymentIntents.retrieve(session.payment_intent)
    : session.payment_intent;

  console.log(`Processing checkout session: ${session.id} for order: ${orderId}, payment: ${paymentIntent.id}`);
  
  // For checkout sessions completed, we typically want to set to 'waiting_delivery' if the payment succeeded
  let statusOverride = null;
  if (event.type === 'checkout.session.completed' && paymentIntent.status === 'succeeded') {
    statusOverride = 'waiting_delivery';
  }
  
  return await updateOrder(
    orderId, 
    {
      status: statusOverride || getOrderStatusFromEvent(paymentIntent.status),
      payment_status: paymentIntent.status,
      paymentIntent: paymentIntent,
      stripe_session_id: session.id
    }
  );
}

export async function POST(req: Request) {
  try {
    // Validate request method
    if (req.method !== 'POST') {
      return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }

    // Validate request body
    const body = await req.text();
    if (!body) {
      return NextResponse.json({ error: 'Empty request body' }, { status: 400 });
    }

    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('No Stripe signature found in webhook request');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY) {
      console.error('Missing environment variables: STRIPE_WEBHOOK_SECRET or STRIPE_SECRET_KEY');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log(`Webhook event received: ${event.type} (${event.id})`);

    // Handle different event types
    let result;
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Payment succeeded event received');
        result = await handlePaymentIntent(event);
        break;
        
      case 'payment_intent.payment_failed':
        console.log('Payment failed event received');
        // Log the full event for debugging purposes
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Full payment intent data:', JSON.stringify({
          id: failedPaymentIntent.id,
          status: failedPaymentIntent.status,
          error: failedPaymentIntent.last_payment_error,
          metadata: failedPaymentIntent.metadata
        }));
        
        result = await handlePaymentIntent(event);
        break;
        
      case 'payment_intent.canceled':
        console.log('Payment canceled event received');
        result = await handlePaymentIntent(event);
        break;

      case 'checkout.session.completed':
        console.log('Checkout session completed event received');
        result = await handleCheckoutSession(event);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    console.log('Webhook processed successfully');
    return NextResponse.json({ received: true, processed: !!result });
  } catch (error) {
    console.error('Webhook error:', error instanceof Error ? error.message : 'Unknown error', 
      error instanceof Error && error.stack ? error.stack : '');
    
    return NextResponse.json(
      { 
        error: 'Webhook handler failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}
