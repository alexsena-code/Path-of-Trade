"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Loader2, Package, Clock, CheckCircle, XCircle } from "lucide-react";

const formatPrice = (price: number, currency: string = 'USD') => {
  return price.toLocaleString('en-US', { 
    style: 'currency', 
    currency: currency.toUpperCase()
  });
};

const getStatusIcon = (status: string) => {
  switch (status) {
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

type Order = {
  id: number;
  character_name: string;
  status: string;
  total_amount: number;
  currency: string;
  items: Array<{
    product: {
      name: string;
      description: string;
      price: number;
    };
    quantity: number;
  }>;
  created_at: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        console.log('Orders data:', data);
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

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
        <h1 className="text-3xl font-bold mb-8">Order History</h1>
        <Card className="p-8 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
          <p className="text-muted-foreground">Your order history will appear here</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                </p>
                <p className="mt-2 flex items-center gap-2">
                  <span className="font-medium">Character:</span>
                  {order.character_name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-medium">{formatPrice(order.total_amount, order.currency)}</p>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium mb-3">Items:</h3>
              <ul className="space-y-3">
                {order.items.map((item, index) => {
                  const price = typeof item.product?.price === 'number' ? item.product.price : 0;
                  const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
                  return (
                    <li key={index} className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
                      <div>
                        <span className="font-medium">{item.product?.name || 'Unknown Item'}</span>
                        <p className="text-sm text-muted-foreground">{item.product?.description || ''}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(price * quantity, order.currency)}</p>
                        <p className="text-sm text-muted-foreground">Qty: {quantity}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 