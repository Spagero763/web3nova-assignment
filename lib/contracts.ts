// Simplified contract addresses for Sepolia
export const UNISWAP_V2_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
export const UNISWAP_V2_FACTORY_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"

// Simplified contract interaction - using direct ethereum calls instead of viem
export const getTokenBalance = async (tokenAddress: string, userAddress: string) => {
  if (typeof window === "undefined" || !(window as any).ethereum) return "0"

  try {
    if (tokenAddress === "0x0000000000000000000000000000000000000000") {
      // ETH balance
      const result = await (window as any).ethereum.request({
        method: "eth_getBalance",
        params: [userAddress, "latest"],
      })
      const balanceInWei = Number.parseInt(result, 16)
      return (balanceInWei / Math.pow(10, 18)).toFixed(4)
    } else {
      // ERC20 balance - would need contract call
      return "0.0"
    }
  } catch (error) {
    console.error("Error getting balance:", error)
    return "0"
  }
}
