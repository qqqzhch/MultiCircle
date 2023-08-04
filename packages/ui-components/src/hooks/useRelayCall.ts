import { useWeb3React } from '@web3-react/core'
import { useCallback, useEffect, useState } from 'react'
import { BigNumber, Contract,ethers } from 'ethers'
import {useAsyncFn} from 'react-use';
import UsdcRelayerABI from './../constants/ABI/UsdcRelayer.json'
import useRelayerAddress from './useRelayer'
import useUSDCAddress from './useUsdc'
import { Circle_Chainid } from '../constants/relayer';
import { useAppStore } from '../state';
import { useToasts } from 'react-toast-notifications'
import useQuote from './useQuote'
import useRelayCallGasFee from './useRelayCallGasFee';



export default function useRelayCall() {
    const { library,account,chainId } = useWeb3React()

    const contractAddress =useRelayerAddress();
    const fromChainID = useAppStore((state)=>state.fromChainID)
    const inputAmount = useAppStore((state)=>state.input)
    const toChainID = useAppStore((state)=>state.toChainID)
    const addToHistory = useAppStore((state)=>state.addToHistory)
    const fromToken = useAppStore((state)=>state.fromToken)
    const toToken = useAppStore((state)=>state.toToken)
    const willReceiveToken = useAppStore((state)=>state.willReceiveToken)
  
    const { addToast } = useToasts()

    const RelayerFee =  useAppStore((state)=>state.fee)
   
    const {sendTx}= useRelayCallGasFee()
    

  
    const [swapState, doSwapFetch]=useAsyncFn(async() => {
      console.log('useRelayCall')
        if (account && contractAddress && library != undefined&&fromChainID!==null&&fromChainID==chainId&&toChainID!=null&&fromToken!==null&&toToken!==null) {
      

          try {
             
            const result = await sendTx()
            
            addToHistory({
                fromChainID:fromChainID, 
                toChainID:toChainID, 
                input:inputAmount, 
                fee:RelayerFee,
                txhash:result.hash,
                creattime:Date.now(),
                user:account,
                fromToken,
                toToken,
                output:willReceiveToken

              })
              addToast('Transactions have been sent', { appearance: 'success',autoDismissTimeout:1000*10 })
    
            
            
            // const txinfo = await result.wait([1])
            // console.log(txinfo)
            return result
            
          } catch (error:any) {
            let  msg
            if(error.data){
               msg =error.data.message
            }if(error.reason){
              msg =error.reason
            } else{
               msg=error.message
            }
            
            addToast(msg, { appearance: 'error',autoDismissTimeout:1000*5 })
  
          }
         
        }
      
    
    }, [account, library, contractAddress,chainId,fromChainID,RelayerFee,toChainID,addToHistory,addToast,inputAmount,sendTx,fromToken,toToken,willReceiveToken])
  
  

    return {
        swapState,
        doSwapFetch,
       
    }
  }