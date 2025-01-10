import { http, createConfig } from 'wagmi'
import { etherlinkTestnet, mainnet, sepolia } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect, metaMask } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, sepolia, etherlinkTestnet],
  connectors: [
    metaMask(),
    injected(),
    coinbaseWallet(),
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [etherlinkTestnet.id]: http()
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
