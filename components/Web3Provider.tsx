"use client"

import React, { ReactNode } from "react"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConnectKitProvider } from "connectkit"

// Fix: Import config from your local file, NOT "process"
import { config } from "@/app/config"// or "../config" / "./config" depending on file location

const queryClient = new QueryClient()

export default function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="midnight"
          customTheme={{
            "--ck-font-family": "monospace",
            "--ck-border-radius": "0px",
            "--ck-accent-color": "#d4ff00",
            "--ck-accent-text-color": "#000000",
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}