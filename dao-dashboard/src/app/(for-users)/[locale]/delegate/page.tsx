'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { formatEther } from 'ethers'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
} from 'wagmi'

import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { formatString } from '~/components/utils'

import { pceAddress } from '~/app/constants/constants'
import { PCE_ABI } from '~/app/ABIs/PCEToken'

import { PagePropsWithLocale, Dictionary } from '~/i18n/types'
import { getDict } from '~/i18n/get-dict'
import { localhost, sepolia } from 'wagmi/chains'

export default function ForDelegatePage({
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
  const { data: hash, error, writeContract } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const [delegateAddr, setDelegateAddr] = useState('')

  const { data: votes, refetch: refetchVotes } = useReadContract({
    address: pceAddress[chainId || localhost.id] as `0x${string}`,
    abi: PCE_ABI,
    functionName: 'getVotes',
    args: [address],
  })

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.target.name
    const value = event.target.value
    if (name === 'delegateAddr') {
      setDelegateAddr(value)
    }
  }

  const handleDelegate = async () => {
    writeContract({
      abi: PCE_ABI,
      address: pceAddress[chainId || localhost.id] as `0x${string}`,
      functionName: 'delegate',
      args: [delegateAddr],
    })
  }

  useEffect(() => {
    const notify = async () => {
      if (isConfirmed) {
        toast.success(
          <Link
            href={`${chainId === sepolia.id ? sepolia.blockExplorers?.default?.url : localhost.blockExplorers?.default?.url}/tx/${hash}`}
            target="_blank"
          >
            Transaction Succeed!
          </Link>
        )

        setDelegateAddr('')
        await refetchVotes()
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

  const delegate = dict?.delegate ?? {}

  return (
    <div className="items-center justify-center flex w-full">
      <div className="flex flex-col max-xl:mx-10 mx-80 max-xl:my-0 my-20 gap-4">
        <h2 className="text-2xl font-bold tracking-tight my-4 text-center">
          {delegate.title ?? ''}
        </h2>
        <div className="text-muted-foreground">
          {delegate.votingPower ?? ''} :{' '}
          {votes ? formatString(formatEther(BigInt(votes as string))) : '0'}
        </div>

        <div className="text-muted-foreground">
          {delegate.description ?? ''}
        </div>
        <Input
          type="address"
          name="delegateAddr"
          value={delegateAddr}
          placeholder={delegate.address ?? ''}
          className="mt-5"
          onChange={handleChange}
        />
        <Button
          className="mt-5"
          variant="outline"
          onClick={() => {
            if (!delegateAddr) return
            handleDelegate()
          }}
        >
          {delegate.delegate ?? ''}
        </Button>
        <ToastContainer position="bottom-right" draggable></ToastContainer>
      </div>
    </div>
  )
}
