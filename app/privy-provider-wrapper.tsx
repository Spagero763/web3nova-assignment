"use client"

import type { ReactNode } from "react"
import dynamic from "next/dynamic"

/* Dynamically import the real Privy provider on the **client only** */
const PrivyProviderWrapper = dynamic(() => import("@/components/privy-provider").then((m) => m.PrivyProviderWrapper), {
  ssr: false,
})

export default function PrivyProviderRoot({ children }: { children: ReactNode }) {
  return <PrivyProviderWrapper>{children}</PrivyProviderWrapper>
}
