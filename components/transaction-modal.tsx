"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, ExternalLink, Loader2, XCircle } from "lucide-react"

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  txHash?: string | null
  isLoading: boolean
  error?: string | null
  title: string
}

export function TransactionModal({ isOpen, onClose, txHash, isLoading, error, title }: TransactionModalProps) {
  const explorerUrl = txHash ? `https://sepolia.etherscan.io/tx/${txHash}` : null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-6">
          {isLoading && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
              <p className="text-center text-muted-foreground">
                Confirming transaction...
                <br />
                <span className="text-sm">Please wait for confirmation</span>
              </p>
            </>
          )}

          {error && (
            <>
              <XCircle className="h-12 w-12 text-red-500" />
              <p className="text-center text-red-600">{error}</p>
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </>
          )}

          {txHash && !isLoading && !error && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="text-center text-green-600">Transaction successful!</p>
              <div className="flex gap-2">
                {explorerUrl && (
                  <Button asChild variant="outline">
                    <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
                      View on Etherscan
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button onClick={onClose}>Close</Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
