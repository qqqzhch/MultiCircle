import { useWeb3React } from '@web3-react/core'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { BigNumber, Contract, ethers } from 'ethers'
import { useAsyncFn, useDebounce } from 'react-use'
import UsdcRelayerABI from './../constants/ABI/UsdcRelayer.json'
import useRelayerAddress from './useRelayer'
import useUSDCAddress from './useUsdc'
import { Circle_Chainid } from '../constants/relayer'
import { useAppStore } from '../state'
import { useToasts } from 'react-toast-notifications'
import useErcCheckAllowance from './useCheckAllowance'




import useQuote from './useQuote'
import useSwapParameter from './useSwapParameter'

export default function useRelayCallGasFee() {
  const { library, account, chainId } = useWeb3React()

  const contractAddress = useRelayerAddress()
  const fromChainID = useAppStore(state => state.fromChainID)
  const inputAmount = useAppStore(state => state.input)
  const toChainID = useAppStore(state => state.toChainID)
  const setGasFeeStore = useAppStore(state => state.setGasFee)

  const { Validation2, allowanceValue, state } = useErcCheckAllowance()

  const fromToken = useAppStore(state => state.fromToken)
  const SwapParameter = useSwapParameter()

  const [gasFeeLoading, setGasFeeLoading] = useState(false)


  const isAllowance = useMemo(() => {
    return Validation2(allowanceValue, inputAmount)||fromToken?.address==""
  }, [Validation2, inputAmount, allowanceValue,fromToken])

  console.log('isAllowance', isAllowance,fromToken)
  console.log('checkAllowance.isStateAllowance', allowanceValue?.toString(), state?.toString())

  const getgas= useCallback( async ()=>{
    if(contractAddress==undefined||toChainID==null||isAllowance==false||SwapParameter.sellArgs==null||SwapParameter.buyArgs==null||account==undefined||account==null){
      return 
    }
    console.log('get gas')

    const signer = library.getSigner()
    const contract = new Contract(contractAddress, UsdcRelayerABI, signer)
    const destDomain = Circle_Chainid[toChainID]
    /**
     *    function swapAndBridge(
        SellArgs calldata sellArgs,
        BuyArgs calldata buyArgs,
        uint32 destDomain,
        bytes32 recipient
    ) public payable returns (uint64, uint64)
    */
    const sellArgs=SwapParameter.sellArgs;
    const buyArgs=SwapParameter.buyArgs;
    const value=fromToken?.address==""? inputAmount:"0"
    try {
      setGasFeeLoading(true)
      const accounthex32 = ethers.utils.hexZeroPad(account,32)
      const result=await contract.estimateGas.swapAndBridge(sellArgs,buyArgs,destDomain,accounthex32,{
        value: value
      })
      setGasFeeStore(result.toString())
      setGasFeeLoading(false)    
    } catch (error) {
      setGasFeeLoading(false)
    }
    

  },[library,contractAddress,setGasFeeStore,toChainID,account,SwapParameter.buyArgs,SwapParameter.sellArgs,setGasFeeLoading,isAllowance,inputAmount,fromToken?.address])

  useDebounce(()=>{
    getgas()
  },1000,[getgas])




  return {
   
    gasFeeLoading: gasFeeLoading,
     }
}
