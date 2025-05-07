'use client';

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import Link from "next/link";
import { useState } from "react";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[250px] bg-black/95 p-0">
        <div className="flex flex-col mt-8">
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
        </div>
      </SheetContent>
    </Sheet>
  );
} 