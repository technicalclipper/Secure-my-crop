import { createConfig, http } from 'wagmi'
import { injected, metaMask, safe } from 'wagmi/connectors'

// Flow EVM Testnet (Chain ID 545) - the actual network the user is connected to
const flowEVMTestnet = {
  id: 545,
  name: 'Flow EVM Testnet',
  network: 'flow-evm-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'FLOW',
    symbol: 'FLOW',
  },
  rpcUrls: {
    default: { http: ['https://testnet.evm.nodes.onflow.org'] },
    public: { http: ['https://testnet.evm.nodes.onflow.org'] },
  },
  blockExplorers: {
    default: { name: 'FlowScan', url: 'https://evm-testnet.flowscan.io' },
  },
} as const

export const config = createConfig({
  chains: [flowEVMTestnet],
  connectors: [injected(), metaMask(), safe()],
  transports: {
    [flowEVMTestnet.id]: http(),
  },
})
