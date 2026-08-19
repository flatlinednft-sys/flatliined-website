"use client"

import "@rainbow-me/rainbowkit/styles.css"

import { ReactNode, useState } from "react"

import {
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit"

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

import { WagmiProvider } from "wagmi"

import { config, robinhoodChain } from "@/lib/wagmi"

export function Providers({
  children,
}: {
  children: ReactNode
}) {
  const [queryClient] = useState(
    () => new QueryClient()
  )

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={robinhoodChain}
          modalSize="compact"
          theme={darkTheme({
            accentColor: "#d4ff00",
            accentColorForeground: "#000000",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default Providers