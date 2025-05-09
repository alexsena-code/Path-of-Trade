"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card } from "@/components/ui/card";
import { 
  Loader2, Package, Clock, CheckCircle, XCircle, 
  Calendar, RefreshCcw, ShoppingBag, CreditCard, Shield, Sword, User, Map,
  ArrowLeft, ExternalLink, MessageSquare, Receipt
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Order } from "@/types";
import { Separator } from "@/components/ui/separator";

const formatPrice = (price: number, currency: string = 'USD') => {
  if (currency.toLowerCase() === 'chaos' || currency.toLowerCase() === 'exalted') {
    return `${price} ${currency}`;
  }
  
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: currency.toUpperCase()
  }).format(price);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getDeliveryStatusIcon = (status: string | null) => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'delivered':
    case 'waiting_delivery':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'ready_for_pickup':
      return <Sword className="h-5 w-5 text-emerald-500" />;
    case 'in_progress':
    case 'processing':
      return <RefreshCcw className="h-5 w-5 text-blue-500" />;
    case 'cancelled':
    case 'canceled':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'failed':
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Clock className="h-5 w-5 text-amber-500" />;
  }
};

const getPaymentStatusIcon = (status: string | null) => {
  switch (status?.toLowerCase()) {
    case 'succeeded':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'processing':
      return <RefreshCcw className="h-5 w-5 text-blue-500" />;
    case 'requires_payment_method':
      return <CreditCard className="h-5 w-5 text-amber-500" />;
    case 'failed':
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Clock className="h-5 w-5 text-gray-500" />;
  }
};

const formatStatus = (status: string | null) => {
  if (!status) return 'Unknown';
  
  const poeStatusMap: Record<string, string> = {
    'waiting_delivery': 'Ready for Delivery',
    'delivered': 'Items Delivered',
    'processing': 'Processing Payment',
    'ready_for_pickup': 'Ready for Pickup',
    'in_progress': 'Order Processing',
  };
  
  if (poeStatusMap[status.toLowerCase()]) {
    return poeStatusMap[status.toLowerCase()];
  }
  
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getStatusColor = (status: string | null) => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'waiting_delivery':
    case 'delivered':
    case 'succeeded':
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-900';
    case 'ready_for_pickup':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900';
    case 'pending':
    case 'processing':
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900';
    case 'cancelled':
    case 'canceled':
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900';
    default:
      return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900';
  }
};

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        if (!session?.user) {
          router.push('/login');
          return;
        }

        // Fetch specific order for current user
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', params.id)
          .eq('user_id', session.user.id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Order not found');
        
        setOrder(data);
      } catch (error: any) {
        console.error('Error fetching order details:', error);
        setError(error.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [params.id, router, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h2 className="text-xl font-medium">Loading order details...</h2>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" className="mb-8 gap-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Button>
        
        <Card className="p-12 max-w-2xl mx-auto text-center border border-dashed">
          <div className="rounded-full bg-red-100 dark:bg-red-950/50 p-6 mx-auto w-24 h-24 flex items-center justify-center mb-6">
            <XCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Order Not Found</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {error || "We couldn't find the order you're looking for. It may have been removed or you don't have permission to view it."}
          </p>
          <Button asChild size="lg" className="px-8 gap-2">
            <Link href="/orders">
              <Package className="h-5 w-5" />
              View All Orders
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
      <Button variant="ghost" className="mb-8 gap-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Order Summary */}
        <div className="lg:col-span-2">
          <Card className="p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-0 mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-1">Order #{order.id}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {formatDate(order.created_at)}
                </div>
              </div>
              <Badge variant="outline" className={`px-3 py-1.5 ${getStatusColor(order.status)}`}>
                {getDeliveryStatusIcon(order.status)} 
                <span className="ml-1">{formatStatus(order.status || 'processing')}</span>
              </Badge>
            </div>
            
            <Separator className="mb-6" />
            
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Order Items
                </h2>
                
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between p-4 bg-muted/30 rounded-md border">
                      <div className="flex flex-col">
                        <div className="font-medium text-lg">
                          {item.product?.name || 'Unknown Item'}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1 space-y-1">
                          {(item.product as any)?.item_level && (
                            <div>Item Level: {(item.product as any).item_level}</div>
                          )}
                          {(item.product as any)?.quality && (
                            <div>Quality: {(item.product as any).quality}%</div>
                          )}
                          {(item.product as any)?.links && (
                            <div>Links: {(item.product as any).links}</div>
                          )}
                          {(item.product as any)?.description && (
                            <div className="mt-2 italic">{(item.product as any).description}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="font-medium">
                          {formatPrice(item.product?.price * item.quantity || 0, order.currency)}
                        </div>
                        <Badge variant="outline" className="mt-2">
                          Qty: {item.quantity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center py-2">
                <span className="font-medium">Subtotal</span>
                <span>{formatPrice(order.total_amount, order.currency)}</span>
              </div>
              
              {(order as any).delivery_fee > 0 && (
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Delivery Fee</span>
                  <span>{formatPrice((order as any).delivery_fee, order.currency)}</span>
                </div>
              )}
              
              {(order as any).discount_amount > 0 && (
                <div className="flex justify-between items-center py-2 text-green-600">
                  <span className="font-medium">Discount</span>
                  <span>-{formatPrice((order as any).discount_amount, order.currency)}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between items-center py-2">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg">
                  {formatPrice(order.total_amount, order.currency)}
                </span>
              </div>
            </div>
            
            {/* Delivery Instructions */}
            {(order as any).delivery_instructions && (
              <div className="mt-6 p-4 border border-border/70 rounded-md bg-muted/30">
                <h3 className="font-medium flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Delivery Instructions
                </h3>
                <p className="text-sm text-muted-foreground">
                  {(order as any).delivery_instructions}
                </p>
              </div>
            )}
          </Card>
          
          {/* Payment History */}
          {order.payment_intent && (
            <Card className="p-6 md:p-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                Payment Information
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted/30 rounded-md border">
                  <div className="flex flex-col">
                    <div className="text-sm text-muted-foreground">Payment Status</div>
                    <div className="flex items-center gap-2 mt-1">
                      {getPaymentStatusIcon(order.payment_intent.status)}
                      <span className="font-medium">{formatStatus(order.payment_intent.status)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="text-sm text-muted-foreground">Amount</div>
                    <div className="font-medium mt-1">
                      {formatPrice(order.total_amount, order.currency)}
                    </div>
                  </div>
                </div>
                
                {(order.payment_intent as any).payment_method_types && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    Payment Method: {(order.payment_intent as any).payment_method_types.join(', ')}
                  </div>
                )}
                
                {(order.payment_intent as any).created && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Payment Date: {formatDate(new Date((order.payment_intent as any).created * 1000).toISOString())}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
        
        {/* Order Meta & Actions Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6 md:p-8 mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Delivery Information
            </h2>
            
            <div className="space-y-4">
              {order.character_name && (
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground mb-1">Character Name</span>
                  <span className="font-medium">{order.character_name}</span>
                </div>
              )}
              
              {/* Extract league from first item if available */}
              {order.items && order.items.length > 0 && order.items[0].product?.league && (
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground mb-1">League</span>
                  <div className="flex items-center gap-2">
                    <Map className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">{order.items[0].product.league}</span>
                  </div>
                </div>
              )}
              
              {(order as any).estimated_delivery && (
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground mb-1">Estimated Delivery</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{formatDate((order as any).estimated_delivery)}</span>
                  </div>
                </div>
              )}
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-4">
              <Button className="w-full gap-2">
                <MessageSquare className="h-4 w-4" />
                Contact Support
              </Button>
              
              {order.status?.toLowerCase() !== 'delivered' && order.status?.toLowerCase() !== 'completed' && (
                <Button variant="outline" className="w-full gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Track Delivery
                </Button>
              )}
              
              {(order.status?.toLowerCase() === 'delivered' || order.status?.toLowerCase() === 'completed') ? (
                <Button variant="outline" className="w-full gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Buy Again
                </Button>
              ) : (
                order.status?.toLowerCase() !== 'cancelled' && order.status?.toLowerCase() !== 'canceled' && order.status?.toLowerCase() !== 'failed' && (
                  <Button variant="outline" className="w-full gap-2 border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/50">
                    <XCircle className="h-4 w-4" />
                    Cancel Order
                  </Button>
                )
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 