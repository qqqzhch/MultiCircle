import { useWeb3React } from '@web3-react/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { BigNumber, Contract, providers } from 'ethers'
import { useAppStore } from '../state';

import erc20ABI from '../constants/ABI/ERC20.json'
import { RPC_URLS } from '../constants/networks';
import useSWR from 'swr'


export default function useEthBalance() {
    const { library,account } = useWeb3React()
    const fromChainID = useAppStore((state)=>state.fromChainID)
    const fromToken = useAppStore((state)=>state.fromToken)
    //   const mpcinfo = useAppStore(state => state.getWalletAccount(account, mpcAddress))
  
    const [balance, setBalance] = useState<string>()

    const [isloading,setIsloading] = useState(false);

    
    const { data, error, isLoading } = useSWR(['EthBalance',account,fromChainID],
                                              async ([key,account,fromChainID])=>{
                                                console.log('run EthBalance')
                                              if (account &&  fromChainID!==null) {
                                                const rpc= RPC_URLS[fromChainID][0]
                                                const prcPro= new providers.JsonRpcProvider(rpc)
                                                const result: BigNumber =await  prcPro.getBalance(account)
                                                  // setBalance(result.toString())
                                                return result.toString()                                           
                                              }else{
                                                // setBalance('0')
                                                return '0'
                                                
                                              }

                                            })

   
  
    return {
      balance:data,
      isloading:isLoading,
      error
    }
  }