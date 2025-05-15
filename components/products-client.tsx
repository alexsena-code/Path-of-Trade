"use client";
import type { Product } from "@/lib/interface";
import ProductCard from "./product-card";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ProductSkeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";


export default function ProductsClient({ products }: { products: Product[] }) {

  const t = useTranslations('Products');


  const buttons = [
    { label: t("allCategories"), value: "All Categories" },
    { label: t("currency"), value: "Currency" },
    { label: t("services"), value: "Services" },
    { label: t("items"), value: "Items" },
  ];
  const [selectedFilter, setSelectedFilter] = useState<string>("All Categories");
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filter from URL search params if available
  useEffect(() => {
    const category = searchParams.get("category");
    if (category && buttons.some(b => b.value === category)) {
      setSelectedFilter(category);
    }
    
    const search = searchParams.get("search");
    if (search) {
      setSearchTerm(search);
    }
  }, [searchParams]);

  // Simulate loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const filterTags = (products: Product[]): Product[] => {
    let filteredProducts = products;
    
    // Apply category filter
    if (selectedFilter.toLowerCase() !== "all categories") {
      filteredProducts = filteredProducts.filter(
        (el) => el.category.toLowerCase() === selectedFilter.toLowerCase()
      );
    }
    
    // Apply search term filter (client-side)
    if (searchTerm.trim() !== "") {
      filteredProducts = filteredProducts.filter(
        (product) => product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filteredProducts;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL with search parameters
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    
    // Find the button object corresponding to selectedFilter
    const selectedButton = buttons.find(button => button.value === selectedFilter || button.label === selectedFilter);

    if (selectedButton && selectedButton.value !== "All Categories") {
      params.set("category", selectedButton.value);
    } else {
      params.delete("category");
    }
    
    router.push(`/products?${params.toString()}`);
  };

  const filteredList = filterTags(products);

  return (
    <div className="border rounded-lg py-4 md:min-h-[678px] bg-black/5">
      
      <div className="flex flex-col md:flex-row items-center justify-between px-3 gap-4 mb-4">
        <nav className="flex flex-wrap gap-2" aria-label="Filters">
          {buttons.map((button) => (
            <Button
              key={button.value}
              variant="secondary"
              className={`min-w-12 text-sm md:min-w-30 md:text-lg font-bold hover:bg-indigo-600 ${
                selectedFilter === button.value ? "bg-indigo-600 text-white" : ""
              }`}
              onClick={() => setSelectedFilter(button.value)}
              aria-label={`Filter by ${button.label}`}
            >
              {button.label}
            </Button>
          ))}
        </nav>
        
        <form onSubmit={handleSearch} className="flex w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
            <Button 
              type="submit" 
              size="icon" 
              variant="ghost" 
              className="absolute right-0 top-0 h-full"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
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
          <div className="w-full text-center py-12 col-span-full">
            <p className="text-lg text-muted-foreground">
              {t("noProductsFound")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
