import React,{useState,FC,useMemo} from 'react';
import { ArrowDownIcon,ChevronDownIcon } from '@heroicons/react/24/solid'

import { useAppStore } from '../../state'
import SelectChainModal from '../selectChainModal'
import { When } from 'react-if';

const SelectPanel:FC<{dataType:boolean}> = ({dataType}) => {
    const fromChainInfo= useAppStore((state)=>state.fromChain) 
    const toChainInfo = useAppStore((state)=>state.toChain)
    const fromToken = useAppStore((state)=>state.fromToken)
    const toToken = useAppStore((state)=>state.toToken)
    const showToken= useMemo(()=>{
      if(dataType){
        return fromToken 
      }else{
        return toToken
      }
  
    },[fromToken,toToken,dataType])
    const [isFromOpen, setIsFromOpen] = useState<boolean>(false)
    const showInfo =dataType?fromChainInfo:toChainInfo;


    return (
        <>
         <div onClick={()=>{setIsFromOpen(true)}} className=" inline-flex  items-center  z-0 w-full   mb-6 group  p-2  cursor-pointer border   border-gray-200 rounded-md shadow-md hover:shadow-lg ">
        <img className=' w-8 h-8 mr-2' src={showInfo?.logoUrl}></img>
        <div className=' flex-1'>
        <div className='peer-focus:font-medium  text-sm text-gray-500  ' >
          {dataType?"From":"To"} 
         </div> 
         <div className='peer-focus:font-medium  text-sm text-gray-800   inline-flex items-center' >
          <span className=' mr-2'>{showInfo?.label}</span>    
          <ChevronDownIcon  className="h-4 w-4 text-blue-500  "></ChevronDownIcon>
 
         </div>  
        </div>
        <div className="flex flex-row w-1/2" >
          <When condition={showToken!==null}>
          <img className="w-8 h-8 mr-2" src={showToken?.logoURI}></img>
          </When>
        
         <div className='flex flex-col'>
         <span className='peer-focus:font-medium  text-sm text-gray-500'>{showToken?.name}</span>
         <span className='peer-focus:font-medium  text-sm text-gray-500'>{showToken?.symbol}</span>
         </div>
         
         </div>
        
          
        </div>
        <SelectChainModal isOpen={ isFromOpen} closeModal={()=>{setIsFromOpen (false)}}  dataType={dataType}   ></SelectChainModal>
        </>
       
    );
};

export default SelectPanel;