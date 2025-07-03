"use client"

import { useState } from "react"
import { usePrivy } from "@privy-io/react-auth"
import type { Token } from "@/lib/tokens"

interface SwapParams {
  fromToken: Token
  toToken: Token
  fromAmount: string
  minimumReceived: number
  slippage: number
}

export function useSwap() {
  const { authenticated, user } = usePrivy()
  const [isSwapping, setIsSwapping] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [swapError, setSwapError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  const executeSwap = async (params: SwapParams) => {
    if (!authenticated || !user?.wallet?.address) {
      setSwapError("Please connect your wallet")
      return false
    }

    setIsSwapping(true)
    setSwapError(null)
    setTxHash(null)

    try {
      const { fromToken, toToken, fromAmount } = params

      // Check if we need approval for ERC20 tokens
      if (fromToken.address !== "0x0000000000000000000000000000000000000000") {
        setIsApproving(true)
        // Mock approval process
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsApproving(false)
      }

      // Mock swap transaction using window.ethereum
      if (typeof window !== "undefined" && (window as any).ethereum) {
        let txParams: any

        if (fromToken.address === "0x0000000000000000000000000000000000000000") {
          // ETH to Token swap
          const valueInWei = (Number.parseFloat(fromAmount) * Math.pow(10, 18)).toString(16)
          txParams = {
            from: user.wallet.address,
            to: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // Uniswap V2 Router
            value: `0x${valueInWei}`,
            data: "0x", // Mock transaction data
          }
        } else {
          // Token to ETH or Token to Token
          txParams = {
            from: user.wallet.address,
            to: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // Uniswap V2 Router
            data: "0x", // Mock transaction data
          }
        }

        const hash = await (window as any).ethereum.request({
          method: "eth_sendTransaction",
          params: [txParams],
        })

        setTxHash(hash)
        console.log("Swap transaction:", hash)
        return true
      } else {
        throw new Error("No wallet provider found")
      }
    } catch (error: any) {
      console.error("Swap failed:", error)
      if (error.code === 4001) {
        setSwapError("Transaction rejected by user")
      } else {
        setSwapError(error.message || "Swap failed. Please try again.")
      }
      return false
    } finally {
      setIsSwapping(false)
      setIsApproving(false)
    }
  }

  return {
    executeSwap,
    isSwapping,
    isApproving,
    swapError,
    txHash,
    clearError: () => setSwapError(null),
  }
}
