'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { ethers, parseEther } from 'ethers'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
} from 'wagmi'
import { Textarea } from '@headlessui/react'

import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

import { getDict } from '~/i18n/get-dict'

import {
  pceAddress,
  governorAddress,
  factoryAddress,
  timelockAddress,
} from '~/app/constants/constants'
import { GOVERNOR_ABI } from '~/app/ABIs/Governor'

import { PagePropsWithLocale, Dictionary } from '~/i18n/types'
import { sepolia } from 'wagmi/chains'
import { localhost } from '~/app/providers'

export default function ForSubmitPage({
  params: { locale, ...params },
}: PagePropsWithLocale<{}>) {
  const [dict, setDict] = useState<Dictionary | null>(null)
  const { address, chainId } = useAccount()
  const { data: hash, error, writeContract } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const [values, setValues] = useState('')
  const [description, setDescription] = useState('')
  const [bytescode, setBytesCodes] = useState('')
  const [category, setCategory] = useState('')
  const [variable1, setVariable1] = useState('')
  const [variable2, setVariable2] = useState('')
  const [variable3, setVariable3] = useState('')

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

  function handleSelect(value: any) {
    setCategory(value)
  }

  function handleChange(event: any) {
    const name = event.target.name
    const value = event.target.value
    if (name === 'targets') {
    } else if (name === 'values') {
      setValues(value)
    } else if (name === 'description') {
      setDescription(value)
    } else if (name === 'bytescode') {
      setBytesCodes(value)
    } else if (name === 'variable1') {
      setVariable1(value)
    } else if (name === 'variable2') {
      setVariable2(value)
    } else if (name === 'variable3') {
      setVariable3(value)
    }
  }

  useEffect(() => {
    if (isConfirmed) {
      toast.success(
        <Link
          href={`${chainId === sepolia.id ? sepolia.blockExplorers?.default?.url : localhost.blockExplorers?.default?.url}/tx/${hash}`}
          target="_blank"
        >
          Transaction Succeed!
        </Link>
      )
      setDescription('')
      setValues('')
      setVariable1('')
      setVariable2('')
      setVariable3('')
    } else if (isConfirming) {
      toast.info(<div className="disabled">TX is Pending, Please Wait...</div>)
    } else if (error) {
      toast.error((error as BaseError).shortMessage)
    }
  }, [isConfirmed, isConfirming, error, hash])

  const submit = dict?.submit ?? {}

  return (
    <div className="flex flex-row w-full items-center justify-center content-center">
      <div className="flex flex-col w-full items-center justify-center max-xl:mx-10 mx-80 my-20 max-xl:my-0">
        <h2 className="text-2xl font-bold tracking-tight my-4">
          {submit.title ?? ''}
        </h2>
        <Select onValueChange={handleSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={submit.select ?? ''} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">{submit.category1 ?? ''}</SelectItem>
            <SelectItem value="2">{submit.category2 ?? ''}</SelectItem>
            <SelectItem value="3">{submit.category3 ?? ''}</SelectItem>
            <SelectItem value="4">{submit.category4 ?? ''}</SelectItem>
            <SelectItem value="5">{submit.category5 ?? ''}</SelectItem>
            <SelectItem value="6">{submit.category6 ?? ''}</SelectItem>
          </SelectContent>
        </Select>

        <div className="w-full">
          <Input
            className={`mt-5 ${category == '4' || category == '5' || category == '6' ? 'hidden' : ''}`}
            type="number"
            placeholder={submit.amount ?? ''}
            name="values"
            value={values}
            onChange={handleChange}
          />

          <Input
            className={`mt-5 ${category !== '5' && category !== '6' ? 'hidden' : ''}`}
            type="number"
            placeholder={
              category === '5' ? submit.gracePeriod : submit.quorum_votes
            }
            name="variable1"
            value={variable1}
            onChange={handleChange}
          />

          <Input
            className={`mt-5 ${category !== '5' && category !== '6' ? 'hidden' : ''}`}
            type="number"
            placeholder={
              category === '5' ? submit.min_delay : submit.proposal_threshold
            }
            name="variable2"
            value={variable2}
            onChange={handleChange}
          />

          <Input
            className={`mt-5 ${category !== '5' && category !== '6' ? 'hidden' : ''}`}
            type="number"
            placeholder={
              category === '5'
                ? submit.max_delay
                : submit.proposal_maxOperations
            }
            name="variable3"
            value={variable3}
            onChange={handleChange}
          />

          <Textarea
            className="mt-5 max-md:h-60 h-60 w-full align-center p-2 rounded-md border-[1px] border-gray94 focus:outline-none"
            placeholder={submit.description ?? ''}
            value={description}
            name="description"
            onChange={handleChange}
          />

          <Textarea
            className={`mt-5 max-md:h-60 h-40 w-full align-center p-2 rounded-md border-[1px] border-gray94 focus:outline-none ${category != '4' ? 'hidden' : ''}`}
            placeholder={submit.bytescode ?? ''}
            value={bytescode}
            name="byescode"
            onChange={handleChange}
          />

          <Button
            className="mt-5 w-full"
            variant="outline"
            onClick={() => {
              if (category.length == 0) {
                toast.error('Please Select Category')
                return
              }

              let _signature = 'approve(address,uint256)'
              let _value = '0'
              let _calldata = ''
              let _address = pceAddress
              if (category === '2') {
                _calldata = new ethers.AbiCoder().encode(
                  ['address', 'uint256'],
                  [address, values]
                )
                _signature = 'transfer(address,uint256)'
              } else if (category === '4') {
                _signature = 'deploy(bytes)'
                _calldata = new ethers.AbiCoder().encode(['bytes'], [bytescode])
                _address = factoryAddress
              } else if (category === '5') {
                _address = timelockAddress
                _signature = 'updateVariables(uint256,uint256,uint256)'
                _calldata = new ethers.AbiCoder().encode(
                  ['uint256', 'uint256', 'uint256'],
                  [variable1, variable2, variable3]
                )
              } else if (category === '6') {
                _address = governorAddress
                _signature = 'updateVariables(uint256,uint256,uint256)'
                _calldata = new ethers.AbiCoder().encode(
                  ['uint256', 'uint256', 'uint256'],
                  [
                    parseEther(variable1),
                    parseEther(variable2),
                    parseEther(variable3),
                  ]
                )
              } else {
                _calldata = new ethers.AbiCoder().encode(
                  ['address', 'uint256'],
                  [address, values]
                )
              }

              writeContract({
                abi: GOVERNOR_ABI,
                address: governorAddress[
                  chainId || localhost.id
                ] as `0x${string}`,
                functionName: 'propose',
                args: [
                  [_address],
                  [_value],
                  [_signature],
                  [_calldata],
                  description,
                ],
              })
            }}
          >
            {submit.propose ?? ''}
          </Button>

          <ToastContainer position="bottom-right" draggable></ToastContainer>
        </div>
      </div>
    </div>
  )
}
