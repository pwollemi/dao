'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { formatEther } from 'ethers'
import { readContract } from '@wagmi/core'
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
} from 'wagmi'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import RingLoader from 'react-spinners/RingLoader'

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { shortenAddress, formatString } from '~/components/utils'
import useWindowWidth from '~/components/useWindWidth'

import { governorAddress } from '~/app/constants/constants'
import { GOVERNOR_ABI } from '~/app/ABIs/Governor'

import { config } from '~/lib/config'
import { PagePropsWithLocale, Dictionary } from '~/i18n/types'
import { getDict } from '~/i18n/get-dict'
import { ringStyle } from '~/app/constants/styles'
import { sepolia } from 'wagmi/chains'
import { localhost } from '~/app/providers'

export default function ForClosedPage({
  params: { locale, ...params },
}: PagePropsWithLocale<{}>) {
  const [dict, setDict] = useState<Dictionary | null>(null)
  const width = useWindowWidth()
  const colSpan = width < 1280
  let [loading, setLoading] = useState(true)

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

  const { chainId } = useAccount()
  const { data: hash, error, writeContract } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const [proposals, setProposals] = useState<any[]>([])
  const [proposalStatus, setStatus] = useState<any[]>([])

  const { data: proposalCount, refetch: refetchProposalCount } =
    useReadContract({
      address: governorAddress[chainId || localhost.id] as `0x${string}`,
      abi: GOVERNOR_ABI,
      functionName: 'proposalCount',
      args: [],
    })

  useEffect(() => {
    if (isConfirmed) {
      toast.success(
        <Link
          href={`${
            chainId === sepolia.id
              ? sepolia.blockExplorers?.default?.url
              : localhost.blockExplorers?.default?.url
          }${hash}`}
          target="_blank"
        >
          Transaction Succeed!
        </Link>
      )
    } else if (isConfirming) {
      toast.info(<div className="disabled">TX is Pending, Please Wait...</div>)
    } else if (error) {
      toast.error((error as BaseError).shortMessage)
    }
  }, [isConfirmed, isConfirming, error, hash])

  const fetchData = async (count: number) => {
    if (!count) return

    const proposalPromises = []
    const statusPromises = []

    for (let i = 1; i <= count; i++) {
      proposalPromises.push(
        readContract(config, {
          address: governorAddress[chainId || localhost.id] as `0x${string}`,
          abi: GOVERNOR_ABI,
          functionName: 'proposals',
          args: [i],
        })
      )
      statusPromises.push(
        readContract(config, {
          address: governorAddress[chainId || localhost.id] as `0x${string}`,
          abi: GOVERNOR_ABI,
          functionName: 'state',
          args: [i],
        })
      )
    }

    const [proposals, statuses] = await Promise.all([
      Promise.all(proposalPromises),
      Promise.all(statusPromises),
    ])

    const statusLabels = statuses.map((status) => {
      switch (status as number) {
        case 2:
          return 'Canceled'
        case 3:
          return 'Defeated'
        case 6:
          return 'Expired'
        case 7:
          return 'Executed'
        default:
          return 'Unknown'
      }
    })

    setProposals(proposals)
    setStatus(statusLabels)
    setLoading(false)
  }

  useEffect(() => {
    fetchData(proposalCount as number)
  }, [proposalCount])

  const dashboard = dict?.dashboard ?? {}
  const proposal = dict?.proposal ?? {}
  const closed = dict?.closed ?? {}

  return (
    <div className="w-full">
      <div className="mx-8 gap-4 flex-col flex">
        <h2 className="text-2xl font-bold tracking-tight mt-6">
          {closed.title ?? ''}
        </h2>
        <div className="rounded-xl flex border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{proposal.proposalId ?? ''}</TableHead>
                <TableHead>{proposal.proposer ?? ''}</TableHead>
                <TableHead className="max-xl:hidden">
                  {proposal.forVote ?? ''}
                </TableHead>
                <TableHead className="max-xl:hidden">
                  {proposal.againstVote ?? ''}
                </TableHead>
                <TableHead>{proposal.status ?? ''}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals &&
                proposals.map((proposal, index) => (
                  <TableRow key={proposal[0]}>
                    <TableCell className="font-medium">
                      {formatString(proposal[0])}
                    </TableCell>
                    <TableCell>{shortenAddress(proposal[1])}</TableCell>
                    <TableCell className="font-medium max-xl:hidden">
                      {formatString(formatEther(proposal[5]))}
                    </TableCell>
                    <TableCell className="font-medium max-xl:hidden">
                      {formatString(formatEther(proposal[6]))}
                    </TableCell>
                    <TableCell>{proposalStatus[index]}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={colSpan ? 2 : 4}>
                  {proposal.total ?? ''}
                </TableCell>
                <TableCell>{proposals.length}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <ToastContainer position="bottom-right" draggable></ToastContainer>

        <RingLoader
          color={'#000000'}
          loading={loading}
          cssOverride={ringStyle}
          size={50}
        />
      </div>
    </div>
  )
}
