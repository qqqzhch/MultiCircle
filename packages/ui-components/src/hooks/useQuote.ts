import { useWeb3React } from '@web3-react/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { BigNumber, Contract, providers } from 'ethers'
import { useAppStore } from '../state'

import { RPC_URLS } from '../constants/networks'
import useSWR from 'swr'
import { BaseQuote } from '../constants/relayer'
import { USDC_IDS_TO_ADDR } from '../constants/usdc'
import api from '../api/fetch'
import { Quote } from '../types/quote'



export default function useQuote() {
  const { library, account } = useWeb3React()
  const fromChainID = useAppStore(state => state.fromChainID)
  const fromToken = useAppStore(state => state.fromToken)
  const inputAmount = useAppStore(state => state.input)
      
  //   const mpcinfo = useAppStore(state => state.getWalletAccount(account, mpcAddress))

  const [balance, setBalance] = useState<string>()

  const [isloading, setIsloading] = useState(false)

  const { data, error, isLoading } = useSWR(['BaseQuote', account, fromChainID,fromToken?.address,inputAmount], async ([key, account, fromChainID,fromTokenAddress,inputAmount]) => {
    console.log('run EthBalance')
    if (account && fromChainID !== null&&fromTokenAddress!==undefined) {
      const buyToken=USDC_IDS_TO_ADDR[fromChainID];
      const sellToken=fromTokenAddress==""?"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE":fromTokenAddress
      const sellAmount=inputAmount
      const chainid=fromChainID

      const url =`${BaseQuote}?buyToken=${buyToken}&sellToken=${sellToken}&sellAmount=${sellAmount}&chainid=${chainid}`
      const  data = await api.get<Quote>(url)
      return data
    }

  })

  return {
    data: data,
    isloading: isLoading,
    error
  }
}
