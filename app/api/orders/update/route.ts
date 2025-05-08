import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Define valid order statuses
const validStatuses = [
  'pending',
  'processing',
  'completed',
  'cancelled',
  'failed'
] as const;

type OrderStatus = typeof validStatuses[number];

export async function PATCH(req: Request) {
  try {
    const { orderId, status, paymentIntent } = await req.json();

    console.log('Received order update request:', {
      orderId,
      status,
      hasPaymentIntent: !!paymentIntent
    });

    // Validate required fields
    if (!orderId) {
      console.error('Missing orderId in request');
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    if (!status) {
      console.error('Missing status in request');
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status
    if (!validStatuses.includes(status as OrderStatus)) {
      console.error('Invalid status:', status);
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // First check if order exists
    const { data: existingOrder, error: fetchError } = await supabase
      .from('orders')
      .select('id')
      .eq('id', orderId)
      .single();

    if (fetchError || !existingOrder) {
      console.error('Order not found:', { orderId, error: fetchError });
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log('Found existing order:', existingOrder);

    // Update the order status and payment intent
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        status,
        payment_status: paymentIntent?.status || 'pending',
        updated_at: new Date().toISOString(),
        payment_intent: paymentIntent,
      })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    console.log('Successfully updated order:', updatedOrder);
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error in orders PATCH:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 