import { useWeb3React } from '@web3-react/core'
import useUSDCAddress from './useUsdc'
import { useAppStore } from '../state'
import {  useMemo } from 'react'
import { USDC_IDS_TO_ADDR } from '../constants/usdc'


export default function useSwapParameter(){

    const fromChainID = useAppStore(state => state.fromChainID)
    const toChainID = useAppStore(state => state.toChainID)

    const fromToken = useAppStore(state => state.fromToken)
    const toToken = useAppStore(state => state.toToken)
    
    const usdcFrom = useUSDCAddress(fromChainID)
    const usdcTo = useUSDCAddress(toChainID)

    const isFromNeedSwap=useMemo(()=>{
       if(fromToken?.address==usdcFrom){
        return false
       }else{
        return true
       }

    },[fromToken,usdcFrom])

    const isToNeedSwap= useMemo(()=>{
        if(toToken?.address==usdcTo){
            return false
        }else{
            return true
        }

    },[toToken,usdcTo])


    return {
        isFromNeedSwap,
        isToNeedSwap
    }

}