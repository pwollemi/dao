'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import { formatEther } from 'ethers'
import { createClient, http, parseEther } from 'viem'
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
} from 'wagmi'
import { readContract } from '@wagmi/core'

import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '~/components/ui/table'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { shortenAddress, formatString } from '~/components/utils'

import {
  pceAddress,
  bountyAddress,
  governorAddress,
  SUBGRAPH_URL,
} from '~/app/constants/constants'
import { PCE_ABI } from '~/app/ABIs/PCEToken'
import { BOUNTY_ABI } from '~/app/ABIs/Bounty'
import { GOVERNOR_ABI } from '~/app/ABIs/Governor'

import { config } from '~/lib/config'
import {
  PagePropsWithLocale,
  Contributor,
  Proposal,
  Dictionary,
} from '~/i18n/types'
import { getDict } from '~/i18n/get-dict'

import { localhost } from '~/app/providers'
import { sepolia } from 'wagmi/chains'

export default function ForBountyPage({
  params: { locale, ...params },
}: PagePropsWithLocale<{}>) {
  const [dict, setDict] = useState<Dictionary | null>(null)

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
  const { address, chainId } = useAccount()
  const { data: hash, error, writeContractAsync } = useWriteContract()

  const client = new ApolloClient({
    uri: SUBGRAPH_URL[chainId || localhost.id] as string,
    cache: new InMemoryCache(),
  })

  const [proposalData, setProposalData] = useState<Proposal[]>([])
  const [contributorData, setContributorData] = useState<Contributor[]>([])

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const [provider, setProvider] = useState<any>(null)
  useEffect(() => {
    if (chainId) {
      const provider = createClient({
        chain: chainId === sepolia.id ? sepolia : localhost,
        transport: http(),
      })
      setProvider(provider)
    }
  }, [chainId])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await client.query({
          query: gql`
            query totalBounties {
              contributorTotalBounties(
                first: 10
                orderBy: totalAmount
                orderDirection: desc
              ) {
                totalAmount
                id
                contributor
              }
            }
          `,
        })

        setContributorData(data.contributorTotalBounties)
      } catch (error) {
        console.error('Error fetching data', error)
      }
    }

    fetchData()
  }, [isConfirmed])

  const [bountyAmount, setBountyAmount] = useState('')
  const [contributorAddr, setContributorAddr] = useState('')
  const [proposalId, setProposalId] = useState('')

  const { data: pceBalance, refetch: refetchBalance } = useReadContract({
    address: pceAddress[chainId || localhost.id] as `0x${string}`,
    abi: PCE_ABI,
    functionName: 'balanceOf',
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
    const readProposalData = async () => {
      if (proposalCount == undefined) return
      let _proposalData: Proposal[] = []
      for (let i = 0; i < parseInt(proposalCount as string); i++) {
        const amount = await readContract(config, {
          abi: BOUNTY_ABI,
          address: bountyAddress[chainId || localhost.id] as `0x${string}`,
          functionName: 'proposalBounties',
          args: [i],
        })

        if ((amount as number) > 0)
          _proposalData.push({ id: i.toString(), amount: amount as bigint })
      }
      setProposalData(_proposalData)
    }
    readProposalData()
  }, [proposalCount])

  const { data: contributorBounties, refetch: refetchContributorBounties } =
    useReadContract({
      address: bountyAddress[chainId || localhost.id] as `0x${string}`,
      abi: BOUNTY_ABI,
      functionName: 'contributorBounties',
      args: [address],
    })

  const { data: _amount, refetch: refetchBountyAmount } = useReadContract({
    address: bountyAddress[chainId || localhost.id] as `0x${string}`,
    abi: BOUNTY_ABI,
    functionName: 'bountyAmount',
    args: [],
  })

  const refetchData = async () => {
    await refetchBalance()
    await refetchBountyAmount()
    await refetchContributorBounties()
  }
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.target.name
    const value = event.target.value

    if (name === 'bountyAmount') {
      setBountyAmount(value)
    } else if (name === 'contributorAddr') {
      setContributorAddr(value)
    } else if (name === 'proposalId') {
      setProposalId(value)
    }
  }

  const handleClaimProposalBounty = async () => {
    try {
      const claimProposalBountyTX = await writeContractAsync({
        abi: BOUNTY_ABI,
        address: bountyAddress[chainId || localhost.id] as `0x${string}`,
        functionName: 'claimProposalBounty',
        args: [proposalId],
      })

      await provider.waitForTransaction(claimProposalBountyTX)
    } catch (error) {
      toast.error((error as BaseError).shortMessage)
    }
  }

  const handleClaimContributorBounty = async () => {
    try {
      const claimContributorBountyTX = await writeContractAsync({
        abi: BOUNTY_ABI,
        address: bountyAddress[chainId || localhost.id] as `0x${string}`,
        functionName: 'claimContributorBounty',
        args: [],
      })

      await provider.waitForTransaction(claimContributorBountyTX)

      await refetchData()
    } catch (error) {
      toast.error((error as BaseError).shortMessage)
    }
  }

  const handleAddProposalBounty = async () => {
    try {
      const allowance = await readContract(config, {
        abi: PCE_ABI,
        address: pceAddress[chainId || localhost.id] as `0x${string}`,
        functionName: 'allowance',
        args: [address, bountyAddress],
      })

      if ((BigInt(allowance as string) as bigint) <= parseEther(bountyAmount)) {
        const tx = await writeContractAsync(
          {
            abi: PCE_ABI,
            address: pceAddress[chainId || localhost.id] as `0x${string}`,
            functionName: 'approve',
            args: [
              bountyAddress[chainId || localhost.id] as `0x${string}`,
              parseEther(bountyAmount),
            ],
          },
          {
            onSuccess: (data) => {},
            onError: (error) => {
              console.error('Transaction error:', error)
            },
          }
        )
      }
      const addProposalBountyTX = await writeContractAsync({
        abi: BOUNTY_ABI,
        address: bountyAddress[chainId || localhost.id] as `0x${string}`,
        functionName: 'addProposalBounty',
        args: [proposalId, parseEther(bountyAmount)],
      })

      provider.waitForTransaction(addProposalBountyTX)

      await refetchData()
    } catch (error) {
      toast.error((error as BaseError).shortMessage)
    }
  }

  const handleAddContributorBounty = async () => {
    try {
      const allowance = await readContract(config, {
        abi: PCE_ABI,
        address: pceAddress[chainId || localhost.id] as `0x${string}`,
        functionName: 'allowance',
        args: [address, bountyAddress],
      })

      if ((BigInt(allowance as string) as bigint) < parseEther(bountyAmount)) {
        const tx = await writeContractAsync(
          {
            abi: PCE_ABI,
            address: pceAddress[chainId || localhost.id] as `0x${string}`,
            functionName: 'approve',
            args: [
              bountyAddress[chainId || localhost.id] as `0x${string}`,
              parseEther(bountyAmount),
            ],
          },
          {
            onSuccess: (data) => {},
            onError: (error) => {
              console.error('Transaction error:', error)
            },
          }
        )
      }
      const addContributorBountyTX = await writeContractAsync({
        abi: BOUNTY_ABI,
        address: bountyAddress[chainId || localhost.id] as `0x${string}`,
        functionName: 'addContributorBounty',
        args: [contributorAddr, parseEther(bountyAmount)],
      })

      await provider.waitForTransaction(addContributorBountyTX)

      await refetchData()
    } catch (error) {
      toast.error((error as BaseError).shortMessage)
    }
  }

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

        setBountyAmount('')
        setContributorAddr('')

        await refetchData()
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

  const getClaimableAmount = (bountyInfo: unknown): string => {
    if (
      Array.isArray(bountyInfo) &&
      bountyInfo.length > 0 &&
      typeof bountyInfo[0] === 'bigint' &&
      typeof bountyInfo[1] === 'bigint'
    ) {
      return formatEther((bountyInfo[0] - bountyInfo[1]) as bigint)
    }
    return '0'
  }

  const dashboard = dict?.dashboard ?? {}
  const bounty = dict?.bounty ?? {}
  const proposal = dict?.proposal ?? {}

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 mx-8">
        <h2 className="text-2xl font-bold tracking-tight mt-6">
          {bounty.title ?? ''}
        </h2>
        <p className="text-muted-foreground">{bounty.description ?? ''}</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {contributorBounties
                  ? formatString(getWithdrawnAmount(contributorBounties))
                  : '0'}{' '}
                PCE
              </div>
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
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pceBalance
                  ? formatString(formatEther(pceBalance as bigint))
                  : '0'}{' '}
                PCE
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {dashboard.claimable ?? ''}
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
              <div className="text-2xl font-bold">
                {contributorBounties
                  ? formatString(getClaimableAmount(contributorBounties))
                  : '0'}{' '}
                PCE
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {dashboard.percontributor ?? ''}
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
              <div className="text-2xl font-bold">
                {_amount ? formatString(formatEther(_amount as bigint)) : '0'}{' '}
                PCE
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="contributor">
          <TabsList>
            <TabsTrigger value="contributor">
              {bounty.contributorBounty ?? ''}
            </TabsTrigger>
            <TabsTrigger value="proposal">{bounty.proposal ?? ''}</TabsTrigger>
          </TabsList>
          <TabsContent value="contributor">
            <div className="gap-4 flex flex-col">
              <Input
                type="number"
                name="bountyAmount"
                value={bountyAmount}
                placeholder={bounty.bountyAmount ?? ''}
                className="mt-4"
                onChange={handleChange}
              />

              <Input
                type="address"
                name="contributorAddr"
                value={contributorAddr}
                placeholder={bounty.contributorAddr ?? ''}
                onChange={handleChange}
              />

              <div className="flex max-xl:flex-col flex-row gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (!contributorAddr) return
                    handleAddContributorBounty()
                  }}
                >
                  {bounty.addContributor ?? ''}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (!address) return
                    handleClaimContributorBounty()
                  }}
                >
                  {bounty.claimContributor ?? ''}
                </Button>
              </div>
              <div className="rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead> {bounty.contributor ?? ''}</TableHead>
                      <TableHead> {bounty.totalAmount ?? ''}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contributorData &&
                      contributorData.map((contributor: Contributor, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {shortenAddress(contributor.contributor)}
                          </TableCell>
                          <TableCell>
                            {formatEther(contributor.totalAmount)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>{' '}
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={1}>{bounty.total ?? ''}</TableCell>
                      <TableCell>
                        {contributorData ? contributorData.length : '0'}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="proposal">
            <div>
              <Input
                type="number"
                name="bountyAmount"
                value={bountyAmount}
                placeholder={bounty.bountyAmount ?? ''}
                className="mt-5"
                onChange={handleChange}
              />
              <Input
                value={proposalId}
                type="number"
                name="proposalId"
                placeholder={bounty.proposalID ?? ''}
                className="mt-5"
                onChange={handleChange}
              />

              <div className="flex flex-row max-md:flex-col gap-4 my-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (!proposalId) return
                    handleAddProposalBounty()
                  }}
                >
                  {bounty.addProposal ?? ''}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    if (!proposalId) return
                    handleClaimProposalBounty()
                  }}
                >
                  {bounty.claimProposal ?? ''}
                </Button>
              </div>

              <div className="rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{bounty.proposalID ?? ''}</TableHead>
                      <TableHead>{bounty.totalAmount ?? ''}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proposalData &&
                      proposalData.map((proposal: Proposal, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{proposal.id}</TableCell>
                          <TableCell>
                            {formatString(formatEther(proposal.amount))}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>{' '}
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={1}>{proposal.total ?? ''}</TableCell>
                      <TableCell>
                        {proposalData ? proposalData.length : '0'}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <ToastContainer position="bottom-right" draggable></ToastContainer>
      </div>
    </div>
  )
}
