'use client';

import { Menu, Package } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetTitle,
  SheetHeader
} from "./ui/sheet";
import { Button } from "./ui/button";
import Link from "next/link";
import { useState } from "react";
import { CurrencyIndicator } from "./currency-indicator";
import { useCart } from "@/lib/contexts/cart-context";

export function MobileMenu({ isAuthenticated = false }) {
  const [open, setOpen] = useState(false);
  const { items } = useCart();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[250px] bg-black/95 p-0">
        <SheetHeader className="pt-6 pb-2 border-b border-white/10">
          <SheetTitle className="text-white text-lg font-bold">Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col mt-4">
          {isAuthenticated ? (
            <Link 
              href="/orders"
              onClick={() => setOpen(false)}
              className="w-full text-center py-2.5 text-white/80 font-roboto text-sm
                hover:text-white transition-colors duration-200 border-b border-white/5
                hover:border-white/20 flex items-center justify-center gap-2"
            >
              <Package className="h-4 w-4" />
              My Orders
            </Link>
          ) : (
            <>
              <Link 
                href="/sign-in"
                onClick={() => setOpen(false)}
                className="w-full text-center py-2.5 text-white/80 font-roboto text-sm
                  hover:text-white transition-colors duration-200 border-b border-white/5
                  hover:border-white/20"
              >
                Sign in
              </Link>
              <Link 
                href="/sign-up"
                onClick={() => setOpen(false)}
                className="w-full text-center py-2.5 text-white/80 font-roboto text-sm
                  hover:text-white transition-colors duration-200 border-b border-white/5
                  hover:border-white/20"
              >
                Sign up
              </Link>
            </>
          )}
          
          <div className="w-full flex justify-center mt-6 py-2.5 border-t border-white/5">
            <CurrencyIndicator variant="full" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 