import React,{FC,useMemo} from 'react'
import { useAppStore } from '../../state'
type proteType={
  isFrom:boolean
}

const SelectToken:FC<proteType> = ({isFrom})=> {
  const fromToken = useAppStore((state)=>state.fromToken)
  const toToken = useAppStore((state)=>state.toToken)

  const TokenInfo= useMemo(()=>{
    if(isFrom){
      return fromToken 
    }else{
      return toToken
    }

  },[fromToken,toToken,isFrom])

  return (
    <div className="skt-w skt-w-input skt-w-button flex w-auto flex-shrink-0 items-center justify-between bg-transparent p-0 hover:bg-transparent">
      <span className="flex items-center">
        <div className="relative flex h-fit w-fit">
          <div className="skt-w h-6 w-6 overflow-hidden rounded-full">
            <img src={TokenInfo?.logoURI} width="100%" height="100%" />
          </div>
        </div>
        <span className="skt-w text-valuerouter-primary -mb-0.5 ml-1 font-medium sm:text-lg">{TokenInfo?.symbol}</span>
      </span>
     
    </div>
  )
}

export default SelectToken
