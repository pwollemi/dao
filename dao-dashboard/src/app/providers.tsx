'use client'

import { Env } from '~/env'

import * as React from 'react'
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit'
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { sepolia } from 'wagmi/chains'
import { defineChain } from 'viem'

export const localhost = defineChain({
  id: 31337,
  name: 'Localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
  },
})

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, WagmiProvider } from 'wagmi'

import { RouterProvider } from 'react-router-dom'
import router from './router'

const { wallets } = getDefaultWallets()

const config = getDefaultConfig({
  appName: 'PCE Dashboard',
  projectId: Env.NEXT_PUBLIC_WC_PROJECT_ID,
  wallets: [
    ...wallets,
    {
      groupName: 'Other',
      wallets: [argentWallet, trustWallet, ledgerWallet],
    },
  ],
  chains: [sepolia, localhost],
  ssr: true,
  transports: {
    [sepolia.id]: http(Env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
    [localhost.id]: http(Env.NEXT_PUBLIC_LOCALHOST_RPC_URL),
  },
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <RouterProvider router={router} />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  )
}
