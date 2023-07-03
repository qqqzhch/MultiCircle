import React,{useState,FC} from 'react';
import { ArrowDownIcon,ChevronDownIcon } from '@heroicons/react/24/solid'

import { useAppStore } from '../../state'
import SelectChainModal from '../selectChainModal'

const SelectPanel:FC<{dataType:boolean}> = ({dataType}) => {
    const fromChainInfo= useAppStore((state)=>state.fromChain) 
    const toChainInfo = useAppStore((state)=>state.toChain)
    const [isFromOpen, setIsFromOpen] = useState(false)
    const showInfo =dataType?fromChainInfo:toChainInfo;


    return (
        <>
         <div onClick={()=>{setIsFromOpen(true)}} className=" inline-flex  items-center  z-0 w-full   mb-6 group  p-2  cursor-pointer border   border-gray-200 rounded-md shadow-md hover:shadow-lg ">
        <img className=' w-8 mr-2' src={showInfo?.logoUrl}></img>
        <div>
        <div className='peer-focus:font-medium  text-sm text-gray-500  ' >
          {dataType?"From":"To"} 
         </div> 
         <div className='peer-focus:font-medium  text-sm text-gray-800   inline-flex items-center' >
          <span className=' mr-2'>{showInfo?.label}</span>    
          <ChevronDownIcon  className="h-4 w-4 text-blue-500  "></ChevronDownIcon>
 
         </div> 
          
         
        </div>
        
          
        </div>
        <SelectChainModal isOpen={ isFromOpen} closeModal={()=>{setIsFromOpen (false)}}  dataType={dataType}   ></SelectChainModal>
        </>
       
    );
};

export default SelectPanel;