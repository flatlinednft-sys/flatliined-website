import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { mainnet, sepolia } from "wagmi/chains"

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID

if (!projectId) {
  throw new Error(
    "Missing NEXT_PUBLIC_WC_PROJECT_ID — get one free at https://cloud.reown.com"
  )
}

declare global {
  // eslint-disable-next-line no-var
  var __wagmiConfig: ReturnType<typeof getDefaultConfig> | undefined
}

export const config =
  globalThis.__wagmiConfig ??
  getDefaultConfig({
    appName: "Get Flatlined",
    projectId,
    chains: [mainnet, sepolia], // drop sepolia when you go live
    ssr: true,
  })

if (process.env.NODE_ENV !== "production") {
  globalThis.__wagmiConfig = config
}