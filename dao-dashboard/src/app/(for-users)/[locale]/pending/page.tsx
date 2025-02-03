'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { formatEther } from 'ethers'
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
} from 'wagmi'
import { readContract } from '@wagmi/core'
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
import { Button } from '~/components/ui/button'
import useWindowWidth from '~/components/useWindWidth'

import { shortenAddress, formatString } from '~/components/utils'

import { pceAddress, governorAddress } from '~/app/constants/constants'
import { ringStyle } from '~/app/constants/styles'
import { PCE_ABI } from '~/app/ABIs/PCEToken'
import { GOVERNOR_ABI } from '~/app/ABIs/Governor'

import { config } from '~/lib/config'
import { PagePropsWithLocale, Dictionary } from '~/i18n/types'
import { getDict } from '~/i18n/get-dict'
import { sepolia } from 'wagmi/chains'
import { localhost } from '~/app/providers'

export default function ForPendingPage({
  params: { locale, ...params },
}: PagePropsWithLocale<{}>) {
  const [dict, setDict] = useState<Dictionary | null>(null)
  const width = useWindowWidth()
  const colSpan = width < 1280

  let [loading, setLoading] = useState(true)

  let blockTimestamp = Date.now() / 1000

  const { address, chainId } = useAccount()
  const { data: hash, error, writeContract } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const [proposals, setProposals] = useState<any[]>([])
  const [proposalStatus, setStatus] = useState<any[]>([])

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

  const { data: proposalCount, refetch: refetchProposalCount } =
    useReadContract({
      address: governorAddress[chainId || localhost.id] as `0x${string}`,
      abi: GOVERNOR_ABI,
      functionName: 'proposalCount',
      args: [],
    })

  useEffect(() => {
    const notify = async () => {
      if (isConfirmed) {
        toast.success(
          <Link
            href={`${
              chainId === sepolia.id
                ? sepolia.blockExplorers?.default?.url
                : localhost.blockExplorers?.default?.url
            }/tx/${hash}`}
            target="_blank"
          >
            Transaction Succeed!
          </Link>
        )
      } else if (isConfirming) {
        toast.info(
          <div className="disabled">TX is Pending, Please Wait...</div>
        )
      } else if (error) {
        toast.error((error as BaseError).shortMessage)
      }
    }

    notify()
  }, [isConfirmed, isConfirming, error, hash])

  const fetchData = async (count: any) => {
    if (!count) return
    let temp = []
    let _status = []
    for (let i = 1; i <= count; i++) {
      const proposal = await readContract(config, {
        address: governorAddress[chainId || localhost.id] as `0x${string}`,
        abi: GOVERNOR_ABI,
        functionName: 'proposals',
        args: [i],
      })
      const status = await readContract(config, {
        address: governorAddress[chainId || localhost.id] as `0x${string}`,
        abi: GOVERNOR_ABI,
        functionName: 'state',
        args: [i],
      })

      switch (status as number) {
        case 0:
          _status.push('Pending')
          temp.push(proposal)
          break
        case 1:
          _status.push('Active')
          temp.push(proposal)
          break
        case 4:
          _status.push('Succeeded')
          temp.push(proposal)
          break
        case 5:
          _status.push('Queued')
          temp.push(proposal)
          break
        default:
          break
      }
    }
    setProposals(temp)
    setStatus(_status)
    setLoading(false)
  }

  useEffect(() => {
    fetchData(proposalCount)
  }, [proposalCount, isConfirmed])

  const propose = dict?.proposal ?? {}
  const pending = dict?.pending ?? {}

  return (
    <div className="w-full">
      <div className="mx-8 gap-4 flex-col flex">
        <h2 className="text-2xl font-bold tracking-tight mt-6">
          {pending.title ?? ''}
        </h2>

        <div className="gap-4 flex flex-col">
          <p className="text-muted-foreground">
            {pending.votingPower ?? ''}
            {' : '}
            {votes ? formatString(formatEther(BigInt(votes as string))) : '0'}
          </p>

          <div className="border rounded-xl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{propose.proposalId ?? ''}</TableHead>
                  <TableHead className="max-xl:hidden">
                    {propose.proposer ?? ''}
                  </TableHead>
                  <TableHead className="max-xl:hidden">
                    {propose.forVote ?? ''}
                  </TableHead>
                  <TableHead className="max-xl:hidden">
                    {propose.againstVote ?? ''}
                  </TableHead>
                  <TableHead className="max-xl:hidden">
                    {propose.status ?? ''}
                  </TableHead>
                  <TableHead>{propose.castVote ?? ''}</TableHead>
                  <TableHead>{propose.execute ?? ''}</TableHead>
                  <TableHead>{propose.queue ?? ''}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposals &&
                  proposals.map((proposal, index) => (
                    <TableRow key={proposal[0]}>
                      <TableCell className="font-medium">
                        {formatString(proposal[0])}
                      </TableCell>
                      <TableCell className="max-xl:hidden">
                        {shortenAddress(proposal[1])}
                      </TableCell>
                      <TableCell className="font-medium max-xl:hidden">
                        {formatString(formatEther(proposal[5]))}
                      </TableCell>
                      <TableCell className="font-medium max-xl:hidden">
                        {formatString(formatEther(proposal[6]))}
                      </TableCell>
                      <TableCell className="font-medium max-xl:hidden">
                        {proposalStatus[index]}
                      </TableCell>
                      <TableCell className="flex max-xl:flex-col flex-row gap-2">
                        <Button
                          disabled={proposalStatus[index] != 'Active'}
                          onClick={() => {
                            writeContract({
                              abi: GOVERNOR_ABI,
                              address: governorAddress[
                                chainId || localhost.id
                              ] as `0x${string}`,
                              functionName: 'castVote',
                              args: [proposal[0], true],
                            })
                          }}
                        >
                          {propose.forVote ?? ''}
                        </Button>
                        <Button
                          disabled={proposalStatus[index] != 'Active'}
                          className="xl:ml-2"
                          onClick={() => {
                            writeContract({
                              abi: GOVERNOR_ABI,
                              address: governorAddress[
                                chainId || localhost.id
                              ] as `0x${string}`,
                              functionName: 'castVote',
                              args: [proposal[0], false],
                            })
                          }}
                        >
                          {propose.againstVote ?? ''}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          disabled={
                            blockTimestamp < proposals[index][2] ||
                            proposalStatus[index] != 'Queued'
                          }
                          onClick={() => {
                            writeContract({
                              abi: GOVERNOR_ABI,
                              address: governorAddress[
                                chainId || localhost.id
                              ] as `0x${string}`,
                              functionName: 'execute',
                              args: [proposal[0]],
                            })
                          }}
                        >
                          {propose.execute ?? ''}
                        </Button>
                      </TableCell>

                      <TableCell>
                        <Button
                          disabled={proposalStatus[index] != 'Succeeded'}
                          onClick={() => {
                            writeContract({
                              abi: GOVERNOR_ABI,
                              address: governorAddress[
                                chainId || localhost.id
                              ] as `0x${string}`,
                              functionName: 'queue',
                              args: [proposal[0]],
                            })
                          }}
                        >
                          {propose.queue ?? ''}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={colSpan ? 3 : 7}>
                    {propose.total ?? ''}
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
    </div>
  )
}
