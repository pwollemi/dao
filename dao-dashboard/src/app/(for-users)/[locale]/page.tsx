'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

import {
  pceAddress,
  governorAddress,
  bountyAddress,
} from '~/app/constants/constants'
import { ringStyle } from '~/app/constants/styles'

import { formatString } from '~/components/utils'
import { BOUNTY_ABI } from '~/app/ABIs/Bounty'
import { PCE_ABI } from '~/app/ABIs/PCEToken'
import { GOVERNOR_ABI } from '~/app/ABIs/Governor'
import { PagePropsWithLocale, Dictionary } from '~/i18n/types'
import { getDict } from '~/i18n/get-dict'

import { useEffect, useState } from 'react'
import { formatEther } from 'ethers'
import { readContract } from '@wagmi/core'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAccount, useReadContract } from 'wagmi'

import { config } from '~/lib/config'

import RingLoader from 'react-spinners/RingLoader'
import { localhost } from '~/app/providers'
export default function ForUsersIndexPage({
  params: { locale, ...params },
}: PagePropsWithLocale<{}>) {
  const [dict, setDict] = useState<Dictionary | null>(null)
  const { address, chainId } = useAccount()
  const [proposals, setProposals] = useState<any[]>([])
  const [proposalStatus, setStatus] = useState<any[]>([])
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

  const getWithdrawnAmount = (bountyInfo: unknown): string => {
    if (
      Array.isArray(bountyInfo) &&
      bountyInfo.length > 0 &&
      typeof bountyInfo[0] === 'bigint'
    ) {
      return formatEther(bountyInfo[1] as bigint)
    }
    return '0'
  }

  const { data: pceBalance, refetch: refetchBalance } = useReadContract({
    address: pceAddress[chainId || localhost.id] as `0x${string}`,
    abi: PCE_ABI,
    functionName: 'balanceOf',
    args: [address],
  })

  const { data: contributorBounties, refetch: refetchContributorBounties } =
    useReadContract({
      address: bountyAddress[chainId || localhost.id] as `0x${string}`,
      abi: BOUNTY_ABI,
      functionName: 'contributorBounties',
      args: [address],
    })

  const { data: proposalCount, refetch: refetchProposalCount } =
    useReadContract({
      address: governorAddress[chainId || localhost.id] as `0x${string}`,
      abi: GOVERNOR_ABI,
      functionName: 'proposalCount',
      args: [],
    })

  const fetchData = async (count: any) => {
    if (count == undefined || count == 0) {
      setLoading(false)
      return
    }

    let temp = []
    let _status = []
    for (let i = 1; i <= count; i++) {
      let proposal = null
      let status = null
      try {
        proposal = await readContract(config, {
          address: governorAddress[chainId || localhost.id] as `0x${string}`,
          abi: GOVERNOR_ABI,
          functionName: 'proposals',
          args: [i],
        })

        status = await readContract(config, {
          address: governorAddress[chainId || localhost.id] as `0x${string}`,
          abi: GOVERNOR_ABI,
          functionName: 'state',
          args: [i],
        })
      } catch (error) {
        i--
        continue
      }

      switch (status as number) {
        case 7:
          _status.push('Executed')
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
      }
    }
    setProposals(temp)
    setStatus(_status)
    setLoading(false)
  }

  useEffect(() => {
    fetchData(proposalCount)
  }, [proposalCount])

  const navigation = dict?.navigation ?? {}
  const dashboard = dict?.dashboard ?? {}
  const proposal = dict?.proposal ?? {}
  return (
    <>
      <div className="w-full">
        <div className="m-8 gap-4 flex flex-col">
          <h2 className="text-2xl font-bold tracking-tight mt-6">
            {navigation.dashboard ?? ''}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {dashboard.totalproposals ?? ''}
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{proposals.length}</div>
                <p className="text-xs text-muted-foreground"></p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {dashboard.totalrevenue ?? ''}
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {contributorBounties
                    ? formatString(getWithdrawnAmount(contributorBounties))
                    : '0'}{' '}
                  PCE
                </div>
                <p className="text-xs text-muted-foreground"></p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {dashboard.pcebalance ?? ''}
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {pceBalance
                    ? formatString(formatEther(pceBalance as bigint))
                    : '0'}{' '}
                  PCE
                </div>
                <p className="text-xs text-muted-foreground"></p>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>{dashboard.recent ?? ''}</CardTitle>
                <CardDescription>
                  {dashboard.made ?? ''} {proposals.length}{' '}
                  {dashboard.proposal_success ?? ''}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-xl">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{proposal.proposalId ?? ''}</TableHead>
                        <TableHead>{proposal.forVote ?? ''}</TableHead>
                        <TableHead>{proposal.againstVote ?? ''}</TableHead>
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
                            <TableCell className="font-medium">
                              {formatString(formatEther(proposal[5]))}
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatString(formatEther(proposal[6]))}
                            </TableCell>
                            <TableCell className="font-medium">
                              {proposalStatus[index]}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={3}>
                          {proposal.total ?? ''}
                        </TableCell>
                        <TableCell>{proposals.length}</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <ToastContainer position="bottom-right" draggable></ToastContainer>

        <RingLoader
          color={'#000000'}
          loading={loading}
          cssOverride={ringStyle}
          size={50}
        />
      </div>
    </>
  )
}
