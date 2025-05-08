import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

// Helper function to map Stripe status to our order status
function mapStripeStatusToOrderStatus(stripeStatus: string): 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed' {
  switch (stripeStatus) {
    case 'succeeded':
      return 'completed';
    case 'processing':
      return 'processing';
    case 'canceled':
      return 'cancelled';
    case 'failed':
      return 'failed';
    default:
      return 'pending';
  }
}

export async function POST(req: Request) {
  try {
    console.log('Webhook endpoint hit');
    
    // Validate request method
    if (req.method !== 'POST') {
      console.error('Invalid method:', req.method);
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

    // Validate request body
    const body = await req.text();
    if (!body) {
      console.error('Empty request body');
      return NextResponse.json(
        { error: 'Empty request body' },
        { status: 400 }
      );
    }

    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    console.log('Webhook request details:', {
      method: req.method,
      url: req.url,
      hasBody: !!body,
      hasSignature: !!signature,
      headers: Object.fromEntries(headersList.entries())
    });

    if (!signature) {
      console.error('Missing Stripe signature');
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('Missing STRIPE_WEBHOOK_SECRET');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Missing STRIPE_SECRET_KEY');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
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
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log('Webhook event details:', {
      type: event.type,
      id: event.id,
      created: event.created
    });

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
      case 'payment_intent.payment_failed':
      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;

        if (!orderId) {
          console.error('No order ID in payment intent metadata:', paymentIntent.id);
          return NextResponse.json(
            { error: 'No order ID found' },
            { status: 400 }
          );
        }

        console.log('Processing payment intent:', {
          type: event.type,
          paymentIntentId: paymentIntent.id,
          orderId,
          status: paymentIntent.status
        });

        // Call the orders update API
        const response = await fetch('/api/orders/update', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            status: mapStripeStatusToOrderStatus(paymentIntent.status),
            paymentIntent: {
              id: paymentIntent.id,
              status: paymentIntent.status,
              amount: paymentIntent.amount,
              currency: paymentIntent.currency,
              customer: paymentIntent.customer,
              payment_method: paymentIntent.payment_method,
              created: paymentIntent.created,
              metadata: paymentIntent.metadata,
              receipt_email: paymentIntent.receipt_email,
              description: paymentIntent.description,
              last_payment_error: paymentIntent.last_payment_error,
              next_action: paymentIntent.next_action,
              shipping: paymentIntent.shipping,
              amount_received: paymentIntent.amount_received,
              amount_capturable: paymentIntent.amount_capturable,
              amount_details: paymentIntent.amount_details,
              application: paymentIntent.application,
              application_fee_amount: paymentIntent.application_fee_amount,
              automatic_payment_methods: paymentIntent.automatic_payment_methods,
              canceled_at: paymentIntent.canceled_at,
              cancellation_reason: paymentIntent.cancellation_reason,
              capture_method: paymentIntent.capture_method,
              client_secret: paymentIntent.client_secret,
              confirmation_method: paymentIntent.confirmation_method,
              payment_method_types: paymentIntent.payment_method_types,
              processing: paymentIntent.processing,
              setup_future_usage: paymentIntent.setup_future_usage,
              transfer_data: paymentIntent.transfer_data,
              transfer_group: paymentIntent.transfer_group,
            }
          })
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('Failed to update order:', error);
          return NextResponse.json(
            { error: 'Failed to update order' },
            { status: response.status }
          );
        }

        console.log('Successfully updated order:', {
          orderId,
          status: paymentIntent.status
        });
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;
        
        if (!orderId) {
          console.error('No order ID in session metadata:', session.id);
          return NextResponse.json(
            { error: 'No order ID found' },
            { status: 400 }
          );
        }

        if (!session.payment_intent) {
          console.error('No payment intent in session:', session.id);
          return NextResponse.json(
            { error: 'No payment intent found' },
            { status: 400 }
          );
        }

        // Get payment intent status
        const paymentIntent = typeof session.payment_intent === 'string'
          ? await stripe.paymentIntents.retrieve(session.payment_intent)
          : session.payment_intent;

        console.log('Processing checkout session:', {
          sessionId: session.id,
          orderId,
          paymentIntentId: paymentIntent.id,
          status: paymentIntent.status
        });

        // Call the orders update API
        const response = await fetch('/api/orders/update', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            paymentIntent: {
              id: paymentIntent.id,
              status: paymentIntent.status,
              amount: paymentIntent.amount,
              currency: paymentIntent.currency,
              customer: paymentIntent.customer,
              payment_method: paymentIntent.payment_method,
              created: paymentIntent.created,
              metadata: paymentIntent.metadata,
              receipt_email: paymentIntent.receipt_email,
              description: paymentIntent.description,
              last_payment_error: paymentIntent.last_payment_error,
              next_action: paymentIntent.next_action,
              shipping: paymentIntent.shipping,
              amount_received: paymentIntent.amount_received,
              amount_capturable: paymentIntent.amount_capturable,
              amount_details: paymentIntent.amount_details,
              application: paymentIntent.application,
              application_fee_amount: paymentIntent.application_fee_amount,
              automatic_payment_methods: paymentIntent.automatic_payment_methods,
              canceled_at: paymentIntent.canceled_at,
              cancellation_reason: paymentIntent.cancellation_reason,
              capture_method: paymentIntent.capture_method,
              client_secret: paymentIntent.client_secret,
              confirmation_method: paymentIntent.confirmation_method,
              payment_method_types: paymentIntent.payment_method_types,
              processing: paymentIntent.processing,
              setup_future_usage: paymentIntent.setup_future_usage,
              transfer_data: paymentIntent.transfer_data,
              transfer_group: paymentIntent.transfer_group,
            }
          })
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('Failed to update order:', error);
          return NextResponse.json(
            { error: 'Failed to update order' },
            { status: response.status }
          );
        }

        console.log('Successfully updated order:', {
          orderId,
          status: paymentIntent.status
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: error
    });

    // Return more detailed error response
    return NextResponse.json(
      { 
        error: 'Webhook handler failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 400 }
    );
  }
}
