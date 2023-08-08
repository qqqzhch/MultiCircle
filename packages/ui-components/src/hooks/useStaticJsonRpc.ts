import { BigNumber, Contract, providers } from 'ethers'
import { RPC_URLS } from '../constants/networks';
import { useAppStore } from '../state';
import { SupportedChainId } from '../constants/chains'

export function useStaticJsonRpc(toChainID?:SupportedChainId | null){
    const fromChainID = useAppStore((state)=>state.fromChainID)
    const ID=toChainID||fromChainID
    if(ID==null){
        return
    }
    const rpc= RPC_URLS[ID][0]
    const prcPro= new providers.StaticJsonRpcProvider(rpc)
    return prcPro

}