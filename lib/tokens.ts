export interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI: string
}

export const SEPOLIA_TOKENS: Token[] = [
  {
    address: "0x0000000000000000000000000000000000000000",
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    logoURI: "/placeholder.svg?height=32&width=32",
  },
  {
    address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    logoURI: "/placeholder.svg?height=32&width=32",
  },
]
