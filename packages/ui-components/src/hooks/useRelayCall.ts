import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import { BigNumber, Contract,ethers } from 'ethers'
import {useAsyncFn} from 'react-use';
import UsdcRelayerABI from './../constants/ABI/UsdcRelayer.json'
import useRelayerAddress from './useRelayer'
import useUSDCAddress from './useUsdc'
import { Circle_Chainid } from '../constants/relayer';
import { useAppStore } from '../state';
import { useToasts } from 'react-toast-notifications'

export default function useRelayCall() {
    const { library,account,chainId } = useWeb3React()

    const contractAddress =useRelayerAddress();
    const fromChainID = useAppStore((state)=>state.fromChainID)
    const inputAmount = useAppStore((state)=>state.input)
    const toChainID = useAppStore((state)=>state.toChainID)
    const addToHistory = useAppStore((state)=>state.addToHistory)
  
    const { addToast } = useToasts()

    const burnToken=useUSDCAddress();
    const RelayerFee =  useAppStore((state)=>state.fee)

  
    const [state, doFetch]=useAsyncFn(async() => {
      console.log('useRelayCall')
        if (account && contractAddress && library != undefined&&fromChainID!==null&&fromChainID==chainId&&toChainID!=null) {
         const destinationDomain=Circle_Chainid[toChainID];
         const mintRecipient=account;
         const amount=inputAmount;

          const signer = library.getSigner()
          const contract = new Contract(contractAddress, UsdcRelayerABI, signer)
          const result = await contract.callout(amount,destinationDomain,mintRecipient,burnToken,{
            value:RelayerFee
          })
          console.log(result)
          addToHistory({
            fromChainID:fromChainID, 
            toChainID:toChainID, 
            input:inputAmount, 
            fee:RelayerFee,
            txhash:result.hash,
            creattime:Date.now(),
            user:account
          })
          addToast('Transactions have been sent', { appearance: 'success',autoDismissTimeout:1000*10 })

          const txinfo = await result.wait([1])
          console.log(txinfo)
          return result
        }
      
    
    }, [account, library, contractAddress,chainId,fromChainID,burnToken,RelayerFee,toChainID,addToHistory,addToast,inputAmount])
  
    return {
        state,
        doFetch
    }
  }