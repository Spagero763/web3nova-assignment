"use client"

import type React from "react"
import { PrivyProvider } from "@privy-io/react-auth"

export function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
  // Your Privy App ID
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "cmcne26uk032oju0mrd9qo62x"

  // If the env var is missing, just render children
  if (!appId || appId === "your-privy-app-id") {
    return <>{children}</>
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        // Wallet connection settings
        loginMethods: ["wallet"],

        // Appearance settings
        appearance: {
          theme: "light",
          accentColor: "#0EA5E9",
          logo: undefined,
        },

        // Wallet settings
        embeddedWallets: {
          createOnLogin: "off", // Don't create embedded wallets
        },

        // Legal settings (required for some apps)
        legal: {
          termsAndConditionsUrl: undefined,
          privacyPolicyUrl: undefined,
        },

        // Chain configuration - simplified for Sepolia
        defaultChain: {
          id: 11155111,
          name: "Sepolia",
          network: "sepolia",
          nativeCurrency: {
            name: "Sepolia Ether",
            symbol: "ETH",
            decimals: 18,
          },
          rpcUrls: {
            default: {
              http: ["https://rpc.sepolia.org"],
            },
            public: {
              http: ["https://rpc.sepolia.org"],
            },
          },
          blockExplorers: {
            default: {
              name: "Sepolia Etherscan",
              url: "https://sepolia.etherscan.io",
            },
          },
        },

        supportedChains: [
          {
            id: 11155111,
            name: "Sepolia",
            network: "sepolia",
            nativeCurrency: {
              name: "Sepolia Ether",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: {
              default: {
                http: ["https://rpc.sepolia.org"],
              },
              public: {
                http: ["https://rpc.sepolia.org"],
              },
            },
            blockExplorers: {
              default: {
                name: "Sepolia Etherscan",
                url: "https://sepolia.etherscan.io",
              },
            },
          },
        ],
      }}
    >
      {children}
    </PrivyProvider>
  )
}
