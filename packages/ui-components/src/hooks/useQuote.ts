import { useWeb3React } from '@web3-react/core'

import { useAppStore } from '../state'

import useSWR from 'swr/immutable'
import { BaseQuote } from '../constants/relayer'
import { NativeCoinAddress } from '../constants/usdc'
import api from '../api/fetch'
import { Quote } from '../types/quote'
import useUSDCAddress from './useUsdc'

export default function useQuote(isneedSwap: boolean, isFrom: boolean, sellAmount?: string) {
  const { account } = useWeb3React()

  const fromChainID = useAppStore(state => state.fromChainID)
  const toChainID = useAppStore(state => state.toChainID)
  const fromToken = useAppStore(state => state.fromToken)
  const toToken = useAppStore(state => state.toToken)

  const inputAmount = useAppStore(state => state.input)
  const ChainID = isFrom ? fromChainID : toChainID
  const amount = isFrom ? inputAmount : sellAmount

  const usdcAddress = useUSDCAddress(ChainID)

  const isSwap = fromToken !== null && isneedSwap && toToken !== null
  const tokenAddress = isFrom ? fromToken?.address : toToken?.address

  const { data, error, isLoading } = useSWR(
    isSwap ? ['BaseQuote', account, ChainID, tokenAddress, amount, usdcAddress, isFrom] : null,
    async ([key, account, ChainID, tokenAddress, inputAmount, usdcAddress, isFrom]) => {
      if (account && fromChainID !== null && tokenAddress !== undefined && inputAmount !== undefined) {
        const buyToken = isFrom ? usdcAddress : tokenAddress == '' ? NativeCoinAddress : tokenAddress
        const sellToken = isFrom ? (tokenAddress == '' ? NativeCoinAddress : tokenAddress) : usdcAddress

        const sellAmount = inputAmount
        const chainid = ChainID

        const url = `${BaseQuote}?buyToken=${buyToken}&sellToken=${sellToken}&sellAmount=${sellAmount}&chainid=${chainid}`
        const data = await api.get<Quote>(url)

        return data
      }
    }
  )

  return {
    data: data,
    isloading: isLoading,
    error
  }
}
