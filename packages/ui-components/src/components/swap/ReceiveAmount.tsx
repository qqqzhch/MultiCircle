import React from 'react';
import { useAppStore } from '../../state'
import { formatUnitsErc20,formatUnits} from '../../utils'

const ReceiveAmount = () => {
    const input = useAppStore((state)=>state.input)
    const toToken = useAppStore((state)=>state.toToken)
    if(toToken==undefined){
        return <></>
    }
    return (
        <div className="flex items-center mb-2">
          
            <label className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-300">
            You will receive: {" "}  {formatUnitsErc20(input,toToken?.symbol,toToken?.decimals)}
            </label>
        </div>
    );
};

export default ReceiveAmount;