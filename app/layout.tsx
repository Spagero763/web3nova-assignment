import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

/* --- use the new client wrapper --- */
import PrivyProviderRoot from "./privy-provider-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Uniswap Clone - Sepolia",
  description: "A Uniswap-style DEX for Sepolia testnet",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PrivyProviderRoot>{children}</PrivyProviderRoot>
      </body>
    </html>
  )
}
