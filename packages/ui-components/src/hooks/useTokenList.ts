import { SupportedChainId } from "../constants/chains";
import useSWR from 'swr'
import { TokenList_Chainid,TokenList_Balance } from "../constants/relayer";
import api from "../api/fetch";
import { useWeb3React } from '@web3-react/core'

import {Token,RootTokenList} from '../types/token'
import { getAddressBalances } from 'eth-balance-checker/lib/ethers';
import { RPC_URLS } from '../constants/networks';
import { BigNumber, providers } from 'ethers'
import { useMemo } from "react";



export default function useTokenList(chainid:SupportedChainId|null){
    const { library,account } = useWeb3React()   
    console.log('=== useTokenList')
    
    const { data, error, isLoading } = useSWR(chainid!==null?[chainid,'tokenList']:null,async([chainid])=>{
        const tokenUrl = TokenList_Chainid[chainid]
        if(tokenUrl!==""){
            const res = await  api.get<RootTokenList>(tokenUrl)
            return res.tokens
        }else{
            return new Array<Token>()
        }
        

    })
    const { data:balanceList, error:balanceError, isLoading:balanceisLoading } =useSWR(account?[account,chainid]:null,async([account,chainid])=>{
        if(chainid==null||data==undefined){
            return undefined
        }
        const rpc= RPC_URLS[chainid][0]
        const prcPro= new providers.JsonRpcProvider(rpc)
        const tokanAddressList=data.map((item)=>{
            return item.address
        })
        // const tokanAddress=['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48']
       const contractAddress=TokenList_Balance[chainid]
       const resultbalance = await getAddressBalances(prcPro, account, tokanAddressList, {
        contractAddress: contractAddress
      })
       return resultbalance

    })
    useMemo(()=>{
        if(data==undefined||balanceList==undefined){
            return undefined
        }
       
       data.forEach((item)=>{
        item.balance=balanceList[item.address.toLowerCase()]
        
        })

        data.sort((a,b)=>{
           if(BigNumber.from(a.balance).gt( BigNumber.from(b.balance))){
             return -1
           }
           if(BigNumber.from(a.balance).lt( BigNumber.from(b.balance))){
            return 1
          }
      
            return 0
          
        })

        return data

    },[data,balanceList])



    return {
        data:data, 
        error, 
        isLoading,
        balanceList,
        balanceError,
        balanceisLoading
    }
}