"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, ShoppingCart, Loader2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface FiltersProps {
  productName: string;
  leagueOptions: string[];
  difficultyOptions: string[];
  currentLeague: string;
  currentDifficulty: string;
}

export default function Filters({
  productName,
  leagueOptions,
  difficultyOptions,
  currentLeague,
  currentDifficulty,
}: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [league, setLeague] = useState(currentLeague);
  const [difficulty, setDifficulty] = useState(currentDifficulty);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  // Debounced update function to prevent multiple rapid navigations
  const debouncedUpdateFilters = useCallback((newLeague: string, newDifficulty: string) => {
    // Cancel any existing timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    setIsLoading(true);
    
    // Set a new timeout
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (newLeague) params.set("league", newLeague);
      if (newDifficulty) params.set("difficulty", newDifficulty);
      
      const queryString = params.toString();
      const url = `/products/${encodeURIComponent(productName)}${queryString ? `?${queryString}` : ''}`;
      
      router.push(url);
    }, 300); // 300ms debounce time
    
    setDebounceTimeout(timeout);
  }, [debounceTimeout, productName, router]);

  // Clear the timeout when component unmounts
  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);

  // Handle league change
  const handleLeagueChange = (value: string) => {
    setLeague(value);
    debouncedUpdateFilters(value, difficulty);
  };

  // Handle difficulty change
  const handleDifficultyChange = (value: string) => {
    setDifficulty(value);
    debouncedUpdateFilters(league, value);
  };

  // When the URL changes, update the loading state
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  // Handle quantity increment/decrement
  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 99));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= 99) {
      setQuantity(value);
    }
  };

  return (
    <div className="space-y-4 my-6 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-md">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="league" className="text-sm font-medium">
            League
          </label>
          <Select 
            value={league} 
            onValueChange={handleLeagueChange}
            disabled={isLoading}
          >
            <SelectTrigger id="league">
              <SelectValue placeholder="Select league" />
            </SelectTrigger>
            <SelectContent>
              {leagueOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="difficulty" className="text-sm font-medium">
            Difficulty
          </label>
          <Select 
            value={difficulty} 
            onValueChange={handleDifficultyChange}
            disabled={isLoading}
          >
            <SelectTrigger id="difficulty">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {difficultyOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <label htmlFor="quantity" className="text-sm font-medium block mb-2">
          Quantity
        </label>
        <div className="flex items-center max-w-[180px]">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={decrementQuantity}
            disabled={quantity <= 1 || isLoading}
            className="h-10 w-10"
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <Input
            id="quantity"
            type="number"
            min="1"
            max="99"
            value={quantity}
            onChange={handleQuantityChange}
            disabled={isLoading}
            className="h-10 text-center mx-2"
          />
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={incrementQuantity}
            disabled={quantity >= 99 || isLoading}
            className="h-10 w-10"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button 
        className="w-full bg-indigo-600 hover:bg-indigo-700 mt-6"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <ShoppingCart className="mr-2 h-4 w-4" />
        )}
        Add to Cart
      </Button>
    </div>
  );
} 