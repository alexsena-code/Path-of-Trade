import HeaderAuth from "@/components/header-auth";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { Roboto, Source_Sans_3 } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { CurrencyProvider } from "@/lib/contexts/currency-context";
import { CartProvider } from "@/lib/contexts/cart-context";
import CartDropdown from "@/components/cart-dropdown";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Footer from "@/components/footer";

export const metadata = {
  metadataBase: new URL("https://www.pathoftrade.net"),
  title:
    "Buy POE 1 & 2 Currency | Cheap Divine Orbs, Exalts, Chaos - Path of Trade",
  description:
    "Buy Path of Exile Currency ✔️ Lowest Prices for Divine Orbs, Exalted Orbs. Instant Delivery, 24/7 Live Support. POE Trade Currency Securely at PathOfTrade.net!",
  metadataBase: new URL("https://www.pathoftrade.net"),
  title:
    "Buy POE 1 & 2 Currency | Cheap Divine Orbs, Exalts, Chaos - Path of Trade",
  description:
    "Buy Path of Exile Currency ✔️ Lowest Prices for Divine Orbs, Exalted Orbs. Instant Delivery, 24/7 Live Support. POE Trade Currency Securely at PathOfTrade.net!",
  keywords: [
    "Buy POE Currency",
    "POE Divine Orbs",
    "Cheap Exalted Orbs",
    "POE Chaos Orb Trade",
    "Path of Exile Currency",
    "POE 2 Currency",
    "Buy POE Orbs",
    "POE Currency Shop",
    "Safe POE Trading",
    "Divine Orb Trade",
    "POE Currency Delivery",
    "Buy POE Chaos Orbs",
    "Divine Orb Trade",
    "POE Currency Delivery",
    "Buy POE Chaos Orbs",
  ],
  openGraph: {
    title: "Buy POE Currency - Divine Orbs & Exalts | Path of Trade",
    description:
      "Cheap POE Currency Trading ⚡ Instant Delivery, 24/7 Support. Buy Divine Orbs, Exalts & Chaos Safely!",
    images: [{ url: "/images/logo.webp" }],
  },
    description:
      "Cheap POE Currency Trading ⚡ Instant Delivery, 24/7 Support. Buy Divine Orbs, Exalts & Chaos Safely!",
    images: [{ url: "/images/logo.webp" }],
  },
};

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
    <html
      lang="en"
      className={`${roboto.variable} ${sourceSans.variable}`}
      suppressHydrationWarning
    >
      <GoogleTagManager gtmId="GTM-W89HJG73-XYZ" />

    <html
      lang="en"
      className={`${roboto.variable} ${sourceSans.variable}`}
      suppressHydrationWarning
    >
      <GoogleTagManager gtmId="GTM-W89HJG73-XYZ" />

      <body className="bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CurrencyProvider>
            <CartProvider>
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-18 mb-8">
                <div className="w-full max-w-6xl flex items-center  text-sm">
                  <div className="flex-1">{/* Left empty space */}</div>
                  <div className="flex-1">{/* Left empty space */}</div>
                  <div className="flex-1 flex justify-center">
                    <Link href="/" className="py-3 flex items-center">
                      <Image
                        src="/images/logo.webp"
                        alt="Path of Trade - Buy POE 1 & 2 Currency"
                        width={110}
                      <Image
                        src="/images/logo.webp"
                        alt="Path of Trade - Buy POE 1 & 2 Currency"
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
                    <div className="hidden md:flex items-center gap-3">
                      <HeaderAuth />
                      <HeaderAuth />
                    </div>
                    <div className="md:hidden flex items-center">
                      <HeaderAuth />
                      <HeaderAuth />
                    </div>
                  </div>
                </div>
              </nav>


              {children}

              <Footer />
              <GoogleAnalytics gaId="G-G1790M45LN" />
              <Analytics />
              <SpeedInsights />

              <Footer />
              <GoogleAnalytics gaId="G-G1790M45LN" />
              <Analytics />
              <SpeedInsights />
            </CartProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
