import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Roboto, Source_Sans_3 } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { CurrencyProvider } from "@/lib/contexts/currency-context";
import { CartProvider } from "@/lib/contexts/cart-context";
import CartDropdown from "@/components/cart-dropdown";
import { MobileMenu } from "@/components/mobile-menu";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import Footer from "@/components/footer";

const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? `https://${process.env.NEXT_PUBLIC_SITE_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Path of Trade | Buy Path of Exile 1 & 2 Currency | Safe & Fast Delivery | Best Prices",
  description: "Dominate your Path of Exile 1 & 2 journey with instant access to premium POE currency! Purchase safe, cheap, and fast Chaos Orbs, Exalted Orbs, Divine Orbs, and more. Enjoy 24/7 support, guaranteed secure transactions, and lightning-fast delivery. Trusted by thousands of players worldwide – upgrade your gameplay today",
};

// Preload fonts with display:swap for better performance
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
  display: "swap",
  preload: true,
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source-sans",
  display: "swap",
  preload: true,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${sourceSans.variable}`} suppressHydrationWarning>
      <body className="bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CurrencyProvider>
            <CartProvider>
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-18">
                <div className="w-full max-w-6xl flex items-center  text-sm">
                  <div className="flex-1">
                    {/* Left empty space */}
                  </div>
                  <div className="flex-1 flex justify-center">
                    <Link href="/" className="py-3 flex items-center">
                      <Image 
                        src="/images/logo.webp" 
                        alt="Path of Trade Logo" 
                        width={110} 
                        height={55}
                        className="h-auto w-auto"
                        priority
                        fetchPriority="high"
                        quality={90}
                        sizes="(max-width: 768px) 110px, 110px"
                      />
                    </Link>
                  </div>
                  <div className="flex-[1.2] flex justify-end items-center gap-3">
                    <CartDropdown />
                    <div className="md:flex hidden items-center gap-3">
                      {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                    </div>
                    <div className="md:hidden">
                      <MobileMenu isAuthenticated={!!hasEnvVars} />
                    </div>
                  </div>
                </div>
              </nav>
              
              {children}
              
              <Footer/>
              
              {/* Load analytics after main content */}
              <Analytics/>
              <SpeedInsights/>
            </CartProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
