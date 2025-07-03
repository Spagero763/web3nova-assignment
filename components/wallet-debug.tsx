"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { usePrivy } from "@privy-io/react-auth"

export function WalletDebug() {
  const { ready, authenticated, user, login } = usePrivy()
  const [walletInfo, setWalletInfo] = useState<any>({})
  const [testResults, setTestResults] = useState<any>({})

  useEffect(() => {
    const checkWallet = async () => {
      const ethereum = (window as any).ethereum

      const info = {
        hasWindow: typeof window !== "undefined",
        hasEthereum: !!ethereum,
        isMetaMask: ethereum?.isMetaMask,
        chainId: ethereum?.chainId,
        selectedAddress: ethereum?.selectedAddress,
        privyAppId: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
        privyReady: ready,
        privyAuthenticated: authenticated,
        userAddress: user?.wallet?.address,
      }

      setWalletInfo(info)

      // Test MetaMask directly
      if (ethereum) {
        try {
          const accounts = await ethereum.request({ method: "eth_accounts" })
          const chainId = await ethereum.request({ method: "eth_chainId" })

          setTestResults({
            accounts,
            chainId,
            isConnected: accounts.length > 0,
            isSepoliaChain: chainId === "0xaa36a7", // Sepolia chain ID
          })
        } catch (error) {
          setTestResults({ error: error.message })
        }
      }
    }

    checkWallet()

    // Listen for changes
    if ((window as any).ethereum) {
      const ethereum = (window as any).ethereum
      ethereum.on("accountsChanged", checkWallet)
      ethereum.on("chainChanged", checkWallet)

      return () => {
        ethereum.removeListener("accountsChanged", checkWallet)
        ethereum.removeListener("chainChanged", checkWallet)
      }
    }
  }, [ready, authenticated, user])

  const testDirectConnection = async () => {
    try {
      const ethereum = (window as any).ethereum
      if (!ethereum) {
        alert("MetaMask not found!")
        return
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      })

      console.log("Direct MetaMask connection successful:", accounts)
      alert(`Direct connection successful: ${accounts[0]}`)
    } catch (error) {
      console.error("Direct connection failed:", error)
      alert(`Direct connection failed: ${error.message}`)
    }
  }

  const testPrivyLogin = async () => {
    try {
      console.log("Testing Privy login...")
      await login()
      console.log("Privy login successful")
    } catch (error) {
      console.error("Privy login failed:", error)
      alert(`Privy login failed: ${error.message}`)
    }
  }

  return (
    <Card className="mt-4 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-sm">Wallet Connection Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-xs space-y-1">
          <h4 className="font-semibold">Environment Check:</h4>
          <div>Window Available: {walletInfo.hasWindow ? "✅" : "❌"}</div>
          <div>MetaMask Detected: {walletInfo.hasEthereum ? "✅" : "❌"}</div>
          <div>Is MetaMask: {walletInfo.isMetaMask ? "✅" : "❌"}</div>
          <div>Privy App ID: {walletInfo.privyAppId ? "✅" : "❌"}</div>
          <div>Privy Ready: {walletInfo.privyReady ? "✅" : "❌"}</div>
          <div>Privy Authenticated: {walletInfo.privyAuthenticated ? "✅" : "❌"}</div>
        </div>

        <div className="text-xs space-y-1">
          <h4 className="font-semibold">MetaMask Status:</h4>
          <div>Chain ID: {walletInfo.chainId || "None"}</div>
          <div>Selected Address: {walletInfo.selectedAddress || "None"}</div>
          <div>User Address: {walletInfo.userAddress || "None"}</div>
        </div>

        {testResults.accounts && (
          <div className="text-xs space-y-1">
            <h4 className="font-semibold">Direct Test Results:</h4>
            <div>Accounts: {testResults.accounts.length}</div>
            <div>Connected: {testResults.isConnected ? "✅" : "❌"}</div>
            <div>Sepolia Chain: {testResults.isSepoliaChain ? "✅" : "❌"}</div>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={testDirectConnection} size="sm" variant="outline">
            Test Direct MetaMask
          </Button>
          <Button onClick={testPrivyLogin} size="sm" variant="outline">
            Test Privy Login
          </Button>
        </div>

        {testResults.error && <div className="text-red-600 text-xs">Error: {testResults.error}</div>}
      </CardContent>
    </Card>
  )
}
