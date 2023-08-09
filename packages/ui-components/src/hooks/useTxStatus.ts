import useSWR from 'swr'
import { useAppStore } from '../state/index'
import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import { BaseUrl } from '../constants/relayer'
import { Interface, fetchJson } from 'ethers/lib/utils'
import api from '../api/fetch'
import {SearchTxhash } from '../types/searchTxhash'


async function fetcher(txhash: string|undefined|null ): Promise< SearchTxhash | undefined> {
  if (txhash == null || txhash == undefined) {
    return
  }
  
  const res = await api.get<SearchTxhash>(BaseUrl+"/search/?txhash="+txhash)
  if (res&&res.code==0) {
    return res
  } else {
    throw new Error('get Accounts info error ')
  }
}

export default function useTxStatus(txhash: string|undefined|null) {


  const { data, error, isLoading } = useSWR(txhash ? ['/smw/txhash', txhash] : null, () => fetcher(txhash), {
    refreshInterval: 1000 * 15
  })

  
  return {
    data: data,
    error,
    isLoading
  }
}