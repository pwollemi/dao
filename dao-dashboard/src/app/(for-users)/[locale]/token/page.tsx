'use client'

import { useEffect, useState } from 'react'
import { formatEther } from 'ethers'
import { readContract } from '@wagmi/core'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
} from 'wagmi'
import Link from 'next/link'

import { Input } from '~/components/ui/input'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { shortenAddress, formatString } from '~/components/utils'
import useWindowWidth from '~/components/useWindWidth'

import { pceAddress } from '~/app/constants/constants'
import { PCE_ABI } from '~/app/ABIs/PCEToken'
import { PagePropsWithLocale, Dictionary } from '~/i18n/types'
import { getDict } from '~/i18n/get-dict'

import { config } from '~/lib/config'
import { sepolia } from 'wagmi/chains'
import { localhost } from '~/app/providers'

export default function ForTokenPage({
  params: { locale, ...params },
}: PagePropsWithLocale<{}>) {
  const [dict, setDict] = useState<Dictionary | null>(null)
  const width = useWindowWidth()
  const colSpan = width < 1280

  const { address, chainId } = useAccount()
  const { data: hash, error, writeContract } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })
  const [isOpened, setDialogStatus] = useState(false)
  const [tokenInfo, setTokenInfo] = useState<any>()
  const [exchangeRates, setExchangeRate] = useState<any[]>([])
  const [tokens, setTokens] = useState<any[]>([])

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

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: pceAddress[chainId || localhost.id] as `0x${string}`,
    abi: PCE_ABI,
    functionName: 'balanceOf',
    args: [address],
  })

  const { data: _tokens, refetch: refetchTokens } = useReadContract({
    address: pceAddress[chainId || localhost.id] as `0x${string}`,
    abi: PCE_ABI,
    functionName: 'getTokens',
    args: [],
  })

  const { data: lastModifiedFactor, refetch: refetchLastModifiedFactor } =
    useReadContract({
      address: pceAddress[chainId || localhost.id] as `0x${string}`,
      abi: PCE_ABI,
      functionName: 'lastModifiedFactor',
      args: [],
    })

  const { data: factor } = useReadContract({
    address: pceAddress[chainId || localhost.id] as `0x${string}`,
    abi: PCE_ABI,
    functionName: 'getCurrentFactor',
    args: [],
  })

  const { data: INITIAL_FACTOR, refetch: refetchINITIAL_FACTOR } =
    useReadContract({
      address: pceAddress[chainId || localhost.id] as `0x${string}`,
      abi: PCE_ABI,
      functionName: 'INITIAL_FACTOR',
      args: [],
    })

  const fetchExchangeRate = async (_tokens: []) => {
    if (!_tokens || _tokens.length == 0) return
    let _exchangeRates = []
    for (let i = 0; i < _tokens.length; i++) {
      const exchangeRate = await readContract(config, {
        address: pceAddress[chainId || localhost.id] as `0x${string}`,
        abi: PCE_ABI,
        functionName: 'getExchangeRate',
        args: [_tokens[i]],
      })

      _exchangeRates.push(exchangeRate)
    }
    setExchangeRate(_exchangeRates)
  }

  useEffect(() => {
    _tokens && setTokens(_tokens as [])
  }, [_tokens])

  useEffect(() => {
    if (tokens) {
      fetchExchangeRate(tokens as [])
    }
  }, [tokens])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.target.name
    const value = event.target.value

    let _tokenInfo = tokenInfo || {}

    switch (name) {
      case 'name':
        _tokenInfo.name = value
        break
      case 'symbol':
        _tokenInfo.symbol = value
        break
      case 'amountToExchange':
        _tokenInfo.amountToExchange = value
        break
      case 'dilutionFactor':
        _tokenInfo.dilutionFactor = value
        break
      case 'decreaseIntervalDays':
        _tokenInfo.decreaseIntervalDays = value
        break
      case 'afterDecreaseBp':
        _tokenInfo.afterDecreaseBp = value
        break
      case 'maxIncreaseOfTotalSupplyBp':
        _tokenInfo.maxIncreaseOfTotalSupplyBp = value
        break
      case 'maxIncreaseBp':
        _tokenInfo.maxIncreaseBp = value
        break
      case 'maxUsageBp':
        _tokenInfo.maxUsageBp = value
        break
      case 'changeBp':
        _tokenInfo.changeBp = value
        break
    }

    // Test Token Data
    _tokenInfo.name = 'test'
    _tokenInfo.symbol = 'TEST'
    _tokenInfo.amountToExchange = 10e18
    _tokenInfo.dilutionFactor = 2e18
    _tokenInfo.decreaseIntervalDays = 7
    _tokenInfo.afterDecreaseBp = 20
    _tokenInfo.maxIncreaseOfTotalSupplyBp = 20
    _tokenInfo.maxIncreaseBp = 2000
    _tokenInfo.maxUsageBp = 3000
    _tokenInfo.changeBp = 3000

    _tokenInfo.incomeExchangeAllowMethod = 3
    _tokenInfo.outgoExchangeAllowMethod = 3
    _tokenInfo.incomeTargetTokens = []
    _tokenInfo.outgoTargetTokens = []
    setTokenInfo(_tokenInfo)
  }

  useEffect(() => {
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
      refetchBalance()
    } else if (isConfirming) {
      toast.info(<div className="disabled">TX is Pending, Please Wait...</div>)
    } else if (error) {
      toast.error((error as BaseError).shortMessage)
    }
  }, [isConfirmed, isConfirming, error, hash, refetchBalance])

  const handleSwapFromLocalToken = async (token: any) => {
    if (!token || !INITIAL_FACTOR || !lastModifiedFactor) return

    const allowance = await readContract(config, {
      address: token,
      abi: PCE_ABI,
      functionName: 'allowance',
      args: [address, pceAddress],
    })

    const _exchangeRate = await readContract(config, {
      address: pceAddress[chainId || localhost.id] as `0x${string}`,
      abi: PCE_ABI,
      functionName: 'getExchangeRate',
      args: [token],
    })

    if (!_exchangeRate) return
    const allowanceBigInt = BigInt(allowance as string)
    const INITIAL_FACTORBigInt = BigInt(INITIAL_FACTOR as string)
    const _exchangeRateBigInt = BigInt(_exchangeRate as string)
    const _lastModifiedFactorBigInt = BigInt(lastModifiedFactor as string)

    const factor = await readContract(config, {
      address: token,
      abi: PCE_ABI,
      functionName: 'getCurrentFactor',
      args: [],
    })
    const requiredAllowance = BigInt(100) * BigInt(factor as string)

    if (allowanceBigInt < requiredAllowance) {
      writeContract({
        abi: PCE_ABI,
        address: token,
        functionName: 'approve',
        args: [pceAddress, requiredAllowance],
      })
    } else {
      writeContract({
        abi: PCE_ABI,
        address: pceAddress[chainId || localhost.id] as `0x${string}`,
        functionName: 'swapFromLocalToken',
        args: [token, BigInt(100)],
      })
    }
  }

  const handleCreateToken = async () => {
    setDialogStatus(!isOpened)

    writeContract({
      abi: PCE_ABI,
      address: pceAddress[chainId || localhost.id] as `0x${string}`,
      functionName: 'createToken',
      args: [tokenInfo],
    })
  }

  const token = dict?.token ?? {}

  return (
    <div className="w-full gap-4 flex flex-col">
      <div className="flex flex-col mx-8 gap-2">
        <h2 className="text-2xl font-bold tracking-tight mt-6">
          {token.title ?? ''}
        </h2>
        <p className="text-muted-foreground">
          {token.subtitle1 ?? ''}
          {': '}
          {balance ? formatString(formatEther(BigInt(balance as string))) : '0'}
        </p>

        <p className="text-muted-foreground">
          {token.subtitle2 ?? ''}
          {': '} {factor ? formatEther(BigInt(factor as string)) : '0'}
        </p>
        <Button
          className="w-40 my-2"
          variant="outline"
          onClick={() => {
            setDialogStatus(true)
          }}
        >
          {token.createToken ?? ''}
        </Button>
        <Dialog
          open={isOpened}
          onOpenChange={() => {
            setDialogStatus(!isOpened)
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dict?.token?.inputTokenInfo ?? ''}</DialogTitle>
              <DialogDescription>
                {dict?.token?.createTokenInfo ?? ''}
              </DialogDescription>
              <div className="gap-4">
                <Input
                  name="name"
                  placeholder="Name - PeaceCoin, Ethereum, Bitcoin, etc."
                  className="my-2"
                  onChange={handleChange}
                ></Input>
                <Input
                  name="symbol"
                  placeholder="Symbol - PCE, ETH, BTC, etc."
                  className="my-2"
                  onChange={handleChange}
                ></Input>
                <Input
                  name="amountToExchange"
                  placeholder="amountToExchange - 100"
                  className="my-2"
                  onChange={handleChange}
                ></Input>
                <Input
                  name="dilutionFactor"
                  placeholder="dilutionFactor - 1E18"
                  className="my-2"
                  onChange={handleChange}
                ></Input>
                <Input
                  name="decreaseIntervalDays"
                  placeholder="decreaseIntervalDays - 3"
                  className="my-2"
                  onChange={handleChange}
                ></Input>
                <Input
                  name="afterDecreaseBp"
                  placeholder="afterDecreaseBp - 1000"
                  className="my-2"
                  onChange={handleChange}
                ></Input>
                <Input
                  name="maxIncreaseOfTotalSupplyBp"
                  placeholder="maxIncreaseOfTotalSupplyBp - 100"
                  className="my-2"
                  onChange={handleChange}
                ></Input>
                <Input
                  name="maxIncreaseBp"
                  placeholder="maxIncreaseBp - 2000"
                  className="my-2"
                  onChange={handleChange}
                ></Input>
                <Input
                  name="maxUsageBp"
                  placeholder="maxUsageBp - 3000"
                  className="my-2"
                  onChange={handleChange}
                ></Input>
                <Input
                  name="changeBp"
                  placeholder="changeBp - 3000"
                  className="my-2"
                  onChange={handleChange}
                ></Input>
              </div>
            </DialogHeader>
            <DialogFooter>
              <Button
                className="mt-5"
                variant="outline"
                onClick={handleCreateToken}
              >
                {dict?.token?.confirm ?? ''}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="border rounded-xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{token.tokenAddress ?? ''}</TableHead>
                <TableHead>{token.exchnageRate ?? ''}</TableHead>
                <TableHead className="max-xl:hidden">
                  {token.swapToLocal ?? ''}
                </TableHead>
                <TableHead>{token.swapFromLocal ?? ''}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens &&
                tokens.map((token, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {shortenAddress(token)}
                    </TableCell>
                    <TableCell>
                      {exchangeRates &&
                        exchangeRates[index] &&
                        formatEther(exchangeRates[index])}
                    </TableCell>
                    <TableCell className="flex flex-col xl:flex-row font-medium gap-2">
                      <Button
                        onClick={async () => {
                          writeContract({
                            abi: PCE_ABI,
                            address: pceAddress[
                              chainId || localhost.id
                            ] as `0x${string}`,
                            functionName: 'swapToLocalToken',
                            args: [tokens[2], 100],
                          })
                        }}
                      >
                        {token.swapToLocal ?? ''}
                      </Button>

                      <Button
                        className="xl:hidden"
                        onClick={() => {
                          handleSwapFromLocalToken(token)
                        }}
                      >
                        {token.swapFromLocal ?? ''}
                      </Button>
                    </TableCell>
                    <TableCell className="max-xl:hidden">
                      <Button
                        onClick={() => {
                          handleSwapFromLocalToken(token)
                        }}
                      >
                        {token.swapFromLocal ?? ''}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={colSpan ? 2 : 3}>
                  {token.totalToken ?? ''}
                </TableCell>
                <TableCell>{tokens && tokens.length}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <ToastContainer position="bottom-right" draggable></ToastContainer>
      </div>
    </div>
  )
}
