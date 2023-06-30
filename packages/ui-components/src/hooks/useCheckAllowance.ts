import { useWeb3React } from '@web3-react/core'
import { useCallback, useEffect, useState } from 'react'
import { BigNumber, Contract } from 'ethers'


import erc20ABI from './../constants/ABI/ERC20.json'
import useRelayerAddress from './useRelayer'
import useUSDCAddress from './useUsdc'


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

      if(library){
        library.on('block', run)
      }
      
      run()
  
      return () => {
        if (library) {
          library.off('block',run)
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