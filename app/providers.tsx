"use client"

import "@rainbow-me/rainbowkit/styles.css"
import React, { ReactNode, useState } from "react"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit"
import { config } from "@/lib/wagmi"

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          theme={darkTheme({
            accentColor: "#d4ff00",
            accentColorForeground: "#000000",
            borderRadius: "none",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default Providers