'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type CurrencyType = 'USD' | 'EUR' | 'GBP' | 'BRL'

interface CurrencyContextType {
  currency: CurrencyType
  setCurrency: (currency: CurrencyType) => void
  formatPrice: (price: number) => string
  convertPrice: (price: number) => number
  isLoading: boolean
  refreshRates: () => Promise<void>
  apiSource: 'openexchangerates' | 'frankfurter' | 'fallback'
}

// Fallback exchange rates in case API fails
const fallbackRates = {
  USD: 1,
  EUR: 0.93,
  GBP: 0.79,
  BRL: 5.60
}

const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  BRL: 'R$'
}

// Replace with your actual API key
const OPEN_EXCHANGE_RATES_APP_ID = process.env.NEXT_PUBLIC_OPEN_EXCHANGE_RATES_API_KEY || ''

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyType>('USD')
  const [exchangeRates, setExchangeRates] = useState(fallbackRates)
  const [isLoading, setIsLoading] = useState(false)
  const [apiSource, setApiSource] = useState<'openexchangerates' | 'frankfurter' | 'fallback'>('fallback')
  
  // Fetch exchange rates from API
  const fetchExchangeRates = async () => {

    try {
      setIsLoading(true)
      
      // First try OpenExchangeRates API (with user's API key)
      if (OPEN_EXCHANGE_RATES_APP_ID) {
        try {
          const response = await fetch(
            `https://openexchangerates.org/api/latest.json?app_id=${OPEN_EXCHANGE_RATES_APP_ID}&symbols=EUR,GBP,BRL`
          )
          
          if (!response.ok) {
            throw new Error('Failed to fetch from OpenExchangeRates')
          }
          
          const data = await response.json()
          
          // Validate that the response contains the expected rates
          if (!data.rates || !data.rates.EUR || !data.rates.GBP || !data.rates.BRL) {
            throw new Error('Invalid API response format from OpenExchangeRates')
          }
          
          // The API returns rates relative to USD
          setExchangeRates({
            USD: 1, // Base currency is always 1
            EUR: data.rates.EUR,
            GBP: data.rates.GBP,
            BRL: data.rates.BRL
          })
          
          setApiSource('openexchangerates')
          console.log('Using OpenExchangeRates API')
          return
        } catch (openExchangeError) {
          console.warn('OpenExchangeRates API failed, trying Frankfurter', openExchangeError)
          // Continue to Frankfurter (don't return, fall through)
        }
      } else {
        console.log('No OpenExchangeRates API key found, using Frankfurter')
      }
      
      // If OpenExchangeRates fails or no API key, try Frankfurter API as fallback
      try {
        // Using Frankfurter API which is free and doesn't require an API key
        // Alternative free APIs:
        // - ExchangeRate-API: https://www.exchangerate-api.com/ (free tier with API key)
        // - APILayer Exchange Rates: https://exchangeratesapi.io/ (free tier with API key, 250 requests/month)
        // - ECB (European Central Bank): https://fixer.io/ (free tier with API key)
        const response = await fetch(
          'https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,BRL'
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch from Frankfurter')
        }
        
        const data = await response.json()
        
        // Validate that the response contains the expected rates
        if (!data.rates || !data.rates.EUR || !data.rates.GBP || !data.rates.BRL) {
          throw new Error('Invalid API response format from Frankfurter')
        }
        
        // The API returns rates relative to USD
        setExchangeRates({
          USD: 1, // Base currency is always 1
          EUR: data.rates.EUR,
          GBP: data.rates.GBP,
          BRL: data.rates.BRL
        })
        
        setApiSource('frankfurter')
        console.log('Using Frankfurter API')
        return
      } catch (frankfurterError) {
        // If Frankfurter fails too, throw to the outer catch block
        console.error('Frankfurter API failed', frankfurterError)
        throw new Error('All currency APIs failed')
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error)
      // Fall back to default rates if all APIs fail
      setExchangeRates(fallbackRates)
      setApiSource('fallback')
      console.warn('Using fallback currency rates')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Load currency preference from localStorage when the component mounts
  // and fetch initial exchange rates
  useEffect(() => {
    const savedCurrency = localStorage.getItem('currencyPreference') as CurrencyType | null
    if (savedCurrency && Object.keys(fallbackRates).includes(savedCurrency)) {
      setCurrency(savedCurrency)
    }
    
    fetchExchangeRates()
    
    // Set up periodic refresh of exchange rates (every 6 hours)
    const intervalId = setInterval(fetchExchangeRates, 6 * 60 * 60 * 1000)
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [])
  
  // Save currency preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('currencyPreference', currency)
  }, [currency])
  
  // Convert price from USD to selected currency
  const convertPrice = (priceInUSD: number): number => {
    const rate = exchangeRates[currency]
    return priceInUSD * rate
  }
  
  // Format price in selected currency with symbol
  const formatPrice = (priceInUSD: number): string => {
    const convertedPrice = convertPrice(priceInUSD)
    
    // Format with proper currency symbol and locale
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(convertedPrice)
  }
  
  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      setCurrency, 
      formatPrice, 
      convertPrice,
      isLoading,
      refreshRates: fetchExchangeRates,
      apiSource
    }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
} 