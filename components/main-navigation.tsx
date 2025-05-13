"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MainNavigation() {
  const pathname = usePathname();
  
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Search", href: "/search", icon: <Search className="h-4 w-4" /> }
  ];
  
  return (
    <div className="mx-auto max-w-6xl w-full flex justify-center mb-6">
      <nav className="flex space-x-4 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive 
                  ? "bg-indigo-600 text-white" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {item.icon && item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 