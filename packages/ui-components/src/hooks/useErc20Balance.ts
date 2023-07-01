import { useWeb3React } from '@web3-react/core'
import { useCallback, useEffect, useState } from 'react'
import { BigNumber, Contract, providers } from 'ethers'
import { useAppStore } from '../state';

import erc20ABI from './../constants/ABI/ERC20.json'
import { RPC_URLS } from '../constants/networks';
import useUSDCAddress from './useUsdc'


export default function useErc20Balance() {
    const { library,account } = useWeb3React()
    const fromChainID = useAppStore((state)=>state.fromChainID)
    //   const mpcinfo = useAppStore(state => state.getWalletAccount(account, mpcAddress))
  
    const [balance, setBalance] = useState<string>()
    const contractAddress = useUSDCAddress(fromChainID)
    const [isloading,setIsloading] = useState(false);
    

    useEffect(() => {
     
      const  run = async()=>{
        console.log('run useErc20Balance')
        if (account && contractAddress && fromChainID!==null) {
          
          const rpc= RPC_URLS[fromChainID][0]
          const prcPro= new providers.JsonRpcProvider(rpc)
          const contract = new Contract(contractAddress, erc20ABI, prcPro)
          const result: BigNumber = await contract.balanceOf(account)
          setBalance(result.toString())
          
        }else{
          setBalance('0')
          
        }
        setIsloading(false)
      }
      
      // if(library){
        // library.on('block:latest', run)
        
      const IntervalId:number=window.setInterval(()=>{
          run()
        },1000*30)
      // }
      
      setIsloading(true)
      run()
      

      return () => {
        if (IntervalId!==undefined) {
          // library.off('block:latest',run)

          clearInterval(IntervalId)
        }
      }
    }, [account,contractAddress,fromChainID,setIsloading])
  
    return {
      balance,
      isloading
    }
  }