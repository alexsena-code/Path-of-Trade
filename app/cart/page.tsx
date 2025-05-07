"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCurrency } from "@/lib/contexts/currency-context";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingBag, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const { formatPrice, currency, convertPrice } = useCurrency();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [characterName, setCharacterName] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Handle hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCheckout = async () => {
    if (!characterName.trim()) {
      toast.error("Please enter your character name");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to initialize. Please check your API keys.');
      }

      // Send prices already converted to the selected currency
      const checkoutItems = items.map(item => ({
        product: {
          name: item.product.name,
          description: item.product.description,
          imgUrl: item.product.imgUrl,
          price: item.priceInCurrency, // Use the already converted price
        },
        quantity: item.quantity,
      }));

      console.log('Creating checkout session with:', {
        items: checkoutItems,
        currency,
        characterName
      });

      // Create Stripe checkout session
      const response = await fetch('/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: checkoutItems,
          currency: currency.toLowerCase(),
          characterName,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Checkout session creation failed:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const session = await response.json();
      console.log('Checkout session created:', session);

      // Create order in database with session ID
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterName,
          items: checkoutItems,
          totalAmount: totalPrice,
          currency: currency.toLowerCase(),
          sessionId: session.id,
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        console.error('Order creation failed:', errorData);
        throw new Error(errorData.error || 'Failed to create order');
      }
      
      console.log('Redirecting to Stripe checkout...');
      // Redirect to Stripe checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      
      if (result.error) {
        console.error('Stripe redirect error:', result.error);
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some items to your cart to continue shopping</p>
            <Button onClick={() => router.push('/')}>
              Continue Shopping
            </Button>
          </div>
        </div>
        <footer className="border-t py-6 bg-background">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm text-muted-foreground">
              © 2024 Your Store. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 container mx-auto px-4 pt-10">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.product.id}>
                    <div className="flex items-center gap-4 py-4">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={item.product.imgUrl}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatPrice(item.priceInCurrency)}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => item.product.id && updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => item.product.id && updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                            className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => item.product.id && updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            onClick={() => {
                              item.product.id && removeFromCart(item.product.id);
                              toast.success("Item removed from cart");
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium">
                          {formatPrice(item.priceInCurrency * item.quantity)}
                        </p>
                      </div>
                    </div>
                    {index < items.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Complete Purchase</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="characterName">Character Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="characterName"
                      placeholder="Enter your character name"
                      value={characterName}
                      onChange={(e) => setCharacterName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full mt-6"
                onClick={handleCheckout}
                disabled={isLoading || !characterName.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Go to Checkout'
                )}
              </Button>
              
              <p className="text-sm text-muted-foreground mt-4 text-center">
                By clicking "Go to Checkout", you will be redirected to our secure payment page
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 