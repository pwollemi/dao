'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from 'react-toastify'
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSwitchChain,
  type BaseError,
} from 'wagmi'

import { readContract } from '@wagmi/core'
import { generateIdenteapot } from '@teapotlabs/identeapots'
import { ringStyle } from '~/app/constants/styles'

import { DAO_STUDIO_ABI } from '~/app/ABIs/DAOStudio'
import { daoStudioAddress, SUBGRAPH_URL } from '~/app/constants/constants'

import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from '~/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogTitle } from '~/components/ui/dialog'

import { ApolloClient, gql, InMemoryCache } from '@apollo/client'

import { useNavigate } from 'react-router-dom'

import { getDict } from '~/i18n/get-dict'

import { PagePropsWithLocale, Dictionary } from '~/i18n/types'
import { formatEther, parseEther } from 'viem'
import { PCE_ABI } from '~/app/ABIs/PCEToken'

import { ethers } from 'ethers'
import { Env } from '~/env'
const abi = [
  'event Transfer(address indexed from, address indexed to, uint256 value)',
]

async function getHolders(chainId: number, tokenAddress: string) {
  const provider = new ethers.JsonRpcProvider(
    chainId === sepolia.id
      ? Env.NEXT_PUBLIC_SEPOLIA_RPC_URL
      : localhost.rpcUrls.default.http[0]
  )
  const contract = new ethers.Contract(tokenAddress, abi, provider)
  const transferEvents = await contract.queryFilter('Transfer', 0, 'latest')

  const balances = new Map<string, bigint>()

  for (const event of transferEvents) {
    const { from, to, value } = (event as any).args
    if (from !== ethers.ZeroAddress) {
      balances.set(from, (balances.get(from) || BigInt(0)) - value)
    }
    balances.set(to, (balances.get(to) || BigInt(0)) + value)
  }

  return [...balances.entries()].filter(([_, balance]) => balance > 0)
}

type Dao = {
  id: string
  daoId: string
  name: string
  governor: string
  blockTimestamp: string
  website: string
  linkedin: string
  twitter: string
  telegram: string
  votes: number
  identicon: string
  holders: number
}

type DaoMetadata = {
  description: string
  website: string
  linkedin: string
  twitter: string
  telegram: string
}

type DaoFormState = {
  name: string
  metadata: DaoMetadata
  tokenAddress: string
  votingDelay: string
  votingPeriod: string
  proposalThreshold: string
  quorumVotes: string
  timelockDelay: string
}
import { formatString } from '~/components/utils'
import { TabsContent } from '@radix-ui/react-tabs'
import RingLoader from 'react-spinners/RingLoader'

import { config } from '~/lib/config'
import { sepolia } from 'wagmi/chains'
import { localhost } from '~/app/providers'

const DaoCard = ({
  dao,
  locale,
  navigate,
}: {
  dao: Dao
  locale: string
  navigate: any
}) => (
  <div
    key={dao.id}
    className="flex flex-col xl:flex-row bg-gray-100 rounded-xl md:px-10 items-start xl:items-center cursor-pointer my-4 gap-4 w-full py-6"
    onClick={() => navigate(`/${locale}/dao/detail/${dao.id}`)}
  >
    <div className="flex flex-row w-full items-center justify-between">
      <div className="flex flex-row gap-4 md:gap-8 items-center border-none mx-8 md:mx-4">
        {dao.identicon ? (
          <img src={dao.identicon} alt="" className="w-24 rounded-full" />
        ) : (
          <div
            className="rounded-full flex items-center justify-center"
            style={{
              backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            }}
          >
            <span className="text-4xl text-white font-bold w-20 h-20 xl:w-24 xl:h-24 flex items-center justify-center">
              {dao.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-4 w-full">
          <div className="font-bold text-xl md:text-2xl w-full flex">
            {dao.name}
          </div>
          <div className="flex bg-dark_blue rounded-xl text-light_white font-bold p-1 w-16 items-center justify-center">
            DAO
          </div>
        </div>
      </div>
    </div>

    <div className="flex flex-row gap-4 w-full items-center">
      <StatItem
        label="My Power"
        value={dao.votes ? formatString(formatEther(BigInt(dao.votes))) : 0}
      />
      <StatItem label="TVL" value="$0" />
      <StatItem label="Members" value={dao.holders ? dao.holders : 0} />
    </div>
  </div>
)

const StatItem = ({
  label,
  value,
}: {
  label: string
  value: string | number
}) => (
  <div className="flex flex-col gap-4 w-full justify-center items-center">
    <div className="text-heavy_white text-sm">{label}</div>
    <div className="flex bg-dark_blue rounded-xl text-light_white font-bold py-1 px-2 min-w-16 items-center justify-center text-sm">
      {value}
    </div>
  </div>
)

export default function ForDAOPage({
  params: { locale, ...params },
}: PagePropsWithLocale<{}>) {
  const navigate = useNavigate()

  const [dict, setDict] = useState<Dictionary | null>(null)

  const [daos, setDaos] = useState<any[]>([])

  const { address, chainId } = useAccount()

  const client = new ApolloClient({
    uri: SUBGRAPH_URL[chainId || localhost.id] as string,
    cache: new InMemoryCache(),
  })

  const { data: hash, error, writeContract } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
      confirmations: 1,
    })

  const { chains, switchChain } = useSwitchChain()

  useEffect(() => {
    if (chainId && !chains.some((chain) => chain.id === chainId)) {
      switchChain({ chainId: sepolia.id })
    }
  }, [chainId])

  let [loading, setLoading] = useState(true)

  const [daoForm, setDaoForm] = useState<DaoFormState>({
    name: '',
    metadata: {
      description: '',
      website: '',
      linkedin: '',
      twitter: '',
      telegram: '',
    },
    tokenAddress: '',
    votingDelay: '',
    votingPeriod: '',
    proposalThreshold: '',
    quorumVotes: '',
    timelockDelay: '',
  })

  const [isDialogOpened, setIsDialogOpened] = useState(false)
  const [search, setSearch] = useState('')
  const handleCreateDao = async () => {
    setIsDialogOpened(false)

    writeContract({
      abi: DAO_STUDIO_ABI,
      address: daoStudioAddress[chainId || localhost.id] as `0x${string}`,
      functionName: 'createDAO',
      args: [
        daoForm.name,
        daoForm.metadata,
        daoForm.tokenAddress,
        daoForm.votingDelay,
        daoForm.votingPeriod,
        parseEther(daoForm.proposalThreshold),
        parseEther(daoForm.quorumVotes),
        daoForm.timelockDelay,
      ],
    })
  }

  const updateDaoForm = (field: keyof DaoFormState, value: string) => {
    setDaoForm((prev) => ({ ...prev, [field]: value }))
  }

  const updateDaoMetadata = (field: keyof DaoMetadata, value: string) => {
    setDaoForm((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value },
    }))
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        await new Promise((resolve) => setTimeout(resolve, 2000))

        const { data } = await client.query({
          query: gql`
            query totalDaos {
              daocreateds(
                first: 100
                orderBy: blockTimestamp
                orderDirection: desc
              ) {
                id
                daoId
                description
                website
                linkedin
                twitter
                telegram
                name
                governor
                timelock
                governanceToken
                blockTimestamp
              }
            }
          `,
        })
        let updatedDaos = []
        for (let i = 0; i < data.daocreateds.length; i++) {
          const dao = data.daocreateds[i]
          try {
            let votes = 0
            if (address) {
              votes = Number(
                await readContract(config, {
                  address: dao.governanceToken as `0x${string}`,
                  abi: PCE_ABI,
                  functionName: 'getVotes',
                  args: [address],
                })
              )
            }

            const holders = await getHolders(
              chainId === sepolia.id ? sepolia.id : localhost.id,
              dao.governanceToken as string
            )
            const identicon = await generateIdenteapot(dao.governor, '')
            updatedDaos.push({
              ...dao,
              votes,
              identicon,
              holders: holders.length,
            })
          } catch (error) {
            const identicon = await generateIdenteapot(dao.governor, '')
            updatedDaos.push({ ...dao, votes: 0, identicon })

            console.log('error', error)
          }
        }

        setDaos(updatedDaos)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [isConfirmed])

  return (
    <div className="items-center justify-center flex flex-col mx-10 md:mx-20 gap-4">
      <div className="flex flex-col md:flex-row h-20 w-full justify-between items-center">
        <h1 className="text-2xl font-bold text-dark_bg">
          DAO: What's in it for me?
        </h1>

        <Button
          className="bg-dark_blue text-light_white"
          onClick={() => {
            setIsDialogOpened(!isDialogOpened)
          }}
        >
          Create a DAO
        </Button>

        <Dialog
          open={isDialogOpened}
          onOpenChange={() => {
            setIsDialogOpened(!isDialogOpened)
          }}
        >
          <DialogContent className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <DialogTitle>DAO Settings</DialogTitle>
            </div>
            <div className="flex flex-col gap-2">
              <h1>About DAO</h1>
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="DAO Name"
                  onChange={(e) => updateDaoForm('name', e.target.value)}
                  value={daoForm.name}
                />
                <Input
                  placeholder="DAO Description"
                  onChange={(e) =>
                    updateDaoMetadata('description', e.target.value)
                  }
                  value={daoForm.metadata.description}
                />
                <Input
                  placeholder="DAO Site"
                  onChange={(e) => updateDaoMetadata('website', e.target.value)}
                  value={daoForm.metadata.website}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h1>Social Links</h1>
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Linkedin"
                  onChange={(e) =>
                    updateDaoMetadata('linkedin', e.target.value)
                  }
                  value={daoForm.metadata.linkedin}
                />
                <Input
                  placeholder="Twitter"
                  onChange={(e) => updateDaoMetadata('twitter', e.target.value)}
                  value={daoForm.metadata.twitter}
                />
                <Input
                  placeholder="Telegram"
                  onChange={(e) =>
                    updateDaoMetadata('telegram', e.target.value)
                  }
                  value={daoForm.metadata.telegram}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h1>Enter community token address</h1>
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Token Address"
                  onChange={(e) =>
                    updateDaoForm('tokenAddress', e.target.value)
                  }
                  value={daoForm.tokenAddress}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h1>Voting Parameters</h1>
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Voting Delay - 1 Block"
                  onChange={(e) => updateDaoForm('votingDelay', e.target.value)}
                  value={daoForm.votingDelay}
                />
                <Input
                  placeholder="Voting Period - 100 Blocks"
                  onChange={(e) =>
                    updateDaoForm('votingPeriod', e.target.value)
                  }
                  value={daoForm.votingPeriod}
                />
                <Input
                  placeholder="Proposal Threshold - 1000 Power"
                  onChange={(e) =>
                    updateDaoForm('proposalThreshold', e.target.value)
                  }
                  value={daoForm.proposalThreshold}
                />
                <Input
                  placeholder="Quorum Votes - 2000 Power"
                  onChange={(e) => updateDaoForm('quorumVotes', e.target.value)}
                  value={daoForm.quorumVotes}
                />
                <Input
                  placeholder="Timelock Delay - 86400 (1day)"
                  onChange={(e) =>
                    updateDaoForm('timelockDelay', e.target.value)
                  }
                  value={daoForm.timelockDelay}
                />
              </div>
            </div>
            <Button
              onClick={() => {
                handleCreateDao()
              }}
            >
              Confirm
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col w-full md:gap-4 gap-2">
        <Tabs defaultValue="all" className="flex flex-col w-full items-center">
          <TabsList className="flex flex-row w-full">
            <TabsTrigger className="w-full flex" value="all">
              All DAOs
            </TabsTrigger>
            <TabsTrigger className="w-full flex" value="my">
              My activity
            </TabsTrigger>
          </TabsList>
          <div className="flex flex-row gap-4 h-8 w-full mt-4">
            <Input
              placeholder="Search"
              className="w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <DropdownMenu>
              {/* <DropdownMenuTrigger className="flex items-center">
                Filter
              </DropdownMenuTrigger> */}
              <DropdownMenuContent>
                <DropdownMenuItem>Sort Dao</DropdownMenuItem>
                <DropdownMenuItem>Date of Creation</DropdownMenuItem>
                <DropdownMenuItem>Members</DropdownMenuItem>
                <DropdownMenuItem>Proposals</DropdownMenuItem>
                <DropdownMenuItem>Total token delegated</DropdownMenuItem>
                <DropdownMenuItem>Total token delegatees</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <TabsContent
            value="all"
            className="flex flex-col w-full items-center justify-center"
          >
            {daos
              .filter((dao) =>
                dao.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((dao) => (
                <DaoCard
                  key={dao.id}
                  dao={dao}
                  locale={locale}
                  navigate={navigate}
                />
              ))}
          </TabsContent>

          <TabsContent
            value="my"
            className="flex flex-col w-full items-center justify-center"
          >
            {daos
              .filter(
                (dao) =>
                  dao.votes > 0 &&
                  dao.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((dao) => (
                <DaoCard
                  key={dao.id}
                  dao={dao}
                  locale={locale}
                  navigate={navigate}
                />
              ))}
          </TabsContent>
        </Tabs>
      </div>

      <ToastContainer position="bottom-right" draggable></ToastContainer>

      <RingLoader
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
        }}
        color={'#000000'}
        loading={loading}
        cssOverride={ringStyle}
        size={50}
      />
    </div>
  )
}
