'use client'

import React, { useState, useEffect } from 'react'

import { formatEther } from 'ethers'
import { useAccount, useReadContract } from 'wagmi'
import 'react-toastify/dist/ReactToastify.css'

import { Button } from '~/components/ui/button'
import { Link } from '~/i18n/link'
import { getDict } from '~/i18n/get-dict'

import { pceAddress } from '~/app/constants/constants'
import { PCE_ABI } from '~/app/ABIs/PCEToken'

import { PagePropsWithLocale, Dictionary } from '~/i18n/types'
import { localhost } from '~/app/providers'

export default function ForProposalPage({
  params: { locale, ...params },
}: PagePropsWithLocale<{}>) {
  const [dict, setDict] = useState<Dictionary | null>(null)
  const { address, chainId } = useAccount()

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

  const { data: votes, refetch: refetchVotes } = useReadContract({
    address: pceAddress[chainId || localhost.id] as `0x${string}`,
    abi: PCE_ABI,
    functionName: 'getVotes',
    args: [address],
  })

  const vote = dict?.vote ?? {}

  return (
    <div>
      <div className="links flex flex-row gap-10 items-center justify-center h-[50vh]">
        <Button className="w-40 py-6" variant="outline" asChild>
          <Link className="py-4" locale={locale} href="/pending">
            {vote.pending ?? ''}
          </Link>
        </Button>
        <Button className="w-40 py-6" variant="outline" asChild>
          <Link locale={locale} href="/closed">
            {vote.close ?? ''}
          </Link>
        </Button>
        <Button className="w-40 py-6" variant="outline" asChild>
          <Link locale={locale} href="/submit">
            {vote.submit ?? ''}
          </Link>
        </Button>

        <Button className="w-40 py-6" variant="outline" asChild>
          <Link className="text-center" locale={locale} href="/delegate">
            {vote.delegate ?? ''}
            {<br></br>} {votes ? formatEther(BigInt(votes as string)) : '0'}
          </Link>
        </Button>
      </div>
    </div>
  )
}
