import React, { useMemo ,useEffect, useCallback} from 'react';
import { Dialog,Transition  } from '@headlessui/react'
import { Fragment, FC  } from 'react'
import { Else, If, Then, When } from 'react-if';
import { SupportedChainId, TESTNET_CHAIN_IDS,USECHAIN_IDS } from '../../constants/chains';
import { L1ChainInfo, L2ChainInfo, getChainInfo } from '../../constants/chainInfo';
import { useAppStore } from '../../state';
import useSwitchingNetwork from '../../hooks/useSwitchingNetwork';
import useTokenList from '../../hooks/useTokenList';
import Skeleton from 'react-loading-skeleton'
import { Token } from '../../types/token';





interface componentprops {
    isOpen: boolean
    closeModal: () => void,
    dataType:boolean
  }



const SelectChainModal: FC<componentprops> = ({isOpen,closeModal,dataType}) => {
  const setFromOrTOChain = useAppStore((state)=>state.setFromOrTOChain)
  const fromChainID = useAppStore((state)=>state.fromChainID)
  const toChainID = useAppStore((state)=>state.toChainID)
  const setToken = useAppStore((state)=>state.setToken)


  const switchingNetwork = useSwitchingNetwork()
  const listIng = useMemo(()=>{

    // if(dataType==false){
    //   return  USECHAIN_IDS.filter((item)=>{return  item!==fromChainID})
    // }
    return USECHAIN_IDS
  },[])
  const {
        data:tokenList  ,
        // error:tokenError ,
        isLoading:tokenisLoading,
        // balanceList  
      }= useTokenList(fromChainID)

  const tokenListEth= useMemo(()=>{

 if(fromChainID==null||tokenList==undefined) return []

  const chainInfo =  getChainInfo(fromChainID)
  const item:Token=  {
    "chainId": fromChainID,
    "address": '',
    "name": chainInfo.nativeCurrency.name,
    "symbol": chainInfo.nativeCurrency.symbol,
    "decimals": chainInfo.nativeCurrency.decimals,
    "logoURI": chainInfo.logoUrl
} 
  return [item,...tokenList.slice(0,10)]
    

  },[tokenList,fromChainID])
     
  useEffect(()=>{
    const need=fromChainID==null||toChainID==null||USECHAIN_IDS.includes(fromChainID)==false||USECHAIN_IDS.includes(toChainID)==false
    //set default
    if(need&&dataType){

      const networkFrom =getChainInfo(USECHAIN_IDS[0])
      const networkTo =getChainInfo(USECHAIN_IDS[1])
      
      setFromOrTOChain(networkFrom,true ,USECHAIN_IDS[0]) // true from 
      setFromOrTOChain(networkTo,false,USECHAIN_IDS[1])  //false to

    }

  },[fromChainID,toChainID,dataType,setFromOrTOChain])

  const clickFn = useCallback(async (network: L1ChainInfo | L2ChainInfo,chainId:SupportedChainId)=>{
 
    setFromOrTOChain(network,dataType,chainId);
    // closeModal()
    // setTimeout(()=>{
    //   if(dataType){
    //      switchingNetwork.doSwitch(chainId)
    //    }
    // },0) 
    
    
  },[switchingNetwork,dataType,setFromOrTOChain,closeModal])

  const selectToken= useCallback((data:Token)=>{
    setToken(dataType,data)
    closeModal()

  },[setToken,closeModal,dataType])
  

  return (
      <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  <If condition={dataType}>
                    <Then>
                      From
                    </Then>
                    <Else>
                      To
                    </Else>
                  </If>
                </Dialog.Title>
                <div className="mt-2">
                 
<ul className="max-w-md divide-x divide-gray-200 dark:divide-gray-700 flex flex-row  ">
  {listIng.map((chainId,index)=>{
    const network =getChainInfo(chainId)

    return (
  
    
    <li key={index} onClick={()=>{clickFn(network,chainId);}}  className="  w-32 pb-3 pt-2 sm:pb-4 cursor-pointer hover:bg-slate-50">
    <div className="flex flex-col items-center space-y-4  ">
       <div className="flex-shrink-0">
          <img className="w-8 h-8 rounded-full" src={network.logoUrl} >
          </img>
         
        
       </div>
       <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
          {network.label}
          </p>
          {/* <p className="text-sm text-gray-500 truncate dark:text-gray-400">
          {network.nativeCurrency.name}
          </p> */}
       </div>
    
    </div>
  </li>


 )
  })}
   

</ul>
<div>
<If condition={tokenisLoading}>
 <Then>
 <Skeleton count={10} /> 
 </Then>
 <Else>
 <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-scroll">
  {tokenListEth&&tokenListEth.map((TokenItem,index)=>{
 

    return (<li key={index} onClick={()=>{selectToken(TokenItem)}}   className="pb-3 pt-2 sm:pb-4 cursor-pointer hover:bg-slate-50">
    <div className="flex items-center space-x-4 ">
       <div className="flex-shrink-0">
          <img className="w-8 h-8 rounded-full" src={TokenItem.logoURI} >
          </img>
       </div>
       <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
          {TokenItem.name}
          </p>
          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
          {TokenItem.symbol}
          </p>
       </div>
       <div className="  min-w-[50px]  pr-2">
          {/* <div className="text-sm font-medium text-gray-900 truncate dark:text-white">
            <If condition={TokenItem.balance==undefined}>
              <Then>
                <div className=' w-full'>
                <Skeleton count={1}  className=' w-10 h-4' /> 
               
                </div>
              
              </Then>
              <Else>
                {TokenItem.balance}
              </Else>
            </If>
      
          
          </div> */}
          {/* <p className="text-sm text-gray-500 truncate dark:text-gray-400">
          333
          </p> */}
       </div>
    
    </div>
 </li>)
  })}
   

</ul>
 </Else>
</If>



</div>

                </div>

               
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
    
    );
};

export default SelectChainModal;