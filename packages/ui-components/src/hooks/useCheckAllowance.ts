import { useWeb3React } from '@web3-react/core'
import { useCallback, useEffect, useState } from 'react'
import { BigNumber, Contract } from 'ethers'


import erc20ABI from './../constants/ABI/ERC20.json'
import useRelayerAddress from './useRelayer'
import useUSDCAddress from './useUsdc'
import EventEmitter from '../EventEmitter/index';
import {useAsyncFn} from 'react-use';
import useSWR from 'swr'

export default function useErcCheckAllowance() {
    const { library,account,chainId } = useWeb3React()
    const checkAddress = useRelayerAddress();
    const contractAddress =useUSDCAddress()
    const [allowance, setAllowance] = useState<BigNumber>()
    const [fetchCheck, setFetchCheck] = useState<number>(0)

    // const [state,dofetch]= useAsyncFn(async()=>{
    //   console.log('run CheckAllowance')
    //     if (account && contractAddress && library != undefined) {
    //       const contract = new Contract(contractAddress, erc20ABI, library)
    //     //   const result: BigNumber = await contract.balanceOf(mpcAddress)
    //       const allowance: BigNumber = await contract.allowance(account,checkAddress)
    //       setAllowance(allowance )
    //       return allowance
          
          
    //     }

    // },[account, library, contractAddress,checkAddress])

    const { data } = useSWR([account, chainId, contractAddress,checkAddress,'erc20allowance',fetchCheck],
                            async([account, chainId, contractAddress,checkAddress])=>{
                            if (account && contractAddress && library != undefined) {
                              console.log('erc20allowance')
                              const contract = new Contract(contractAddress, erc20ABI, library)
                            //   const result: BigNumber = await contract.balanceOf(mpcAddress)
                              const allowance: BigNumber = await contract.allowance(account,checkAddress)
                              // setAllowance(allowance )
                              console.log('allowance',allowance.toString())
                              return allowance
                              
                              
                            }
                          })


  
    // useEffect(() => {
      
    //   let IntervalId:number;
    //   if(library){
    //     // library.on('block', run)
    //     IntervalId=window.setInterval(()=>{
    //       dofetch()
    //     },1000*30)
    //     EventEmitter.on('checkallowance',dofetch)
    //   }
     
      
    //   dofetch()
  
    //   return () => {
    //     if (library) {
    //       // library.off('block',run)
    //       clearInterval(IntervalId)
    //       EventEmitter.off('checkallowance',dofetch)
    //     }
    //   }
    // }, [account, library, dofetch])

    
    const fnback =useCallback((inputAmount:string)=>{
      if(data==undefined){
        return false
      }
      const result =data.gte(BigNumber.from(inputAmount))
     return  result
      
    },[data])

    const checkAmountAsync= useCallback(async(inputAmount:string)=>{
       return new Promise((resolve, reject)=>{
        const checkFn=()=>{
          try {
            const id = setTimeout(async ()=>{
              setFetchCheck((pre)=>{
                return pre+1
              })
              if(data?.gte(BigNumber.from(inputAmount))){
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
      

    },[setFetchCheck,data])

    
  
    return {
      Validation:fnback,
      // state,
      // dofetch,
      checkAmountAsync
    }
  }