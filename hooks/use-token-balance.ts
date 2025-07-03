"use client"

import { useState, useEffect } from "react"
import type { Token } from "@/lib/tokens"

export function useTokenBalance(token: Token, address?: string) {
  const [balance, setBalance] = useState<string>("0.0")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!address || !token) return

    const fetchBalance = async () => {
      setIsLoading(true)
      try {
        if (token.address === "0x0000000000000000000000000000000000000000") {
          // ETH balance - use window.ethereum directly
          if (typeof window !== "undefined" && (window as any).ethereum) {
            const result = await (window as any).ethereum.request({
              method: "eth_getBalance",
              params: [address, "latest"],
            })
            // Convert hex to decimal and format
            const balanceInWei = Number.parseInt(result, 16)
            const balanceInEth = balanceInWei / Math.pow(10, 18)
            setBalance(balanceInEth.toFixed(4))
          }
        } else {
          // ERC20 token balance - mock for now
          setBalance("0.0")
        }
      } catch (error) {
        console.error("Error fetching balance:", error)
        setBalance("0.0")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBalance()
  }, [token, address])

  return { balance, isLoading }
}
