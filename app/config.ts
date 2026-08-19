import { createConfig, http } from "wagmi"
import { mainnet } from "wagmi/chains"
import { getDefaultConfig } from "connectkit"

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID
if (!projectId) throw new Error("NEXT_PUBLIC_PROJECT_ID is not defined")

export const config = createConfig(
  getDefaultConfig({
    chains: [mainnet],
    transports: {
      [mainnet.id]: http(),
    },
    walletConnectProjectId: projectId,
    appName: "Flatlined",
    appDescription: "Flatlined Whitelist Access",
    appUrl: typeof window !== "undefined" ? window.location.origin : "https://flatlined.gg",
    appIcon: "https://flatlined.gg/images/flatlined.svg",
  })
)