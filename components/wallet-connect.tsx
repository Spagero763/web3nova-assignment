"use client"

import { usePrivy } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"
import { Wallet, AlertCircle, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"

export function WalletConnect() {
  const { ready, authenticated, login, logout, user } = usePrivy()
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMetaMask, setHasMetaMask] = useState(false)

  useEffect(() => {
    // Check if MetaMask is available
    const checkMetaMask = () => {
      const ethereum = (window as any).ethereum
      setHasMetaMask(!!ethereum?.isMetaMask)

      if (!ethereum) {
        setError("MetaMask not detected. Please install MetaMask.")
      } else if (!ethereum.isMetaMask) {
        setError("Please use MetaMask wallet.")
      } else {
        setError(null)
      }
    }

    checkMetaMask()

    // Listen for MetaMask installation
    const handleEthereum = () => checkMetaMask()
    window.addEventListener("ethereum#initialized", handleEthereum, { once: true })

    // Timeout for MetaMask detection
    setTimeout(checkMetaMask, 3000)

    return () => {
      window.removeEventListener("ethereum#initialized", handleEthereum)
    }
  }, [])

  const handleConnect = async () => {
    if (!hasMetaMask) {
      window.open("https://metamask.io/download/", "_blank")
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      // First try to connect MetaMask directly
      const ethereum = (window as any).ethereum
      if (ethereum) {
        await ethereum.request({ method: "eth_requestAccounts" })
      }

      // Then use Privy
      await login()
    } catch (err: any) {
      if (err.code === 4001) {
        setError("Connection rejected by user")
      } else if (err.message?.includes("User rejected")) {
        setError("Connection rejected by user")
      } else if (err.message?.includes("Already processing")) {
        setError("Connection already in progress")
      } else {
        setError(err.message || "Failed to connect wallet")
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await logout()
      setError(null)
    } catch (err: any) {
      setError(err.message || "Failed to disconnect wallet")
    }
  }

  const handleRetry = () => {
    setError(null)
    if (!authenticated) {
      handleConnect()
    }
  }

  if (!ready) {
    return (
      <Button disabled className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
        Loading...
      </Button>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
        <div className="flex gap-2">
          {!hasMetaMask ? (
            <Button
              onClick={() => window.open("https://metamask.io/download/", "_blank")}
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Install MetaMask
            </Button>
          ) : (
            <Button onClick={handleRetry} variant="outline" size="sm">
              Retry Connection
            </Button>
          )}
        </div>
      </div>
    )
  }

  if (authenticated && user?.wallet?.address) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-muted-foreground">
            {user.wallet.address.slice(0, 6)}...{user.wallet.address.slice(-4)}
          </span>
        </div>
        <Button onClick={handleDisconnect} variant="outline" size="sm">
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting || !hasMetaMask}
      className="bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600"
    >
      <Wallet className="w-4 h-4 mr-2" />
      {isConnecting ? "Connecting..." : !hasMetaMask ? "Install MetaMask" : "Connect Wallet"}
    </Button>
  )
}
