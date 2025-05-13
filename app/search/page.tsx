import { Suspense } from "react";
import ProductSearchForm from "@/components/product-search-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Products | Path of Trade",
  description: "Search for Path of Exile products by name, league, and difficulty.",
  openGraph: {
    title: "Search Path of Trade Products",
    description: "Search for Path of Exile products by name, league, and difficulty.",
    type: "website",
  },
};

// Loading component for Suspense fallback
function SearchFormSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-card rounded-lg shadow-sm animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-muted rounded"></div>
          <div className="h-10 w-full bg-muted rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-16 bg-muted rounded"></div>
          <div className="h-10 w-full bg-muted rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-20 bg-muted rounded"></div>
          <div className="h-10 w-full bg-muted rounded"></div>
        </div>
      </div>
      <div className="h-10 w-full bg-muted rounded"></div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <div className="container mx-auto py-16">
      <h1 className="text-4xl font-bold mb-4 text-center">Search Products</h1>
      <p className="text-center text-muted-foreground mb-8">
        Find the perfect Path of Exile products by searching for name, league, and difficulty
      </p>
      
      <Suspense fallback={<SearchFormSkeleton />}>
        <ProductSearchForm />
      </Suspense>
      
      <div className="mt-12 grid gap-6 text-center">
        <div className="p-6 bg-card rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Search Tips</h2>
          <ul className="list-disc list-inside text-muted-foreground text-left max-w-xl mx-auto space-y-1">
            <li>Enter a product name to find specific items</li>
            <li>Filter by league to find league-specific items</li>
            <li>Set difficulty level for better results</li>
            <li>Try using partial names if you're not finding what you need</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 