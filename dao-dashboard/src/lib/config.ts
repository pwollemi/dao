import { http, createConfig } from '@wagmi/core'
import { sepolia } from 'wagmi/chains'
import { localhost } from '~/app/providers'
import { Env } from '~/env'

export const config = createConfig({
  chains: [sepolia, localhost],
  transports: {
    [sepolia.id]: http(Env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
    [localhost.id]: http(Env.NEXT_PUBLIC_LOCALHOST_RPC_URL),
  },
  multiInjectedProviderDiscovery: false,
  syncConnectedChain: true,
})
