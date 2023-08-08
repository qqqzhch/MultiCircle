import { useWeb3React } from '@web3-react/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { BigNumber, Contract, providers } from 'ethers'
import { useAppStore } from '../state';

import erc20ABI from '../constants/ABI/ERC20.json'
import { RPC_URLS } from '../constants/networks';
import useSWR from 'swr'
import { useStaticJsonRpc } from './useStaticJsonRpc';



export default function useEthBalance() {
    const { library,account } = useWeb3React()
    const fromChainID = useAppStore((state)=>state.fromChainID)
    const fromToken = useAppStore((state)=>state.fromToken)
    //   const mpcinfo = useAppStore(state => state.getWalletAccount(account, mpcAddress))
  
    const [balance, setBalance] = useState<string>()

    const [isloading,setIsloading] = useState(false);
    const StaticJsonRpcProvider = useStaticJsonRpc(fromChainID)

    const fetchData= useCallback(async ()=>{
     
      if (account &&  StaticJsonRpcProvider!==undefined) {
        console.log('run EthBalance')   
        const result: BigNumber =await  StaticJsonRpcProvider.getBalance(account)
          setBalance(result.toString())
        return result.toString()                                           
      }else{
        // setBalance('0')
        return '0'
        
      }

    },[StaticJsonRpcProvider,account])

    
    const { data, error, isLoading } = useSWR(['EthBalance',account,fromChainID],fetchData)

   
  
    return {
      balance:data,
      isloading:isLoading,
      error
    }
  }