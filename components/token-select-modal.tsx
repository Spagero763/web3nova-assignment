"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { type Token, SEPOLIA_TOKENS } from "@/lib/tokens"
import Image from "next/image"

interface TokenSelectModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectToken: (token: Token) => void
  selectedToken?: Token
}

export function TokenSelectModal({ isOpen, onClose, onSelectToken, selectedToken }: TokenSelectModalProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTokens = SEPOLIA_TOKENS.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectToken = (token: Token) => {
    onSelectToken(token)
    onClose()
    setSearchQuery("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-semibold">Select a token</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search name or paste address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>

        <div className="space-y-1 max-h-80 overflow-y-auto">
          {filteredTokens.map((token) => (
            <Button
              key={token.address}
              variant="ghost"
              className="w-full justify-start h-auto p-3 hover:bg-muted/50"
              onClick={() => handleSelectToken(token)}
              disabled={selectedToken?.address === token.address}
            >
              <div className="flex items-center gap-3 w-full">
                <Image
                  src={token.logoURI || "/placeholder.svg"}
                  alt={token.symbol}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div className="flex flex-col items-start">
                  <div className="font-medium">{token.symbol}</div>
                  <div className="text-sm text-muted-foreground">{token.name}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
