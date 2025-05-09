'use cache'
import ProductsClient from "@/components/products-client";
import { ProductSearch } from "@/components/product-search";
import { getProducts } from "@/app/actions";
import type { Product } from "@/lib/interface";

export interface SearchParams {
  q?: string;
  category?: string;
  min?: string;
  max?: string;
}

export default async function ProductsPage({
  searchParams
}: {
  searchParams: SearchParams
}) {
  const allProducts = await getProducts();
  
  // Apply filters
  const filteredProducts = filterProducts(allProducts, searchParams);
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl md:text-6xl tracking-tighter font-bold font-source-sans text-center mb-8">
        PRODUCTS
      </h1>
      
      <ProductSearch />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductsClient products={filteredProducts} />
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </main>
  );
}

function filterProducts(products: Product[], searchParams: SearchParams): Product[] {
  const { q, category, min, max } = searchParams;
  
  return products.filter(product => {
    // Filter by search query
    if (q && !product.name.toLowerCase().includes(q.toLowerCase()) && 
        !product.description?.toLowerCase().includes(q.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (category && product.category !== category) {
      return false;
    }
    
    // Filter by min price
    if (min && product.price < parseFloat(min)) {
      return false;
    }
    
    // Filter by max price
    if (max && product.price > parseFloat(max)) {
      return false;
    }
    
    return true;
  });
} 