import Stripe from "stripe";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-04-30.basil",
});

// Currency conversion rates (you should use a real API for this)

export async function POST(req: Request) {
  try {
    const { items, currency, characterName } = await req.json();

    console.log('Received checkout request:', {
      items,
      currency,
      characterName
    });

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session with pre-converted prices
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: item.product.name,
            description: item.product.description,
          },
          unit_amount: Math.round(item.product.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/cart`,
      metadata: {
        characterName,
      },
    });

    console.log('Stripe session created:', {
      id: session.id,
      url: session.url,
      currency: currency.toLowerCase(),
      amount: items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error('Stripe session creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error creating checkout session' },
      { status: 500 }
    );
  }
}