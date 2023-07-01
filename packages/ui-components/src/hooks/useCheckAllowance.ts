import { useWeb3React } from '@web3-react/core'
import { useCallback, useEffect, useState } from 'react'
import { BigNumber, Contract } from 'ethers'


import erc20ABI from './../constants/ABI/ERC20.json'
import useRelayerAddress from './useRelayer'
import useUSDCAddress from './useUsdc'
import EventEmitter from '../EventEmitter/index';


export default function useErcCheckAllowance() {
    const { library,account } = useWeb3React()
    const checkAddress = useRelayerAddress();
    const contractAddress =useUSDCAddress()
    const [allowance, setAllowance] = useState<BigNumber>()


  
    useEffect(() => {
      const run = async()=>{
        console.log('run CheckAllowance')
        if (account && contractAddress && library != undefined) {
          const contract = new Contract(contractAddress, erc20ABI, library)
        //   const result: BigNumber = await contract.balanceOf(mpcAddress)
          const allowance: BigNumber = await contract.allowance(account,checkAddress)
          setAllowance(allowance )
          
          
        }
      }
      let IntervalId:number;
      if(library){
        // library.on('block', run)
        IntervalId=window.setInterval(()=>{
          run()
        },1000*30)
        EventEmitter.on('checkallowance',run)
      }
     
      
      run()
  
      return () => {
        if (library) {
          // library.off('block',run)
          clearInterval(IntervalId)
          EventEmitter.off('checkallowance',run)
        }
      }
    }, [account, library, contractAddress,checkAddress])

    const fnback =useCallback((inputAmount:string)=>{
      if(allowance==undefined){
        return false
      }
      const result =allowance.gte(BigNumber.from(inputAmount))
     return  result
      
    },[allowance])
  
    return fnback
  }