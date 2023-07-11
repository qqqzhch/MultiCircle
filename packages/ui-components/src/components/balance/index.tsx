import React from 'react';
import useErc20Balance from '../../hooks/useErc20Balance'
import { formatUnitsErc20,  } from '../../utils'
import { Else, If, Then,When } from 'react-if'
import Skeleton from 'react-loading-skeleton'
import usdclogo from '../../assets/icon/usdc.png'
import { useAppStore } from '../../state';


const Balance = () => {
    const usdcBalance=  useErc20Balance()
    const fromToken = useAppStore((state)=>state.fromToken)

    return (
        <div className=' flex   flex-row  text-gray-500 items-center justify-end'>
        <div className=' flex flex-col mr-2 text-sm   text-gray-500'>
        <div>Balance</div>
        <div>
          <When condition={usdcBalance.isloading}>
          <Skeleton /> 
          </When>
          <When condition={usdcBalance.isloading==false}>
          {formatUnitsErc20(usdcBalance.balance,'',fromToken?.decimals||6)}
          </When>
           
        </div>
        </div>
        
        <img className=' w-10 h-10' src={fromToken?.logoURI||usdclogo}></img>
      </div>
    );
};

export default Balance;