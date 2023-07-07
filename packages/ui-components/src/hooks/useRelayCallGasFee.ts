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

import useSWR from 'swr'

export default function useRelayCallGasFee() {
    const { library,account,chainId } = useWeb3React()

    const contractAddress =useRelayerAddress();
    const fromChainID = useAppStore((state)=>state.fromChainID)
    const inputAmount = useAppStore((state)=>state.input)
    const toChainID = useAppStore((state)=>state.toChainID)
    const setGasFeeStore = useAppStore((state)=>state.setGasFee)
  
    const { addToast } = useToasts()

    const burnToken=useUSDCAddress();
    const RelayerFee =  useAppStore((state)=>state.fee)
    const [gasFee,setGasFee]=useState(0)
    const [gasFeeLoading,setGasFeeLoading]=useState(false)

    const { data, error, isLoading }= useSWR([account, contractAddress,chainId,fromChainID,burnToken,RelayerFee,toChainID,inputAmount,'gasfee'],async()=>{
                                              console.log('useRelayCall GAS FEE')
                                              if (account && contractAddress && library != undefined&&fromChainID!==null&&fromChainID==chainId&&toChainID!=null&&inputAmount!=="0"&&RelayerFee!=="0") {
                                              const destinationDomain=Circle_Chainid[toChainID];
                                              const mintRecipient=account;
                                              const amount=inputAmount;

                                                const signer = library.getSigner()
                                                const contract = new Contract(contractAddress, UsdcRelayerABI, signer)
                                                // setGasFee(0)
                                                setGasFeeStore("0")  
                                             
                                                  const result = await contract.estimateGas.callout(amount,destinationDomain,mintRecipient,burnToken,{
                                                    value:RelayerFee
                                                  })
                                                  
                                                // setGasFee(result.toNumber())
                                                setGasFeeStore(result.toString())
                                                return result.toNumber()  
                                            
                                            
                                              
                                              }  
                                            })

    //  useEffect(()=>{
    //   const run=async () => {
    //     console.log('useRelayCall GAS FEE')
    //     if (account && contractAddress && library != undefined&&fromChainID!==null&&fromChainID==chainId&&toChainID!=null&&inputAmount!=="0") {
    //      const destinationDomain=Circle_Chainid[toChainID];
    //      const mintRecipient=account;
    //      const amount=inputAmount;

    //      const signer = library.getSigner()
    //       const contract = new Contract(contractAddress, UsdcRelayerABI, signer)
    //       setGasFee(0)
    //       setGasFeeLoading(true)
    //       setGasFeeStore("0")  
    //       try {
    //         const result = await contract.estimateGas.callout(amount,destinationDomain,mintRecipient,burnToken,{
    //           value:RelayerFee
    //         })
            
    //         setGasFee(result.toNumber())
    //         setGasFeeStore(result.toString())
            
    //       } catch (error:any) {
    //         let  msg
    //         if(error.data){
    //            msg =error.data.message
    //         }else{
    //            msg=error.message
    //         }
            
       
  
    //       }
    //       setGasFeeLoading(false)
         
    //     }  
    //   }
    //   run()
      
      
    
    // }, [account, library, contractAddress,chainId,fromChainID,burnToken,RelayerFee,toChainID,setGasFeeStore,addToast,inputAmount,setGasFee])
  
    return {
      gasFee:data,
      gasFeeLoading:isLoading
    }
  }