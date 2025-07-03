import { SwapInterface } from "@/components/swap-interface"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4">
      <div className="container mx-auto pt-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Uniswap Clone
          </h1>
          <p className="text-muted-foreground">Swap tokens on Sepolia testnet</p>
        </div>
        <SwapInterface />
      </div>
    </main>
  )
}
