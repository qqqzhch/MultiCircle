import React, { useMemo ,useEffect, useCallback, useState} from 'react';
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
import { CheckIcon } from '@heroicons/react/24/solid';
import List from 'rc-virtual-list';
import { cutOut } from '../../utils';






interface componentprops {
    isOpen: boolean
    closeModal: () => void,
    isFrom:boolean
  }

/**
 * 切换网络，token也需要清空
*/

const SelectChainModal: FC<componentprops> = ({isOpen,closeModal,isFrom}) => {
  const setFromOrTOChain = useAppStore((state)=>state.setFromOrTOChain)
  const fromChainID = useAppStore((state)=>state.fromChainID)
  const toChainID = useAppStore((state)=>state.toChainID)
  const setToken = useAppStore((state)=>state.setToken)
  const fromToken = useAppStore((state)=>state.fromToken)
  const toToken = useAppStore((state)=>state.toToken)
  const [searchKey,setSearchKey]=useState("")

  const switchingNetwork = useSwitchingNetwork()
  const listIng = useMemo(()=>{

    // if(isFrom==false){
    //   return  USECHAIN_IDS.filter((item)=>{return  item!==fromChainID})
    // }
    return USECHAIN_IDS
  },[])
  const currChainID= useMemo(()=>{
     if(isFrom)
     return fromChainID
     else
     return toChainID
  },[isFrom,fromChainID,toChainID])

  const currToken= useMemo(()=>{
    if(isFrom)
    return fromToken
    else
    return toToken
 },[isFrom,fromToken,toToken])

  const {
        data:tokenList  ,
        // error:tokenError ,
        isLoading:tokenisLoading,
        // balanceList  
      }= useTokenList(isFrom)

  const tokenListEth = useMemo(() => {
    // console.log('- - tokenListEth')
    if (currChainID == null || tokenList == undefined) return []

    const chainInfo = getChainInfo(currChainID)
    const item: Token = {
      chainId: currChainID,
      address: '',
      name: chainInfo.nativeCurrency.name,
      symbol: chainInfo.nativeCurrency.symbol,
      decimals: chainInfo.nativeCurrency.decimals,
      logoURI: chainInfo.logoUrl
    }
    const list = tokenList.filter(item => {
      if (searchKey == '') return true
      if (item.name.toLowerCase().includes(searchKey.toLowerCase()) || item.symbol.toLowerCase().includes(searchKey.toLowerCase())) {
        return true
      } else {
        return false
      }
    })

    return [item, ...list]
  }, [tokenList, currChainID, searchKey])
     
  useEffect(()=>{
    const need=fromChainID==null||toChainID==null||USECHAIN_IDS.includes(fromChainID)==false||USECHAIN_IDS.includes(toChainID)==false
    //set default
    if(need&&isFrom){

      const networkFrom =getChainInfo(USECHAIN_IDS[0])
      const networkTo =getChainInfo(USECHAIN_IDS[1])
      
      setFromOrTOChain(networkFrom,true ,USECHAIN_IDS[0]) // true from 
      setFromOrTOChain(networkTo,false,USECHAIN_IDS[1])  //false to

    }

  },[fromChainID,toChainID,isFrom,setFromOrTOChain])

  const selectToken= useCallback((data:Token|null)=>{
    setToken(isFrom,data)
    if(data!==null){
      closeModal()
    }
    

  },[setToken,closeModal,isFrom])

  const clickFn = useCallback(async (network: L1ChainInfo | L2ChainInfo,chainId:SupportedChainId)=>{
 
    setFromOrTOChain(network,isFrom,chainId);
    selectToken(null)

  
  },[isFrom,setFromOrTOChain,selectToken])


  

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
                  <If condition={isFrom}>
                    <Then>
                    Select a token
                    </Then>
                    <Else>
                    Select a token
                    </Else>
                  </If>
                </Dialog.Title>
                <div className="mt-2">
              
<ul className="max-w-md divide-x divide-gray-200 dark:divide-gray-700 flex flex-row  ">
  {listIng.map((chainId,index)=>{
    const network =getChainInfo(chainId)

    return (
  
    
    <li key={index} onClick={()=>{clickFn(network,chainId);}}  className="  w-32 pb-3 pt-2 sm:pb-4 cursor-pointer hover:bg-slate-50">
    <div className="flex flex-col items-center space-y-4   relative">
      <div className=' absolute   right-2'>
        <When condition={currChainID==chainId}>
            <CheckIcon className=' w-6 h-6  text-green-600'></CheckIcon>
        </When>
      </div>
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
      
            <input onChange={(e)=>{setSearchKey(e.currentTarget.value)}} placeholder="search token" type="text"  className="bg-gray-50 border outline-none mb-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  >
            </input>
        </div>
<div>
<If condition={tokenisLoading}>
 <Then>
 <Skeleton count={10} /> 
 </Then>
 <Else>
 <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700 max-h-[300px]">
 <List data={tokenListEth} height={300} itemHeight={30} itemKey="id">
  {TokenItem => <li key={TokenItem.address} onClick={()=>{selectToken(TokenItem)}}   className="pb-3 pt-2 sm:pb-4 cursor-pointer hover:bg-slate-50">
    <div className="flex items-center space-x-4 ">
       <div className="flex-shrink-0">
          <img className="w-6 h-6 rounded-full" src={TokenItem.logoURI} >
          </img>
       </div>
       <div className="flex-1 min-w-0 group">
          <p className="font-medium text-md text-gray-900 truncate dark:text-white">
          {TokenItem.symbol}
          </p>
          <p className="text-sm transition ease-in-out   block group-hover:hidden  text-gray-500 truncate dark:text-gray-400">
          {TokenItem.name}
          </p>
          <p className="text-sm transition ease-in-out  hidden group-hover:block text-gray-500 truncate dark:text-gray-400">
          {TokenItem.address==""?TokenItem.name: cutOut(TokenItem.address,8,8)}
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
          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
          <When condition={currToken?.address==TokenItem.address}>
          <CheckIcon className=' w-6 h-6  text-green-600'></CheckIcon>
          </When>
          </p>
       </div>
    
    </div>
 </li>}
</List>

   

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