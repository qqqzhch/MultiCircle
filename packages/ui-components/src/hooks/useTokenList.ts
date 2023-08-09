import { SupportedChainId } from "../constants/chains";
// import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'
import { TokenList_Chainid,TokenList_Balance,uniswapTokenList } from "../constants/relayer";
import api from "../api/fetch";
import { useWeb3React } from '@web3-react/core'

import {Token,RootTokenList} from '../types/token'
import { getAddressBalances } from 'eth-balance-checker/lib/ethers';
import { RPC_URLS } from '../constants/networks';
import { BigNumber, providers } from 'ethers'
import { useMemo } from "react";
import useUSDCAddress from './useUsdc'
import { useAppStore } from '../state/index';



export default function useTokenList(dataType:boolean){



    const fromChainID = useAppStore((state)=>state.fromChainID)
    const toChainID = useAppStore((state)=>state.toChainID)
    const chainid = dataType?fromChainID:toChainID
 

    const { data, error, isLoading } = useSWRImmutable('tokenList',async()=>{
        // const tokenUrl = TokenList_Chainid[chainid]
        const tokenUrl = uniswapTokenList
        const res = await  api.get<RootTokenList>(tokenUrl)
        return res.tokens

    })
    const tokenList=useMemo(()=>{
       return  data?.filter(item=>item.chainId==chainid)
    },[chainid,data])
   



    return {
        data:tokenList, 
        error, 
        isLoading,
        // balanceList,
        // balanceError,
        // balanceisLoading
    }
}