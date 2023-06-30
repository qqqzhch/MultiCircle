import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import { BigNumber, Contract, ethers,providers } from 'ethers'
import { useAppStore } from '../state';
import useRelayerAddress from './useRelayer'
import UsdcRelayerABI from '../constants/ABI/UsdcRelayer.json'
import { Circle_Chainid } from '../constants/relayer';
import { RPC_URLS } from '../constants/networks';

export default function useRelayerFee() {
    const { library,chainId } = useWeb3React()
    const toChainID = useAppStore((state)=>state.toChainID)
    const fromChainID = useAppStore((state)=>state.fromChainID)

    const contractAddress = useRelayerAddress();
    const setFee = useAppStore((state)=>state.setFee)
    const [value, setValue] = useState<string>()
    const [isloading,setIsloading] = useState(false);
  
    useEffect(() => {
      const run = async () => {
        console.log('useRelayerFee')
        setValue('0')
        setFee('0')
        if ( contractAddress && library != undefined&&toChainID!==null&&fromChainID!==null&&toChainID!==fromChainID) {
          

          const rpc= RPC_URLS[fromChainID][0]
          const prcPro= new providers.JsonRpcProvider(rpc)

          const CircleID = Circle_Chainid[toChainID]
          const contract = new Contract(contractAddress, UsdcRelayerABI, prcPro)

          const result: BigNumber = await contract.feeByDestinationDomain(CircleID)
          if(result.eq(0)){
            setValue(ethers.utils.parseEther('0.0001').toString())
            setFee(ethers.utils.parseEther('0.0001').toString())
          }else{
            
            setValue(result.toString())
            setFee(result.toString())
          }


        }
        setIsloading(false)
      }
     
      
      setIsloading(true)
      run()
  
      
    }, [library, contractAddress,chainId,toChainID,setFee,fromChainID,setIsloading])
  
    return {
      fee:value,
      isloading
    }
  }