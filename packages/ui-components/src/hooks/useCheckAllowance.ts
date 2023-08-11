import { useWeb3React } from '@web3-react/core'
import { useCallback, useEffect, useState } from 'react'
import { BigNumber, Contract } from 'ethers'

import erc20ABI from './../constants/ABI/ERC20.json'
import useRelayerAddress from './useRelayer'

import EventEmitter from '../EventEmitter/index'

import useSWR from 'swr'
import { useAppStore } from '../state'

export default function useErcCheckAllowance() {
  const { library, account, chainId } = useWeb3React()
  const RelayerAddress = useRelayerAddress()
  const contractAddress = useAppStore(state => state.fromToken?.address)

  const [fetchCheck, setFetchCheck] = useState<number>(0)

  useEffect(() => {
    const run = () => {
      setFetchCheck(pre => {
        return pre + 1
      })
    }

    EventEmitter.on('Refresh', run)
    return () => {
      EventEmitter.off('Refresh', run)
    }
  }, [setFetchCheck])

  const { data, isLoading } = useSWR(
    [account, chainId, contractAddress, RelayerAddress, 'erc20allowance', fetchCheck],
    async ([account, chainId, contractAddress, checkAddress]) => {
      if (account && contractAddress && library != undefined) {
        const contract = new Contract(contractAddress, erc20ABI, library)

        const allowance: BigNumber = await contract.allowance(account, RelayerAddress)
        // setAllowance(allowance )

        return allowance
      }
    },
    { refreshInterval: 5 }
  )

  const fnback = useCallback(
    (inputAmount: string) => {
      if (data == undefined) {
        return false
      }
      const result = data.gte(BigNumber.from(inputAmount))
      return result
    },
    [data]
  )

  const fnback2 = useCallback((allowanceAmount: BigNumber | undefined, inputAmount: string) => {
    if (allowanceAmount == undefined) {
      return false
    }
    const result = allowanceAmount.gte(BigNumber.from(inputAmount))
    return result
  }, [])

  return {
    Validation: fnback,
    Validation2: fnback2,
    state: data,
    // dofetch,
    // checkAmountAsync,
    allowanceValue: data,
    isLoading
  }
}
