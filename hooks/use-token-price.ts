"use client"

import { useState, useEffect } from "react"
import type { Token } from "@/lib/tokens"

interface PriceData {
  price: number
  priceImpact: number
  minimumReceived: number
}

export function useTokenPrice(fromToken: Token, toToken: Token, amount: string, slippage = 0.5) {
  const [priceData, setPriceData] = useState<PriceData>({ price: 0, priceImpact: 0, minimumReceived: 0 })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!amount || !fromToken || !toToken || amount === "0" || Number.parseFloat(amount) <= 0) {
      setPriceData({ price: 0, priceImpact: 0, minimumReceived: 0 })
      return
    }

    const fetchPrice = async () => {
      setIsLoading(true)
      try {
        // Mock pricing for ETH/WETH pair (1:1 ratio with small fee)
        const inputAmount = Number.parseFloat(amount)
        const exchangeRate =
          fromToken.symbol === "ETH" && toToken.symbol === "WETH"
            ? 0.999
            : fromToken.symbol === "WETH" && toToken.symbol === "ETH"
              ? 0.999
              : 0.998

        const outputAmount = inputAmount * exchangeRate
        const minimumReceived = outputAmount * (1 - slippage / 100)
        const priceImpact = Math.abs(1 - exchangeRate) * 100

        setPriceData({
          price: outputAmount,
          priceImpact,
          minimumReceived,
        })
      } catch (error) {
        console.error("Error fetching price:", error)
        setPriceData({ price: 0, priceImpact: 0, minimumReceived: 0 })
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchPrice, 500)
    return () => clearTimeout(debounceTimer)
  }, [fromToken, toToken, amount, slippage])

  return { ...priceData, isLoading }
}
