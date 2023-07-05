import React from 'react';
import useRelayerFee from '../../hooks/useRelayerFee'
import { Else, If, Then,When } from 'react-if'
import Skeleton from 'react-loading-skeleton'
import { useAppStore } from '../../state'
import { formatUnits} from '../../utils'

const ProtocolFee = () => {
    const RelayerFee = useRelayerFee()
    const fromChainID = useAppStore((state)=>state.fromChainID)

    return (
        <div className="flex items-center mb-2">
          <div className='ml-2 text-sm font-medium text-gray-500 dark:text-gray-300'>Protocol Fee:</div>  
          <div className=' min-w-[50px] ml-2 text-sm font-medium text-gray-500 dark:text-gray-300'>
             
          <If condition={RelayerFee.isloading}>
            <Then>
            <Skeleton /> 
            </Then>
            <Else>
            {fromChainID!==null&&formatUnits(fromChainID,RelayerFee.fee,true)}
           
            </Else>
          </If>
          </div>   
   
        </div>
    );
};

export default ProtocolFee;