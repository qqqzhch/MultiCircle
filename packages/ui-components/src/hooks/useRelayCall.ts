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


export default function useRelayCall() {
    const { library,account,chainId } = useWeb3React()

    const contractAddress =useRelayerAddress();
    const fromChainID = useAppStore((state)=>state.fromChainID)
    const inputAmount = useAppStore((state)=>state.input)
    const toChainID = useAppStore((state)=>state.toChainID)
    const addToHistory = useAppStore((state)=>state.addToHistory)
    const fromToken = useAppStore((state)=>state.fromToken)
    const toToken = useAppStore((state)=>state.toToken)
  
    const { addToast } = useToasts()

    const burnToken=useUSDCAddress();
    const RelayerFee =  useAppStore((state)=>state.fee)
    const quoteData = useQuote()
    const getToken=useUSDCAddress(toChainID);
    

  
    const [state, doFetch]=useAsyncFn(async() => {
      console.log('useRelayCall')
        if (account && contractAddress && library != undefined&&fromChainID!==null&&fromChainID==chainId&&toChainID!=null) {
         const destinationDomain=Circle_Chainid[toChainID];
         const mintRecipient=account;
         const amount=inputAmount;

          const signer = library.getSigner()
          const contract = new Contract(contractAddress, UsdcRelayerABI, signer)

          try {
             
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
  
            // const txinfo = await result.wait([1])
            // console.log(txinfo)
            return result
            
          } catch (error:any) {
            let  msg
            if(error.data){
               msg =error.data.message
            }else{
               msg=error.message
            }
            
            addToast(msg, { appearance: 'error',autoDismissTimeout:1000*5 })
  
          }
         
        }
      
    
    }, [account, library, contractAddress,chainId,fromChainID,burnToken,RelayerFee,toChainID,addToHistory,addToast,inputAmount])
  
    const [swapState,doSwapFetch]= useAsyncFn(async()=>{
      if (account && contractAddress && library != undefined&&fromChainID!==null&&fromChainID==chainId&&toChainID!=null&&quoteData.data!==undefined
        &&fromToken!==null&&toToken!==null) {
    

        const signer = library.getSigner()
        const contract = new Contract(contractAddress, UsdcRelayerABI, signer)
        const { value, gasPrice, buyTokenAddress, sellTokenAddress ,sellAmount,allowanceTarget,to,data} = quoteData.data;

        const destDomain = Circle_Chainid[toChainID]

        
        const gasObjAndAmount = {
          gasPrice:gasPrice,
          gasLimit:1000000,
          value:0
        }
        const  testnetdeployer=account
        if(fromToken?.address==""){
          gasObjAndAmount.value=parseInt(value)
        }

        const result=await contract.swapAndBridge(sellAmount,
          sellTokenAddress,
          buyTokenAddress,
          allowanceTarget,
          to,
          data,
          destDomain,testnetdeployer,buyTokenAddress,gasObjAndAmount)

          return result
       
      }
          

    },[quoteData,account, library, contractAddress,chainId,fromChainID,burnToken,RelayerFee,toChainID,addToHistory,addToast,inputAmount,fromToken,toToken])
   
    const checkIsSwap=useCallback(()=>{
      if((fromToken==null||toToken==null)||getToken!==toToken.address){
        return false
      }
      if(fromChainID!==toChainID){
        if(fromToken.address!==burnToken){
          return true
        }

      }
      return false 
         
    },[fromToken,toToken,fromChainID,toChainID,burnToken,getToken])

    return {
        state,
        doFetch,
        swapState,
        doSwapFetch,
        checkIsSwap
    }
  }