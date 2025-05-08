import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";

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

// Helper function to update an order with payment data - direct database update
async function updateOrder(orderId: string, options: {
  status?: string;
  payment_status?: string;
  paymentIntent?: Stripe.PaymentIntent;
  stripe_session_id?: string;
}) {
  console.log(`Updating order ${orderId} directly in database`);
  
  try {
    // Create Supabase client
    const supabase = await createClient();
    
    // Build the update object based on what was provided
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Only add fields that were provided
    if (options.status) {
      updateData.status = options.status;
      console.log(`Setting order status to: ${options.status}`);
    }
    
    if (options.payment_status) {
      updateData.payment_status = options.payment_status;
      console.log(`Setting payment status to: ${options.payment_status}`);
    }
    
    if (options.stripe_session_id) {
      updateData.stripe_session_id = options.stripe_session_id;
      console.log(`Setting stripe session ID: ${options.stripe_session_id}`);
    }
    
    // Add payment intent if provided
    if (options.paymentIntent) {
      updateData.payment_intent = {
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
        updateData.payment_status = options.paymentIntent.status;
        console.log(`Setting payment status from intent: ${options.paymentIntent.status}`);
      }
    }
    
    console.log("Database update payload:", JSON.stringify(updateData));
    
    // Update the order in the database
    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Database update error:', error);
      throw new Error(`Failed to update order in database: ${error.message}`);
    }

    console.log(`Order ${orderId} successfully updated in database`);
    return data;
  } catch (error) {
    console.error('Error updating order:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
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
  console.log('STRIPE WEBHOOK: Request received');
  
  try {
    // Log the request method
    console.log(`STRIPE WEBHOOK: Request method: ${req.method}`);
    
    // Validate request method
    if (req.method !== 'POST') {
      console.log('STRIPE WEBHOOK: Invalid method, expected POST');
      return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }

    // Validate request body
    const body = await req.text();
    console.log(`STRIPE WEBHOOK: Request body length: ${body.length}`);
    
    if (!body) {
      console.log('STRIPE WEBHOOK: Empty request body');
      return NextResponse.json({ error: 'Empty request body' }, { status: 400 });
    }

    // Log the headers for debugging
    const headersList = await headers();
    console.log('STRIPE WEBHOOK: Headers received:', {
      'stripe-signature': headersList.get('stripe-signature') ? 'present' : 'missing',
      'content-type': headersList.get('content-type'),
    });
    
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('No Stripe signature found in webhook request');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    // Check environment variables
    console.log('STRIPE WEBHOOK: Checking environment variables');
    console.log('STRIPE_WEBHOOK_SECRET exists:', !!process.env.STRIPE_WEBHOOK_SECRET);
    console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
    
    if (!process.env.STRIPE_WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY) {
      console.error('Missing environment variables: STRIPE_WEBHOOK_SECRET or STRIPE_SECRET_KEY');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Verify webhook signature
    let event;
    try {
      console.log('STRIPE WEBHOOK: Constructing event from webhook data');
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      console.log(`STRIPE WEBHOOK: Event constructed successfully - ID: ${event.id}, Type: ${event.type}`);
      
      // Log some basic info about the event data
      if (event.data && event.data.object) {
        const obj = event.data.object as any;
        console.log('STRIPE WEBHOOK: Event data summary:', {
          object_type: obj.object,
          id: obj.id,
          status: obj.status,
          metadata: obj.metadata
        });
      }
    } catch (err) {
      console.error('STRIPE WEBHOOK: Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log(`Webhook event received: ${event.type} (${event.id})`);

    // Handle different event types
    let result;
    let handlerName = 'none';
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('STRIPE WEBHOOK: Payment succeeded event received');
        handlerName = 'handlePaymentIntent';
        result = await handlePaymentIntent(event);
        break;
        
      case 'payment_intent.payment_failed':
        console.log('STRIPE WEBHOOK: Payment failed event received');
        // Log the full event for debugging purposes
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('STRIPE WEBHOOK: Full payment intent data:', JSON.stringify({
          id: failedPaymentIntent.id,
          status: failedPaymentIntent.status,
          error: failedPaymentIntent.last_payment_error,
          metadata: failedPaymentIntent.metadata
        }));
        
        handlerName = 'handlePaymentIntent';
        result = await handlePaymentIntent(event);
        break;
        
      case 'payment_intent.canceled':
        console.log('STRIPE WEBHOOK: Payment canceled event received');
        handlerName = 'handlePaymentIntent';
        result = await handlePaymentIntent(event);
        break;

      case 'checkout.session.completed':
        console.log('STRIPE WEBHOOK: Checkout session completed event received');
        handlerName = 'handleCheckoutSession';
        result = await handleCheckoutSession(event);
        break;
        
      default:
        console.log(`STRIPE WEBHOOK: Unhandled event type: ${event.type}`);
        
        // If the event has an order ID in metadata, try to extract and log it
        const eventObject = event.data.object as any;
        if (eventObject.metadata && eventObject.metadata.orderId) {
          console.log(`STRIPE WEBHOOK: Found order ID ${eventObject.metadata.orderId} in unhandled event`);
          
          // For now, just log this but we could handle these events in the future
          // This helps with debugging what other events we might want to handle
        }
    }

    console.log('STRIPE WEBHOOK: Webhook processed successfully');
    return NextResponse.json({ 
      received: true, 
      event_type: event.type,
      handler_used: handlerName,
      processed: !!result,
      timestamp: new Date().toISOString()
    });
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
