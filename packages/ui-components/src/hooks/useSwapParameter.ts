import { useWeb3React } from '@web3-react/core'
import useUSDCAddress from './useUsdc'
import { useAppStore } from '../state'
import {  useEffect, useMemo } from 'react'
import { NativeCoinAddress  } from '../constants/usdc'
import useQuote from './useQuote'
import { BigNumber, ethers } from 'ethers'
import useRelayerFeeRate from './useRelayerFeeRate'
import { perThousandRatioForFee } from '../utils'





export default function useSwapParameter(){
    console.log('useSwapParameter')
    const fromChainID = useAppStore(state => state.fromChainID)
    const toChainID = useAppStore(state => state.toChainID)

    const fromToken = useAppStore(state => state.fromToken)
    const toToken = useAppStore(state => state.toToken)
    const input = useAppStore(state => state.input)
    const setWillReceiveToken = useAppStore(state => state.setWillReceiveToken)
    const {data:dataFee}= useRelayerFeeRate();

    
    const usdcFrom = useUSDCAddress(fromChainID)
    const usdcTo = useUSDCAddress(toChainID)

    const isFromNeedSwap=useMemo(()=>{
       if(fromToken?.address==usdcFrom){
        return false
       }else{
        return true
       }

    },[fromToken,usdcFrom])

    const quoteDataSell = useQuote(isFromNeedSwap,true)
    const quotebuyAmount=useMemo(()=>{
        let fromNum:string|undefined;
        
        if(isFromNeedSwap){
            fromNum=  quoteDataSell.data?.grossBuyAmount
        }else{
            fromNum= input
        }
        if(fromNum==undefined||dataFee==undefined)
        return undefined
        
        console.log('RelayerFeeRate.data',dataFee.toString())
        const result = perThousandRatioForFee(BigNumber.from(fromNum),dataFee)
        console.log('RelayerFeeRate.data',result)
        return result?.toString();

    
        
    },[quoteDataSell.data,isFromNeedSwap,input,dataFee])




    const isToNeedSwap= useMemo(()=>{
        if(toToken?.address==usdcTo){
            return false
        }else{
            return true
        }

    },[toToken,usdcTo])

    const quoteDataBuy = useQuote(isToNeedSwap,false,quotebuyAmount)

    /*
        struct SellArgs {
        address sellToken;
        uint256 sellAmount;
        uint256 sellcallgas;
        bytes sellcalldata;
    }

    struct BuyArgs {
        bytes32 buyToken;
        uint256 guaranteedBuyAmount;
        uint256 buycallgas;
        bytes buycalldata;
    }
    */
    const sellArgs = useMemo(()=>{
        if(fromToken==null||input=="0")
         return null
        if(isFromNeedSwap&&quoteDataSell.data==undefined){
            return null
        }
        const sellToken=isFromNeedSwap?(fromToken.address==''?NativeCoinAddress:fromToken.address):usdcFrom
        const sellAmount=input
        const sellcallgas=isFromNeedSwap?quoteDataSell.data?.gas:"0"
        const sellcalldata=isFromNeedSwap?quoteDataSell.data?.data:"0x0000000000000000000000000000000000000000000000000000000000000000"
         
        const grossBuyAmountSmall = isFromNeedSwap? BigNumber.from(quoteDataSell.data?.grossBuyAmount).sub(50).toString():"0"

        const  guaranteedBuyAmount=isFromNeedSwap?grossBuyAmountSmall:"0"
        
        return {
            sellToken,
            sellAmount,
            sellcallgas,
            sellcalldata,
            guaranteedBuyAmount
        }

    },[isFromNeedSwap,fromToken,input, quoteDataSell.data,usdcFrom])

    const buyArgs = useMemo(()=>{
        if(toToken==null)
         return null
        if(isToNeedSwap&&quoteDataBuy.data==undefined){
            return null
        }
        const buyToken=isToNeedSwap? (toToken.address==''?NativeCoinAddress:toToken.address):usdcTo 
        const grossBuyAmountSmall= isToNeedSwap? BigNumber.from(quoteDataBuy.data?.grossBuyAmount).sub(50).toString():"0"
        const guaranteedBuyAmount=isToNeedSwap?grossBuyAmountSmall:quotebuyAmount
        const buycallgas=isToNeedSwap?quoteDataBuy.data?.gas:"0"
        const buycalldata=isToNeedSwap?quoteDataBuy.data?.data:"0x0000000000000000000000000000000000000000000000000000000000000000"
        if(buyToken==undefined){
            return null
        }
      
        const buyTokenAddresds = ethers.utils.hexZeroPad(buyToken,32)
        return {
            buyToken:buyTokenAddresds,
            guaranteedBuyAmount,
            buycallgas,
            buycalldata
        }
        /**
         *   export type BuyArgsStruct = {
                    buyToken: BytesLike;
                    guaranteedBuyAmount: BigNumberish;
                    buycallgas: BigNumberish;
                    buycalldata: BytesLike;
            };
        */
      
    },[isToNeedSwap,toToken,quoteDataBuy.data,quotebuyAmount,usdcTo])

    useEffect(()=>{
       
        if(isToNeedSwap){
            if(quoteDataBuy.data?.buyAmount==undefined)
             return
            setWillReceiveToken(quoteDataBuy.data?.buyAmount)
        }else{
            if(quotebuyAmount==undefined) return 
         setWillReceiveToken(quotebuyAmount)
        }

    },[setWillReceiveToken,isToNeedSwap,quoteDataBuy.data,quotebuyAmount])


    return {
        isFromNeedSwap,
        isToNeedSwap,
        sellArgs,
        buyArgs
    }

}