import React from 'react';
import useErc20Balance from '../../hooks/useErc20Balance'
import { formatUnitsErc20,  } from '../../utils'
import { Else, If, Then,When } from 'react-if'
import Skeleton from 'react-loading-skeleton'
import usdclogo from '../../assets/icon/usdc.png'
import { useAppStore } from '../../state';
import { useWeb3React } from '@web3-react/core';


const Balance = () => {
   
    const fromToken = useAppStore((state)=>state.fromToken)
    const usdcBalance=  useErc20Balance(fromToken?.address)
    
    
    if(fromToken==null)
    return <></>

    return (
        <div>
        <When condition={usdcBalance.isloading}>
        <Skeleton /> 
        </When>
        <When condition={usdcBalance.isloading==false}>
        {formatUnitsErc20(usdcBalance.balance,'',fromToken.decimals)}
        </When>
         
      </div>
    );
};

export default Balance;