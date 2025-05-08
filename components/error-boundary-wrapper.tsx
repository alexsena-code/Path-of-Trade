'use client';

import { ErrorBoundary } from './error-boundary';
import { AlertCircle, RefreshCw, ShoppingCart, User, Package } from 'lucide-react';

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
  type?: 'default' | 'cart' | 'user' | 'product' | 'order';
}

const fallbackComponents = {
  default: (
    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <AlertCircle className="h-10 w-10 text-destructive" />
      <h2 className="mt-4 text-xl font-semibold">Something went wrong!</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        We're sorry, but there was an error loading this content.
      </p>
    </div>
  ),
  cart: (
    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <ShoppingCart className="h-10 w-10 text-destructive" />
      <h2 className="mt-4 text-xl font-semibold">Cart Error</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        We're having trouble loading your cart. Please try again.
      </p>
    </div>
  ),
  user: (
    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <User className="h-10 w-10 text-destructive" />
      <h2 className="mt-4 text-xl font-semibold">Profile Error</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        We're having trouble loading your profile. Please try again.
      </p>
    </div>
  ),
  product: (
    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <Package className="h-10 w-10 text-destructive" />
      <h2 className="mt-4 text-xl font-semibold">Product Error</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        We're having trouble loading the product. Please try again.
      </p>
    </div>
  ),
  order: (
    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <RefreshCw className="h-10 w-10 text-destructive" />
      <h2 className="mt-4 text-xl font-semibold">Order Error</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        We're having trouble loading your orders. Please try again.
      </p>
    </div>
  ),
};

export function ErrorBoundaryWrapper({ children, type = 'default' }: ErrorBoundaryWrapperProps) {
  return (
    <ErrorBoundary fallback={fallbackComponents[type]}>
      {children}
    </ErrorBoundary>
  );
} 