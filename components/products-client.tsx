"use client";
import type { Product } from "@/lib/interface";

import ProductPage from "./product-card";
import { useState } from "react";
import { Button } from "./ui/button";

export default function ProductsClient({ products }: { products: Product[] }) {
  const buttons = ["All Categories", "Currency", "Services", "Items"];

  const [selectedFilter, setSelectedFilter] =
    useState<string>("All Categories");

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
    <div
      className=" border rounded-r-lg py-4 md:min-h-[678px] bg-black/5"
    >
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

      {filteredList.map((product) => (
        <ProductPage key={product.id} product={product} />
      ))}
    </div>
  );
}
