'use client'

import React, { useState, useEffect } from 'react'

import copy from 'clipboard-copy'
import { Link } from 'react-router-dom'
import { useDisconnect, useAccount, useBalance } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { getDict } from '~/i18n/get-dict'
import { Dictionary } from '~/i18n/types'

import { LINKS, shortenAddress } from '~/components/utils'

import TwitterIcon from '../../../public/svg/twitter'
import DiscordIcon from '../../../public/svg/discord'
import { Locale } from '~/i18n/types'
import { UserNav } from '../user-nav'

function AppBar({ locale }: { locale: Locale }) {
  const [dict, setDict] = useState<Dictionary | null>(null)

  const { disconnect } = useDisconnect()
  const { openConnectModal } = useConnectModal()
  const { address, isConnected, chain } = useAccount()
  const { data: balance, isError: isBalanceError } = useBalance({
    address,
    chainId: chain?.id,
  })

  useEffect(() => {
    const fetchDict = async () => {
      try {
        const fetchedDict = await getDict(locale)
        setDict(fetchedDict)
      } catch (error) {
        console.error('Error fetching dictionary:', error)
      }
    }
    fetchDict()
  }, [locale])

  const navigation = dict?.navigation ?? {}

  return (
    <header className="border-gray94 py-[12px] sticky top-0 z-40  border-b-2 border-opacity-50">
      <div className="standardContainer flex justify-between items-center container">
        <div className="flex gap-4 ml-auto flex-row items-center mr-4">
          <Button
            className={`${
              !isConnected ? 'hidden' : 'xl:flex'
            } mx-auto border-2 border-oil bg-transparent hover:bg-whiteDark text-oil text-base`}
          >
            {balance ? Number(balance.formatted).toFixed(4) : '0'}{' '}
            {balance?.symbol === 'MATIC' ? 'POL' : balance?.symbol}
          </Button>

          <Button
            className={`${
              !isConnected ? 'hidden' : 'xl:flex'
            } mx-auto border-2 border-oil bg-transparent hover:bg-whiteDark text-oil text-base max-md:hidden`}
          >
            {chain ? chain.name : 'Localhost'}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="hidden xl:visible xl:flex mx-auto border-2 border-oil bg-transparent hover:bg-whiteDark text-oil text-base h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                onClick={() => {
                  if (!isConnected && openConnectModal) {
                    openConnectModal()
                  }
                }}
              >
                <div>
                  {isConnected
                    ? shortenAddress(address)
                    : dict
                      ? dict.navigation.connect
                      : ''}
                </div>
              </Button>
            </DropdownMenuTrigger>
            {isConnected ? (
              <DropdownMenuContent
                className="w-36 items-center flex flex-col"
                align="end"
                forceMount
              >
                <DropdownMenuItem
                  onClick={() => {
                    copy(address ? address : '')
                  }}
                >
                  {navigation.copyAddress ?? ''}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    disconnect()
                  }}
                >
                  {navigation.disconnect ?? ''}
                </DropdownMenuItem>
              </DropdownMenuContent>
            ) : (
              ''
            )}
          </DropdownMenu>
          <Link
            className="max-md:hidden"
            to={LINKS.TWITTER.link}
            target="_blank"
          >
            <TwitterIcon colorClass="fill-oil" />
          </Link>
          <Link
            className="max-md:hidden"
            to={LINKS.DISCORD.link}
            target="_blank"
          >
            <DiscordIcon colorClass="fill-oil" />
          </Link>
          <div className="max-md:hidden">
            <UserNav locale={locale}></UserNav>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AppBar
