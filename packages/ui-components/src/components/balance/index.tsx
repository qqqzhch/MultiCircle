import React from 'react';
import useErc20Balance from '../../hooks/useErc20Balance'
import { formatUnitsErc20,  } from '../../utils'
import { Else, If, Then,When } from 'react-if'
import Skeleton from 'react-loading-skeleton'
import usdclogo from '../../assets/icon/usdc.png'
import { useAppStore } from '../../state';
import { useWeb3React } from '@web3-react/core';
import EthBalance from './EthBalance'
import Erc20Balance from './Erc20Balance'

const Balance = () => {
   
    const fromToken = useAppStore((state)=>state.fromToken)
    const usdcBalance=  useErc20Balance(fromToken?.address)
    const { library}= useWeb3React()



    return (
        <div className=' flex   flex-row  text-gray-500 items-center justify-end'>
        <div className=' flex flex-col mr-2 text-sm   text-gray-500'>
        <div>Balance</div>
        <If condition={fromToken?.address==""}>
          <Then>
          <EthBalance></EthBalance>
          </Then>
          <Else>
          <Erc20Balance></Erc20Balance>
          </Else>
        </If>
        
       
        </div>
        
        <img className=' w-10 h-10' src={fromToken?.logoURI||usdclogo}></img>
      </div>
    );
};

export default Balance;