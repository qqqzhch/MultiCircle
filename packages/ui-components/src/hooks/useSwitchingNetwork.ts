import { useWeb3React } from '@web3-react/core'


import {RPC_URLS} from '../constants/networks'
import switchEthereumChain from '../metamask/switchEthereumChain'
import {useAsyncFn} from 'react-use';
import { useAppStore } from '../state'
import { SupportedChainId } from '../constants/chains';
import {  getChainInfo } from '../constants/chainInfo';

export default function useSwitchingNetwork(){
    const { library,chainId } = useWeb3React()
     
    

    const [state,doSwitch] = useAsyncFn(async(fromChainID:SupportedChainId)=>{
        const unsupported =false;
         console.log('SwitchingNetwork')
         const network= getChainInfo(fromChainID)

        if(network&&library&&fromChainID!==null){
            await switchEthereumChain(fromChainID,network.label,RPC_URLS[fromChainID],library,unsupported)
        }
        
    },[library])
    return {
        state,
        doSwitch
    }

}