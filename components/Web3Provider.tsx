'use client'

import React, { ReactNode } from 'react'
import { wagmiAdapter, projectId } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { mainnet } from '@reown/appkit/networks'
import { WagmiProvider } from 'wagmi'

const queryClient = new QueryClient()

if (!projectId) throw new Error('Project ID is not defined')

// Metadata configuration
const metadata = {
  name: 'Flatlined',
  description: 'Flatlined Whitelist Access',
  url: 'https://flatlined.gg', // Matches your production domain
  icons: ['https://flatlined.gg/images/flatlined.svg']
}

// Create AppKit Modal Instance
createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet],
  metadata,
  projectId,
  features: {
    analytics: true
  }
})

export default function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}