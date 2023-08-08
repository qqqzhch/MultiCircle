import { BigNumber, Contract, providers } from 'ethers'
import { RPC_URLS } from '../constants/networks';
import { useAppStore } from '../state';
export function useStaticJsonRpc(){
    const fromChainID = useAppStore((state)=>state.fromChainID)
    if(fromChainID==null){
        return
    }
    const rpc= RPC_URLS[fromChainID][0]
    const prcPro= new providers.StaticJsonRpcProvider(rpc)
    return prcPro

}