"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowUpDown, ChevronDown } from "lucide-react"
import { type Token, SEPOLIA_TOKENS } from "@/lib/tokens"
import { TokenSelectModal } from "./token-select-modal"
import { WalletConnect } from "./wallet-connect"
import { TransactionModal } from "./transaction-modal"
import { SlippageSettings } from "./slippage-settings"
import { usePrivy } from "@privy-io/react-auth"
import Image from "next/image"
import { useTokenBalance } from "@/hooks/use-token-balance"
import { useTokenPrice } from "@/hooks/use-token-price"
import { useSwap } from "@/hooks/use-swap"

export function SwapInterface() {
  const { authenticated, user } = usePrivy()
  const [fromToken, setFromToken] = useState<Token>(SEPOLIA_TOKENS[0])
  const [toToken, setToToken] = useState<Token>(SEPOLIA_TOKENS[1])
  const [fromAmount, setFromAmount] = useState("")
  const [slippage, setSlippage] = useState(0.5)
  const [isFromModalOpen, setIsFromModalOpen] = useState(false)
  const [isToModalOpen, setIsToModalOpen] = useState(false)
  const [showTxModal, setShowTxModal] = useState(false)

  const walletAddress = user?.wallet?.address
  const { balance: fromBalance } = useTokenBalance(fromToken, walletAddress)
  const { balance: toBalance } = useTokenBalance(toToken, walletAddress)
  const {
    price: toAmount,
    minimumReceived,
    priceImpact,
    isLoading: isPriceLoading,
  } = useTokenPrice(fromToken, toToken, fromAmount, slippage)
  const { executeSwap, isSwapping, isApproving, swapError, txHash, clearError } = useSwap()

  const handleSwapTokens = () => {
    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)
    setFromAmount("")
  }

  const handleMaxClick = () => {
    setFromAmount(fromBalance)
  }

  const handleSwap = async () => {
    if (!fromAmount || !toAmount) return

    setShowTxModal(true)
    const success = await executeSwap({
      fromToken,
      toToken,
      fromAmount,
      minimumReceived,
      slippage,
    })

    if (success) {
      setFromAmount("")
    }
  }

  const isInsufficientBalance = Number.parseFloat(fromAmount || "0") > Number.parseFloat(fromBalance)
  const canSwap = authenticated && fromAmount && toAmount && !isInsufficientBalance && !isSwapping && !isApproving

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Swap</h1>
        <div className="flex items-center gap-2">
          <SlippageSettings slippage={slippage} onSlippageChange={setSlippage} />
          <WalletConnect />
        </div>
      </div>

      <Card className="border-0 bg-muted/20">
        <CardContent className="p-4 space-y-2">
          {/* From Token */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>From</span>
              <div className="flex items-center gap-2">
                <span>Balance: {fromBalance}</span>
                {Number.parseFloat(fromBalance) > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-blue-500"
                    onClick={handleMaxClick}
                  >
                    MAX
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="border-0 bg-transparent text-2xl font-semibold placeholder:text-muted-foreground/50 focus-visible:ring-0"
              />
              <Button
                variant="ghost"
                onClick={() => setIsFromModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 h-auto bg-muted hover:bg-muted/80 rounded-full"
              >
                <Image
                  src={fromToken.logoURI || "/placeholder.svg"}
                  alt={fromToken.symbol}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="font-medium">{fromToken.symbol}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center py-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSwapTokens}
              className="h-8 w-8 rounded-full border-2 border-muted bg-background hover:bg-muted/50"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          {/* To Token */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>To</span>
              <span>Balance: {toBalance}</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="0.0"
                value={isPriceLoading ? "..." : toAmount > 0 ? toAmount.toFixed(6) : ""}
                readOnly
                className="border-0 bg-transparent text-2xl font-semibold placeholder:text-muted-foreground/50 focus-visible:ring-0"
              />
              <Button
                variant="ghost"
                onClick={() => setIsToModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 h-auto bg-muted hover:bg-muted/80 rounded-full"
              >
                <Image
                  src={toToken.logoURI || "/placeholder.svg"}
                  alt={toToken.symbol}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="font-medium">{toToken.symbol}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trade Details */}
      {fromAmount && toAmount > 0 && (
        <div className="mt-2 p-3 bg-muted/30 rounded-lg space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Minimum received</span>
            <span>
              {minimumReceived.toFixed(6)} {toToken.symbol}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Price impact</span>
            <span className={priceImpact > 3 ? "text-red-500" : priceImpact > 1 ? "text-yellow-500" : ""}>
              {priceImpact.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Slippage tolerance</span>
            <span>{slippage}%</span>
          </div>
        </div>
      )}

      {/* Price Impact Warning */}
      {priceImpact > 3 && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">High price impact! You may lose a significant portion of your funds.</p>
        </div>
      )}

      {/* Error Message */}
      {swapError && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{swapError}</p>
        </div>
      )}

      {/* Swap Button */}
      <Button
        onClick={handleSwap}
        className="w-full mt-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600 h-12 text-lg font-semibold"
        disabled={!canSwap}
      >
        {!authenticated
          ? "Connect Wallet"
          : !fromAmount
            ? "Enter an amount"
            : isInsufficientBalance
              ? "Insufficient balance"
              : isApproving
                ? "Approving..."
                : isSwapping
                  ? "Swapping..."
                  : "Swap"}
      </Button>

      {/* Token Selection Modals */}
      <TokenSelectModal
        isOpen={isFromModalOpen}
        onClose={() => setIsFromModalOpen(false)}
        onSelectToken={setFromToken}
        selectedToken={toToken}
      />
      <TokenSelectModal
        isOpen={isToModalOpen}
        onClose={() => setIsToModalOpen(false)}
        onSelectToken={setToToken}
        selectedToken={fromToken}
      />

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showTxModal}
        onClose={() => {
          setShowTxModal(false)
          clearError()
        }}
        txHash={txHash}
        isLoading={isSwapping || isApproving}
        error={swapError}
        title={isApproving ? "Approving Token" : "Swapping Tokens"}
      />
    </div>
  )
}
