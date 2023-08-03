import React from 'react';
import useSwitchingNetwork from '../../hooks/useSwitchingNetwork'
import { useAppStore } from '../../state'
import { useWeb3React } from '@web3-react/core'

const ProtecteNetwork = ({ children, className }: { children: JSX.Element; className?: string }) => {
    const fromChainID = useAppStore((state)=>state.fromChainID)
    const toChainID = useAppStore((state)=>state.toChainID)
    const switchingNetwork = useSwitchingNetwork()
    const fromChainInfo= useAppStore((state)=>state.fromChain)
    const {chainId}=useWeb3React()
    const fromToken= useAppStore((state)=>state.fromToken)
    const toToken= useAppStore((state)=>state.toToken)

    if(toToken?.address==fromToken?.address&&fromChainID==toChainID){
        return (<button
            disabled
            className="px-6 py-3.5 text-white flex-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto  text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          > The tokens cannot be the same
          </button>)
    } 

    if(fromChainID!==chainId){
        return (
            <button
            onClick={()=>{if(fromChainID!==null){switchingNetwork.doSwitch(fromChainID)}}}
            className="px-6 py-3.5 text-white flex-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto  text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          > Switch to {fromChainInfo?.label}
          </button>
        );
    }

    return children
    
};

export default ProtecteNetwork;