import { useWeb3React } from '@web3-react/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { BigNumber, Contract, providers } from 'ethers'
import { useAppStore } from '../state';

import erc20ABI from './../constants/ABI/ERC20.json'
import { RPC_URLS } from '../constants/networks';
import useSWR from 'swr'
import { useStaticJsonRpc } from './useStaticJsonRpc';

export default function useErc20Balance(address:string|undefined) {
    const { account } = useWeb3React()
    const fromChainID = useAppStore((state)=>state.fromChainID)
    const fromToken = useAppStore((state)=>state.fromToken)
    //   const mpcinfo = useAppStore(state => state.getWalletAccount(account, mpcAddress))
  

    const contractAddress = address
    const [isloading,setIsloading] = useState(false);
    const selectcontract=useMemo(()=>{
      if(fromToken!==null){
        return fromToken.address
      }
      return contractAddress 

    },[contractAddress,fromToken])
    const StaticJsonRpcProvider = useStaticJsonRpc(fromChainID)
    const fetchData= useCallback(async ()=>{
      
      if (account && contractAddress && StaticJsonRpcProvider!==null&&contractAddress!=="") {
        console.log('run useErc20Balance')  
        const contract = new Contract(contractAddress, erc20ABI, StaticJsonRpcProvider)
        
        const result: BigNumber = await contract.balanceOf(account)
          // setBalance(result.toString())
        return result.toString()  
        
        
        
      }else{
        // setBalance('0')
        return '0'
        
      }

    },[StaticJsonRpcProvider,account,contractAddress])

   

    const { data, error, isLoading } = useSWR(['erc20balanceOf',account,selectcontract,fromChainID],fetchData)

    // useEffect(() => {
     
    //   const  run = async()=>{
    //     console.log('run useErc20Balance')
    //     if (account && contractAddress && fromChainID!==null) {
          
    //       const rpc= RPC_URLS[fromChainID][0]
    //       const prcPro= new providers.JsonRpcProvider(rpc)
    //       const contract = new Contract(contractAddress, erc20ABI, prcPro)
    //       const result: BigNumber = await contract.balanceOf(account)
    //       setBalance(result.toString())
          
    //     }else{
    //       setBalance('0')
          
    //     }
    //     setIsloading(false)
    //   }
      
    //   // if(library){
    //     // library.on('block:latest', run)
        
    //   const IntervalId:number=window.setInterval(()=>{
    //       run()
    //     },1000*30)
    //   // }
      
    //   setIsloading(true)
    //   run()
      

    //   return () => {
    //     if (IntervalId!==undefined) {
    //       // library.off('block:latest',run)

    //       clearInterval(IntervalId)
    //     }
    //   }
    // }, [account,contractAddress,fromChainID,setIsloading])
  
    return {
      balance:data,
      isloading:isLoading,
      error
    }
  }