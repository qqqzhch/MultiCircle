
import React, { useCallback } from 'react';
import { ArrowsUpDownIcon } from '@heroicons/react/24/solid'
import { useAppStore } from '../../state';
//arrows-up-down
const SwichNetwork = () => {
    const setFromOrTOChain = useAppStore((state)=>state.setFromOrTOChain)
    const fromChainID = useAppStore((state)=>state.fromChainID)
    const toChainID = useAppStore((state)=>state.toChainID)
    const fromChainInfo= useAppStore((state)=>state.fromChain) 
    const toChainInfo = useAppStore((state)=>state.toChain)

    const fromToken =  useAppStore((state)=>state.fromToken)
    const toToken =  useAppStore((state)=>state.toToken)
    const setToken =  useAppStore((state)=>state.setToken)

    const swichFN=useCallback(()=>{
        if(fromChainInfo&&toChainInfo&&fromChainID!==null&&toChainID!==null){

            setFromOrTOChain(fromChainInfo,false,fromChainID) //false to
            setFromOrTOChain(toChainInfo,true,toChainID)   //true from 
            setToken(false,fromToken)
            setToken(true,toToken)
        }
       

    },[fromChainID,toChainID,fromChainInfo,toChainInfo,setFromOrTOChain,fromToken,toToken,setToken])

  
    return (
       <div className=' flex  w-full justify-center  mb-5'>
        <div onClick={swichFN} className='  w-12 h-12 hover:bg-blue-200 cursor-pointer rounded-md flex'>
            <ArrowsUpDownIcon className="h-6 w-6 text-blue-500 m-auto"></ArrowsUpDownIcon>
        </div>
       </div>
        
    );
};

export default SwichNetwork;