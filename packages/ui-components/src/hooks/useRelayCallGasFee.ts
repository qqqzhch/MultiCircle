import { useWeb3React } from '@web3-react/core'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { BigNumber, Contract, ethers } from 'ethers'
import { useAsyncFn } from 'react-use'
import UsdcRelayerABI from './../constants/ABI/UsdcRelayer.json'
import useRelayerAddress from './useRelayer'
import useUSDCAddress from './useUsdc'
import { Circle_Chainid } from '../constants/relayer'
import { useAppStore } from '../state'
import { useToasts } from 'react-toast-notifications'
import useErcCheckAllowance from './useCheckAllowance'

import useSWR from 'swr'
import EventEmitter from '../EventEmitter/index'

import useQuote from './useQuote'

export default function useRelayCallGasFee() {
  const { library, account, chainId } = useWeb3React()

  const contractAddress = useRelayerAddress()
  const fromChainID = useAppStore(state => state.fromChainID)
  const inputAmount = useAppStore(state => state.input)
  const toChainID = useAppStore(state => state.toChainID)
  const setGasFeeStore = useAppStore(state => state.setGasFee)
  const [fetchCheck, setFetchCheck] = useState<number>(0)
  const { Validation2, allowanceValue, state } = useErcCheckAllowance()
  const quoteData = useQuote()
  const fromToken = useAppStore(state => state.fromToken)
  const toToken = useAppStore(state => state.toToken)

  const { addToast } = useToasts()

  const burnToken = useUSDCAddress()
  const getToken = useUSDCAddress(toChainID)
  const RelayerFee = useAppStore(state => state.fee)
  const setWillReceiveToken = useAppStore(state => state.setWillReceiveToken)

  const [gasFeeLoading, setGasFeeLoading] = useState(false)

  useEffect(() => {
    console.log('emit')
    const run = () => {
      setFetchCheck(pre => {
        return pre + 1
      })
    }

    EventEmitter.on('Refresh', run)
    return () => {
      EventEmitter.off('Refresh', run)
    }
  }, [setFetchCheck])

  const isAllowance = useMemo(() => {
    return Validation2(allowanceValue, inputAmount)
  }, [Validation2, inputAmount, allowanceValue])

  console.log('isAllowance', isAllowance)
  console.log('checkAllowance.isStateAllowance', allowanceValue?.toString(), state?.toString())

  useEffect(()=>{
    if(quoteData.data?.grossBuyAmount!==undefined){
      setWillReceiveToken(quoteData.data?.grossBuyAmount)
    }
    
  },[quoteData,setWillReceiveToken])

  const { data, error, isLoading } = useSWR(
    isAllowance||fromToken?.address==""
      ? [account, contractAddress,toChainID, fromChainID,inputAmount, fromToken?.address,toToken?.address, 'gasfee', fetchCheck]
      : null,
    async () => {
      if (
        account &&
        contractAddress &&
        library != undefined &&
        fromChainID !== null &&
        fromChainID == chainId &&
        toChainID != null &&
        inputAmount !== '0' &&
        RelayerFee !== '0'
      ) {
        console.log('useRelayCall GAS FEE')

        if (burnToken == fromToken?.address && getToken == toToken?.address) {
          const destinationDomain = Circle_Chainid[toChainID]
          const mintRecipient = account
          const amount = inputAmount

          const signer = library.getSigner()
          const contract = new Contract(contractAddress, UsdcRelayerABI, signer)

          const result = await contract.estimateGas.callout(amount, destinationDomain, mintRecipient, burnToken, {
            value: RelayerFee
          })

          setGasFeeStore(result.toString())
          return result.toNumber()
        } else {
          if(quoteData.data==undefined){
            setGasFeeStore('0')
            return 
          }
          const { value, gasPrice, buyTokenAddress, sellTokenAddress ,sellAmount,allowanceTarget,to,data} = quoteData.data;
          const signer = library.getSigner()
          const contract = new Contract(contractAddress, UsdcRelayerABI, signer)
          const destDomain = Circle_Chainid[toChainID]
          const usdcaddress =toToken?.address
          const gasObjAndAmount = {
            gasPrice:gasPrice,
            gasLimit:1000000,
            value:0
          }
          const  testnetdeployer=account
          if(fromToken?.address==""){
            gasObjAndAmount.value=parseInt(value)
          }

          const result=await contract.estimateGas.swapAndBridge(sellAmount,
            sellTokenAddress,
            buyTokenAddress,
            allowanceTarget,
            to,
            data,
            destDomain,testnetdeployer,buyTokenAddress,gasObjAndAmount)
          console.log('anycallstep1log',result)
          setGasFeeStore(result.toString())
          return result.toNumber()
        }
      } else {
        setGasFeeStore('0')
      }
    }
  )

  return {
    gasFee: data,
    gasFeeLoading: isLoading,
    error
  }
}
