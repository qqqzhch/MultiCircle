import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import { BigNumber, Contract,ethers } from 'ethers'
import {useAsyncFn} from 'react-use';
import erc20ABI from './../constants/ABI/ERC20.json'
import useRelayerAddress from './useRelayer'
import useUSDCAddress from './useUsdc'


export default function useErc20Approve() {
    const { library,account } = useWeb3React()
    const checkAddress = useRelayerAddress();
    const contractAddress =useUSDCAddress()
  

  
    const [state, doFetch]=useAsyncFn(async() => {
      console.log('useApprove')
        if (account && contractAddress && library != undefined) {
          const signer = library.getSigner()
          const contract = new Contract(contractAddress, erc20ABI, signer)
          const result = await contract.approve(checkAddress,ethers.constants.MaxUint256 )
          await result.wait([1])
          return result
        }
      
    
    }, [account, library, contractAddress,checkAddress])
  
    return {
        state,
        doFetch
    }
  }