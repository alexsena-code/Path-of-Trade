import { supabase } from '@/lib/db';
import { NextResponse } from 'next/server';

const orderStatuses = {
  PENDING: "pending",
  PAYMENT_APPROVED: "payment_approved",
  PAYMENT_FAILED: "payment_failed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export async function POST(req: Request) {
  try {
    const { characterName, items, totalAmount, currency, sessionId } = await req.json();

    console.log('Creating order with data:', {
      characterName,
      items,
      totalAmount,
      sessionId
    });

    // Create order in Supabase
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        character_name: characterName,
        items: items,
        total_amount: totalAmount,
        currency: currency.toLowerCase(), // Store currency in lowercase
        status: orderStatuses.PENDING,
        stripe_session_id: sessionId,
        email: '', // Will be updated when payment is confirmed
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    if (!order) {
      throw new Error('No order returned from database');
    }

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create order' },
      { status: 500 }
    );
  }
} 