"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

interface SessionData {
  status: string;
  customer_email: string;
  amount_total: number;
  payment_status: string;
  metadata: {
    orderId?: string;
  };
}

export default function SuccessPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    async function verifySession() {
      if (!sessionId) {
        setStatus('error');
        return;
      }

      try {
        const response = await fetch(`/api/checkout/verify?session_id=${sessionId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to verify session');
        }

        setSessionData(data);
        setStatus('success');
      } catch (error) {
        console.error('Error verifying session:', error);
        setStatus('error');
      }
    }

    verifySession();
  }, [sessionId]);

  if (status === 'loading') {
    return (
      <main className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="animate-in flex-1 flex flex-col gap-6 max-w-4xl px-3">
          <h1 className="text-3xl font-bold">Processing your order...</h1>
        </div>
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="animate-in flex-1 flex flex-col gap-6 max-w-4xl px-3">
          <h1 className="text-3xl font-bold text-red-500">Something went wrong</h1>
          <p className="text-muted-foreground">
            We couldn't process your order. Please try again or contact support.
          </p>
          <Button asChild>
            <Link href="/cart">Return to Cart</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="animate-in flex-1 flex flex-col gap-6 max-w-4xl px-3">
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <h1 className="text-3xl font-bold">Thank you for your order!</h1>
            <p className="text-muted-foreground">
              Your order has been successfully placed. We'll send you an email with the order details.
            </p>
            {sessionData && (
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Order ID: {sessionData.metadata?.orderId}</p>
                <p>Total: ${(sessionData.amount_total / 100).toFixed(2)}</p>
              </div>
            )}
            <div className="flex gap-4 mt-4">
              <Button asChild variant="outline">
                <Link href="/">Continue Shopping</Link>
              </Button>
              <Button asChild>
                <Link href="/orders">View Orders</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
} 
 