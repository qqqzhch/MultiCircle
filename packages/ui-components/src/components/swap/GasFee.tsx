import React from 'react';
import useRelayCallSwapGasFee from '../../hooks/useRelayCallGasFee'
import { Else, If, Then,When } from 'react-if'
import Skeleton from 'react-loading-skeleton'
import { useAppStore } from '../../state'
import { formatUnits} from '../../utils'


const GasFee = () => {
    const {gasFeeLoading} = useRelayCallSwapGasFee()
    const fromChainID = useAppStore((state)=>state.fromChainID)
    const gasFee = useAppStore((state)=>state.gasFee)

    return (
        <div className="flex items-center mb-2">
        <div className='ml-2 text-sm font-medium text-gray-500 dark:text-gray-300'>Gas Fee:</div>  
          <div className='  min-w-[50px] ml-2 text-sm font-medium text-gray-500 dark:text-gray-300'>
             
          <If condition={gasFeeLoading}>
            <Then>
            <Skeleton /> 
            </Then>
            <Else>
            {fromChainID!==null&&formatUnits(fromChainID,gasFee,true)}
           
            </Else>
          </If>
          </div>   
          <div className=" flex flex-row peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
        
       
          </div>
        </div>
    );
};

export default GasFee;