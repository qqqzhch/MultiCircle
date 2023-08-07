import { useWeb3React } from '@web3-react/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { BigNumber, Contract, providers } from 'ethers'
import { useAppStore } from '../state'

import { RPC_URLS } from '../constants/networks'
import useSWR from 'swr/immutable'
import { BaseQuote } from '../constants/relayer'
import { USDC_IDS_TO_ADDR,NativeCoinAddress } from '../constants/usdc'
import api from '../api/fetch'
import { Quote } from '../types/quote'
import useUSDCAddress from './useUsdc'



export default function useQuote(isneedSwap:boolean,isFrom:boolean,sellAmount?:string) {
  const {  account } = useWeb3React()

  const fromChainID = useAppStore(state => state.fromChainID)
  const toChainID = useAppStore(state => state.toChainID)
  const fromToken = useAppStore(state => state.fromToken)
  const toToken = useAppStore(state => state.toToken)
  
  const inputAmount = useAppStore(state => state.input)
  const ChainID=isFrom?fromChainID:toChainID
  const amount= isFrom?inputAmount:sellAmount

  const usdcAddress = useUSDCAddress(ChainID)

  const isSwap=fromToken!==null&&isneedSwap&&toToken!==null 
  const tokenAddress= isFrom?fromToken?.address:toToken?.address   



  const { data, error, isLoading } = useSWR(isSwap ?['BaseQuote', account, ChainID,tokenAddress,amount,usdcAddress,isFrom]:null, 
  async ([key, account, ChainID,tokenAddress,inputAmount,usdcAddress,isFrom]) => {
    console.log('run useQuote')
    if (account && fromChainID !== null&&tokenAddress!==undefined&&inputAmount!==undefined) {
      const buyToken=isFrom?usdcAddress:(tokenAddress==""?NativeCoinAddress:tokenAddress);
      const sellToken=isFrom?(tokenAddress==""?NativeCoinAddress:tokenAddress):usdcAddress

      const sellAmount=inputAmount
      const chainid=ChainID

      const url =`${BaseQuote}?buyToken=${buyToken}&sellToken=${sellToken}&sellAmount=${sellAmount}&chainid=${chainid}`
      const  data = await api.get<Quote>(url)
      console.log('run useQuote',data)
      return data
    }

  })

  return {
    data: data,
    isloading: isLoading,
    error
  }
}
