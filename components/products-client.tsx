"use client";
import type { Product } from "@/lib/interface";
import ProductCard from "./product-card";
import { useState } from "react";
import { Button } from "./ui/button";
import { ProductSkeleton } from "./ui/skeleton";

export default function ProductsClient({ products }: { products: Product[] }) {
  const buttons = ["All Categories", "Currency", "Services", "Items"];
  const [selectedFilter, setSelectedFilter] = useState<string>("All Categories");
  const [isLoaded, setIsLoaded] = useState(false);

  // Simulate loading for better UX
  useState(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  });

  const filterTags = (products: Product[]): Product[] => {
    if (selectedFilter.toLowerCase() === "all categories") {
      return products;
    }
    return products.filter(
      (el) => el.category.toLowerCase() === selectedFilter.toLowerCase()
    );
  };

  const filteredList = filterTags(products);

  return (
    <div className="border rounded-r-lg py-4 md:min-h-[678px] bg-black/5 ">
      <nav className="mb-2 flex flex-wrap gap-2 px-3" aria-label="Filters">
        {buttons.map((label) => (
          <Button
            key={label}
            variant="secondary"
            className={`min-w-12 text-sm md:min-w-30 md:text-lg font-bold hover:bg-indigo-600 ${
              selectedFilter === label ? "bg-indigo-600 text-white" : ""
            }`}
            onClick={() => setSelectedFilter(label)}
            aria-label={`Filter by ${label}`}
          >
            {label}
          </Button>
        ))}
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {!isLoaded ? (
          // Show skeletons while loading
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="m-3">
              <ProductSkeleton />
            </div>
          ))
        ) : filteredList.length > 0 ? (
          // Show products
          filteredList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          // Show empty state
          <div className="w-full text-center py-12">
            <p className="text-lg text-muted-foreground">
              No products found in this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
