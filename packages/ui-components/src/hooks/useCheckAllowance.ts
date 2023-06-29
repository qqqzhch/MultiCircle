import { useWeb3React } from '@web3-react/core'
import { useCallback, useEffect, useState } from 'react'
import { BigNumber, Contract } from 'ethers'


import erc20ABI from './../constants/ABI/ERC20.json'
import useRelayerAddress from './useRelayer'
import useUSDCAddress from './useUsdc'


export default function useErcCheckAllowance(inputAmount:string) {
    const { library,account } = useWeb3React()
    const checkAddress = useRelayerAddress();
    const contractAddress =useUSDCAddress()
    const [allowance, setAllowance] = useState<boolean>(false)


  
    useEffect(() => {
      const run = async()=>{
        console.log('run CheckAllowance')
        if (account && contractAddress && library != undefined) {
          const contract = new Contract(contractAddress, erc20ABI, library)
        //   const result: BigNumber = await contract.balanceOf(mpcAddress)
          const allowance: BigNumber = await contract.allowance(account,checkAddress)
          if(allowance.gte(BigNumber.from(inputAmount))){
            setAllowance(false )
          }else{
            setAllowance(true)
          }
          
          
        }
      }

      if(library){
        library.on('block', run)
      }
      
      run()
  
      return () => {
        if (library) {
          library.off('block',run)
        }
      }
    }, [account, library, contractAddress,inputAmount,checkAddress])
  
    return {
        allowance
    }
  }