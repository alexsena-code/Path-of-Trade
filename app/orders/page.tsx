"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2, Package, Clock, CheckCircle, XCircle, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { Order } from "@/types";

const formatPrice = (price: number, currency: string = 'USD') => {
  return price.toLocaleString('en-US', { 
    style: 'currency', 
    currency: currency.toUpperCase()
  });
};

const getStatusIcon = (status: string | null) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Package className="h-4 w-4 text-gray-500" />;
  }
};

const getPaymentStatusIcon = (status: string | null) => {
  switch (status?.toLowerCase()) {
    case 'succeeded':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Package className="h-4 w-4 text-gray-500" />;
  }
};

const formatStatus = (status: string | null) => {
  if (!status) return 'Unknown';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchOrders() {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        if (!session?.user) {
          router.push('/login');
          return;
        }

        // Fetch orders for current user
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [router, supabase]);

  useEffect(() => {
    if (orders.length > 0) {
      console.log('First order items:', orders[0].items);
    }
  }, [orders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">My Orders</h1>
        <Card className="p-8 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
          <p className="text-muted-foreground">Your order history will appear here</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-[70vh]">
      <h1 className="text-2xl font-bold mb-8">My Orders</h1>
      
      <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
        {orders.map((order) => (
          <Card 
            key={order.id} 
            className="group relative overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-medium">Order #{order.id}</h2>
                  <p className="text-base text-muted-foreground mt-2">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="outline" className="text-sm px-4 py-1">
                    {order.character_name}
                  </Badge>
                  <p className="text-xl font-medium">{formatPrice(order.total_amount, order.currency)}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-base">
                    {getStatusIcon(order.status)}
                    <span>Order: {formatStatus(order.status)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base">
                    {getPaymentStatusIcon(order.payment_status)}
                    <span>Payment: {formatStatus(order.payment_status)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">•</span>
                  <div className="text-base text-muted-foreground">
                    {order.items.length} items • {order.items.reduce((total, item) => total + item.quantity, 0)} total
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  {order.items.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="font-medium">{item.product?.name || 'Unknown Item'}</span>
                      <span>× {item.quantity}</span>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <div className="text-muted-foreground">
                      +{order.items.length - 2} more items
                    </div>
                  )}
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between group-hover:bg-background/80 text-base py-7"
                    onClick={() => router.push(`/orders/${order.id}`)}
                  >
                    View Full Order Details
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 