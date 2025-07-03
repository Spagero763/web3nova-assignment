"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DebugInfo() {
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    const checkWallet = () => {
      const ethereum = (window as any).ethereum
      setDebugInfo({
        hasEthereum: !!ethereum,
        isMetaMask: ethereum?.isMetaMask,
        chainId: ethereum?.chainId,
        selectedAddress: ethereum?.selectedAddress,
        privyAppId: process.env.NEXT_PUBLIC_PRIVY_APP_ID?.slice(0, 10) + "...",
      })
    }

    checkWallet()

    // Listen for account changes
    if ((window as any).ethereum) {
      ;(window as any).ethereum
        .on(
          "accountsChanged",
          checkWallet,
        )(window as any)
        .ethereum.on("chainChanged", checkWallet)
    }

    return () => {
      if ((window as any).ethereum) {
        ;(window as any).ethereum
          .removeListener(
            "accountsChanged",
            checkWallet,
          )(window as any)
          .ethereum.removeListener("chainChanged", checkWallet)
      }
    }
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== "development") return null

  return (
    <Card className="mt-4 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-sm">Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-1">
        <div>MetaMask Available: {debugInfo.hasEthereum ? "✅" : "❌"}</div>
        <div>Is MetaMask: {debugInfo.isMetaMask ? "✅" : "❌"}</div>
        <div>Chain ID: {debugInfo.chainId || "None"}</div>
        <div>Selected Address: {debugInfo.selectedAddress || "None"}</div>
        <div>Privy App ID: {debugInfo.privyAppId || "Missing"}</div>
      </CardContent>
    </Card>
  )
}
