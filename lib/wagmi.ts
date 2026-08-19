import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { mainnet, sepolia } from "wagmi/chains"

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID

if (!projectId) {
  throw new Error(
    "Missing NEXT_PUBLIC_WC_PROJECT_ID — get one free at https://cloud.reown.com"
  )
}

export const config = getDefaultConfig({
  appName: "Get Flatlined",
  projectId,
  chains: [mainnet, sepolia], // drop sepolia when you go live
  ssr: true,
})