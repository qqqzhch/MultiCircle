import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import { BigNumber, Contract,ethers } from 'ethers'
import {useAsyncFn} from 'react-use';
import erc20ABI from './../constants/ABI/ERC20.json'
import useRelayerAddress from './useRelayer'
import useUSDCAddress from './useUsdc'
import { useToasts } from 'react-toast-notifications'
import EventEmitter from '../EventEmitter/index';
import { useAppStore } from '../state';




export default function useErc20Approve() {
    const { library,account } = useWeb3React()
    const checkAddress = useRelayerAddress();
    const contractAddress =useUSDCAddress()
    const { addToast } = useToasts()
    const inputAmount = useAppStore((state)=>state.input)

    
    const [state, doFetch]=useAsyncFn(async() => {
      console.log('useApprove')
        if (account && contractAddress && library != undefined) {
          const signer = library.getSigner()
          const contract = new Contract(contractAddress, erc20ABI, signer)
          try {
         
            const result = await contract.approve(checkAddress,inputAmount )
            addToast('Approving', { appearance: 'success' })
            await result.wait([1])
            // console.log('checkallowance event')
            // EventEmitter.emit('checkallowance')
            
            

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
      
    
    }, [account, library, contractAddress,checkAddress,addToast,inputAmount])
  
    return {
        state,
        doFetch
    }
  }