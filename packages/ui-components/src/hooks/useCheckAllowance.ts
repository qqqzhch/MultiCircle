import { useWeb3React } from '@web3-react/core'
import { useCallback, useEffect, useState } from 'react'
import { BigNumber, Contract } from 'ethers'


import erc20ABI from './../constants/ABI/ERC20.json'
import useRelayerAddress from './useRelayer'
import useUSDCAddress from './useUsdc'
import EventEmitter from '../EventEmitter/index';
import {useAsyncFn} from 'react-use';


export default function useErcCheckAllowance() {
    const { library,account } = useWeb3React()
    const checkAddress = useRelayerAddress();
    const contractAddress =useUSDCAddress()
    const [allowance, setAllowance] = useState<BigNumber>()

    const [state,dofetch]= useAsyncFn(async()=>{
      console.log('run CheckAllowance')
        if (account && contractAddress && library != undefined) {
          const contract = new Contract(contractAddress, erc20ABI, library)
        //   const result: BigNumber = await contract.balanceOf(mpcAddress)
          const allowance: BigNumber = await contract.allowance(account,checkAddress)
          setAllowance(allowance )
          return allowance
          
          
        }

    },[account, library, contractAddress,checkAddress])


  
    useEffect(() => {
      
      let IntervalId:number;
      if(library){
        // library.on('block', run)
        IntervalId=window.setInterval(()=>{
          dofetch()
        },1000*30)
        EventEmitter.on('checkallowance',dofetch)
      }
     
      
      dofetch()
  
      return () => {
        if (library) {
          // library.off('block',run)
          clearInterval(IntervalId)
          EventEmitter.off('checkallowance',dofetch)
        }
      }
    }, [account, library, dofetch])

    
    const fnback =useCallback((inputAmount:string)=>{
      if(allowance==undefined){
        return false
      }
      const result =allowance.gte(BigNumber.from(inputAmount))
     return  result
      
    },[allowance])

    const checkAmountAsync= useCallback(async(inputAmount:string)=>{
       return new Promise((resolve, reject)=>{
        const checkFn=()=>{
          try {
            const id = setTimeout(async ()=>{
              const AmountAllowance= await dofetch()
              if(AmountAllowance?.gte(BigNumber.from(inputAmount))){
                clearTimeout(id)
               
                resolve(true)
              }else{
                checkFn()
              }
    
            },500)  
          } catch (error) {
            reject(error)
          }
          

        }
        

       })
      

    },[dofetch])

    
  
    return {
      Validation:fnback,
      state,
      dofetch,
      checkAmountAsync
    }
  }