import { useWeb3React } from '@web3-react/core'
import { useCallback, useEffect, useState } from 'react'
import { BigNumber, Contract } from 'ethers'


import erc20ABI from './../constants/ABI/ERC20.json'
import useRelayerAddress from './useRelayer'
import useUSDCAddress from './useUsdc'
import EventEmitter from '../EventEmitter/index';
import {useAsyncFn} from 'react-use';
import useSWR from 'swr'
import { useAppStore } from '../state';

export default function useErcCheckAllowance() {
    const { library,account,chainId } = useWeb3React()
    const checkAddress = useRelayerAddress();
    const contractAddress =useUSDCAddress()
    // const [allowanceValue, setAllowanceValue] = useState<BigNumber>()
    // const [fetchCheck, setFetchCheck] = useState<number>(0)
    
    const checkAmountAsync= useCallback(async()=>{
      // console.log('emit')
      // setFetchCheck((pre)=>{
      //   return pre+1
      // })

    },[])


    const { data,isLoading } = useSWR([account, chainId, contractAddress,checkAddress,'erc20allowance'],
                            async([account, chainId, contractAddress,checkAddress])=>{
                            if (account && contractAddress && library != undefined) {
                              console.log('erc20allowance')
                              const contract = new Contract(contractAddress, erc20ABI, library)
                            //   const result: BigNumber = await contract.balanceOf(mpcAddress)
                              const allowance: BigNumber = await contract.allowance(account,checkAddress)
                              // setAllowance(allowance )
                        
                              return allowance
                              
                              
                            }else{
                              console.log('erc20allowance ***')
                            }
                          })

    console.log('set allowance',data?.toString(),isLoading)
  


    
    const fnback =useCallback((inputAmount:string)=>{
      if(data==undefined){
        return false
      }
      const result =data.gte(BigNumber.from(inputAmount))
     return  result
      
    },[data])

    const fnback2 =useCallback((allowanceAmount:BigNumber|undefined,inputAmount:string)=>{
      if(allowanceAmount==undefined){
        return false
      }
      const result =allowanceAmount.gte(BigNumber.from(inputAmount))
     return  result
      
    },[])

 
    return {
      Validation:fnback,
      Validation2:fnback2,
      state:data,
      // dofetch,
      checkAmountAsync,
      allowanceValue:data,
      isLoading
    }
  }