import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { http } from "wagmi"
import type { Chain } from "wagmi/chains"

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_WC_PROJECT_ID")
}

/**
 * Robinhood Chain Mainnet
 *
 * Official:
 * Chain ID: 4663
 * Native currency: ETH
 * RPC: https://rpc.mainnet.chain.robinhood.com
 */
export const robinhoodChain = {
  id: 4663,
  name: "Robinhood Chain",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.mainnet.chain.robinhood.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Robinhood Chain Explorer",
      url: "https://robinhoodchain.blockscout.com",
    },
  },
} as const satisfies Chain

declare global {
  // eslint-disable-next-line no-var
  var __wagmiConfig:
    | ReturnType<typeof getDefaultConfig>
    | undefined
}

export const config =
  globalThis.__wagmiConfig ??
  getDefaultConfig({
    appName: "Get Flatlined",
    projectId,

    // Your NFT is on Robinhood Chain.
    chains: [robinhoodChain],

    // Browser wallet requests use the public Robinhood RPC.
    // Your Alchemy key is NOT exposed to users.
    transports: {
      [robinhoodChain.id]: http(
        "https://rpc.mainnet.chain.robinhood.com"
      ),
    },

    // Required for Next.js SSR.
    ssr: true,
  })

if (process.env.NODE_ENV !== "production") {
  globalThis.__wagmiConfig = config
}