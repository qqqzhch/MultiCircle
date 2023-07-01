
import {getChainInfo} from '../constants/chainInfo'
import { SupportedChainId } from '../constants/chains';
import {FALLBACK_URLS} from '../constants/networks'
//getChainInfo

export default async function(chainId:number,chainName:string,rpcUrls:Array<string>,library:any,Unsupported:boolean){
     
    let libraryprovider;
    if(library!==undefined){
      libraryprovider =library.provider
    }else{
      libraryprovider =window.ethereum 
    }

    const  nativeCurrency=getChainInfo(chainId)?.nativeCurrency;
    const  explorer=getChainInfo(chainId)?.explorer;
    const rpclist = FALLBACK_URLS[chainId as SupportedChainId];
    const hexchainId = "0x"+chainId.toString(16);
    
    try {
        if(libraryprovider.request){
            await libraryprovider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: hexchainId }],
              });

        }
        
      } catch (switchError:any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
              if(libraryprovider.request){
                await libraryprovider.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                      {
                        chainId: hexchainId,
                        chainName: chainName,
                        rpcUrls: rpclist /* ... */,
                        nativeCurrency:nativeCurrency,
                        blockExplorerUrls:[explorer]
                      },
                    ],
                  });

              }
            
          } catch (addError) {
            // handle "add" error
          }
        }else{
          console.error(switchError)
        }
        // handle other "switch" errors
      }
     
      
}