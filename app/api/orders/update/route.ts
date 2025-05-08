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

    // Validate required fields
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status
    if (!validStatuses.includes(status as OrderStatus)) {
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
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update the order status and payment intent
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        status,
        payment_status: paymentIntent?.status || 'pending',
        updated_at: new Date().toISOString(),
        payment_intentId: paymentIntent?.id || null,
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

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error in orders PATCH:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 