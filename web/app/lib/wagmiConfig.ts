
import { createConfig, http } from 'wagmi'
import { mainnet, baseSepolia,rootstockTestnet,flowTestnet } from 'wagmi/chains'
import { injected, metaMask, safe } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet,flowTestnet ],
  connectors: [injected(), metaMask(), safe()],
  transports: {
    [mainnet.id]: http(),
    [flowTestnet.id]: http(),
  },
})
