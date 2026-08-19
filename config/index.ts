import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet } from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit/react'

export const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID' // Get free key at cloud.reown.com

export const networks = [mainnet]

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks
})

// Initialize AppKit
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  metadata: {
    name: 'Flatlined',
    description: 'Flatlined Whitelist Access',
    url: 'https://yourdomain.com',
    icons: ['https://yourdomain.com/images/flatlined.svg']
  },
  // Options to prioritize or featured specific mobile wallets
  featuredWalletIds: [
    '971e689d0a5de527ce299eef700c229e0e561a082163b4624d772993883b2830', // Robinhood Wallet ID
  ]
})