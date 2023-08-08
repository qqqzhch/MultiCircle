import React,{FC, useMemo} from 'react'
import { useAppStore } from '../../state'
import { formatUnitsErc20, formatUnits, cutOut } from '../../utils'

type proteType={
    isFrom:boolean
  }

const TokenAndChainInfo:FC<proteType> = ({isFrom}) => {
    const fromChainInfo = useAppStore(state => state.fromChain)
    const toChainInfo = useAppStore(state => state.toChain)
    const input = useAppStore(state => state.input)
    const output = useAppStore(state => state.willReceiveToken)
    
    const fromToken = useAppStore(state => state.fromToken)
    const toToken = useAppStore(state => state.toToken)

    const Tokeninfo = useMemo(()=>{
      if(isFrom){
        return fromToken 
      }else{
        return toToken
      }
    },[isFrom,fromToken,toToken])

    const ChainInfo = useMemo(()=>{
        if(isFrom){
            return fromChainInfo 
          }else{
            return toChainInfo
          }
    },[isFrom,fromChainInfo,toChainInfo])

    const Amount= useMemo(()=>{
     if(isFrom){
        return input
     }else{
        return output
     }
    },[isFrom,input,output])

 if(Tokeninfo==null){
    return <></>
 }

  return (
    <div className=" bg-slate-50 flex rounded-md items-center space-x-1 p-4">
      <div className="flex -space-x-4  items-start">
        <img width={40} src={Tokeninfo.logoURI}></img>
        <img width={20} src={ChainInfo?.logoUrl}></img>
      </div>
      <div>
        <div>{isFrom?"From":"To"}  {ChainInfo?.label}</div>
        <div className=' flex flex-wrap'>{formatUnitsErc20(Amount, Tokeninfo.symbol, Tokeninfo.decimals)}</div>
      </div>
    </div>
  )
}

export default TokenAndChainInfo
