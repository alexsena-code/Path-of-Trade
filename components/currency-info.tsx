import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

interface CurrencyInfoProps {
  gameVersion?: string
}

interface CurrencyData {
  id: string
  name: string
  description: string
  imageUrl: string
  gameVersion: string
  uses: string[]
}

const currencyData: Record<string, CurrencyData[]> = {
  "path-of-exile-2": [
    {
      id: "chaos-orb",
      name: "Chaos Orb",
      description: "Reforges a rare item with new random modifiers.",
      imageUrl: "/images/chaos-orb.webp",
      gameVersion: "path-of-exile-2",
      uses: [
        "Reforges a rare item with new random modifiers",
        "Used in various crafting recipes",
        "Common trading currency"
      ]
    },
    {
      id: "exalted-orb",
      name: "Exalted Orb",
      description: "Adds a new random modifier to a rare item.",
      imageUrl: "/images/exalted-orb.webp",
      gameVersion: "poe2",
      uses: [
        "Adds a new random modifier to a rare item",
        "Used in high-end crafting",
        "Premium trading currency"
      ]
    }
  ],
  "path-of-exile-1": [
    {
      id: "divine-orb",
      name: "Divine Orb",
      description: "Randomises the values of the random modifiers on an item.",
      imageUrl: "/images/divine-orb.webp",
      gameVersion: "path-of-exile-1",
      uses: [
        "Randomises the values of the random modifiers on an item",
        "Used for perfecting high-end items",
        "Premium trading currency"
      ]
    },
    {
      id: "mirror-of-kalandra",
      name: "Mirror of Kalandra",
      description: "Creates a mirrored copy of an item.",
      imageUrl: "/images/mirror.webp",
      gameVersion: "3.25",
      uses: [
        "Creates a mirrored copy of an item",
        "Most valuable currency item",
        "Used for duplicating perfect items"
      ]
    }
  ]
}

export function CurrencyInfo({ gameVersion }: CurrencyInfoProps) {
  const currencies = gameVersion 
    ? currencyData[gameVersion] || []
    : Object.values(currencyData).flat()

  if (currencies.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">No currency information available.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {currencies.map((currency) => (
        <Card key={currency.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">
                {currency.name}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={currency.imageUrl}
                  alt={currency.name}
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
              <div className="flex-1 space-y-4">
                <p className="text-muted-foreground">{currency.description}</p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Common Uses:</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {currency.uses.map((use, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {use}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
