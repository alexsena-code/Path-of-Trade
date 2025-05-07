"use client";
import Image from "next/image";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Input } from "./ui/input";
import type { Product } from "@/lib/interface";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [count, setCount] = useState(1);

  const increment = () => {
    setCount((prev) => prev + 1);
  };

  const decrement = () => {
    setCount((prev) => Math.max(0, prev - 1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setCount(Math.max(0, value));
  };

  const totalPrice = product.price * count;

  return (
    <Card className="inline-block max-w-80  min-w-40 overflow-hidden shadow-md hover:shadow-lg transition-shadow m-3 outline-none ">
      <CardContent className="flex flex-col mt-4">
        <div className="relative h-18 w-18 md:h-28 md:w-28 mb-4 rounded-lg overflow-hidden mx-auto">
          <Image
            src={product.imgUrl}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            quality={80}
            sizes="(max-width: 100px) 10vw, 10vw"
          />
        </div>

        <CardFooter className="flex flex-col items-center">
          <h2 className="text-lg md:text-xl text-center">{product.name}</h2>

          {/* Quantity controls */}
          <div className="flex my-1">
            <Button
              variant="outline"
              size="icon"
              className="flex-none h-8"
              onClick={decrement}
            >
              <Minus />
            </Button>
            <Input
              className="shrink text-center text-xl w-24 mx-1 h-8 appearance-none mb-2 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              type="number"
              placeholder="1"
              value={count}
              onChange={handleInputChange}
            />
            <Button
              variant="outline"
              size="icon"
              className="flex-none h-8"
              onClick={increment}
            >
              <Plus />
            </Button>
          </div>

          {/* Price and buttons */}
          <span className="text-xl font-bold text-primary inline-flex mb-3">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(totalPrice)}
          </span>
          <div className="flex flex-nowrap">
            <Button
              className="bg-green-500 min-w-14 text-black hover:bg-green-600 hover:scale-105 transition-transform duration-300 hover:text-white text-md font-bold rounded-sm mx-2"
              disabled={count === 0}
            >
              Buy Now
            </Button>
            <Button
              variant="outline"
              className="rounded-sm min-w-28 hover:scale-105 transition-transform duration-300 font-bold"
              disabled={count === 0}
            >
              Add to Cart
            </Button>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
