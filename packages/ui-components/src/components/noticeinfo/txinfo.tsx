import React,{FC, useMemo} from 'react';
import {txItem} from '../../state/index'
import { getChainInfo } from '../../constants/chainInfo';
import { formatUnitsErc20,formatUnits, cutOut } from '../../utils';
import dayjs from '../../utils/dayjs'
import useTxStatus from '../../hooks/useTxStatus';
import { Else, If, Then, When } from 'react-if';
import ScanUrl from '../linkAndCopy/ScanUrl';
import CopyAddressBtn from '../linkAndCopy/CopyAddressBtn';


//txItem
const Txinfo:FC<{Item:txItem}> = ({Item}) => {
    const fromChainInfo = getChainInfo(Item.fromChainID)
    const toChainInfo = getChainInfo(Item.toChainID)
    const status = useTxStatus(Item.txhash)

    //{"code":0,"data":{"attest":"done","mint":"done","scan":"done"}}
    const statusMint= useMemo(()=>{
        const statusText={
            text:"Waiting for scan",
            step:0
        }
        if(status&&status.data&&status.data.data){
            if(status.data.data.scan=="done"){
                statusText.text="Waiting for attest"
                statusText.step=1
            }
            if(status.data.data.attest=="done"){
                statusText.text="Waiting for mint"
                statusText.step=2
            }
            if(status.data.data.mint=="done"){
                statusText.text="Success"
                statusText.step=3
            }
        }
        return statusText

    },[status])
    return (
        <div  className="flex flex-col pb-3 mt-2 pt-2">
            <dt className="mb-1 text-gray-500 md:text-md dark:text-gray-400  flex flex-row justify-between items-center">
                <span> <span className=' inline-block w-12'>From:</span> {fromChainInfo.label}</span>
                <dt className=" w-1/2  text-gray-500 md:text-md dark:text-gray-400  inline-flex items-center space-x-3">
                    Tx Hash:  {cutOut(Item.txhash,2,2)} <ScanUrl addr={Item.txhash} chainId={Item.fromChainID}></ScanUrl>   <CopyAddressBtn addr={Item.txhash}></CopyAddressBtn>
                </dt>
            </dt>
            <dt className="mb-1 text-gray-500 md:text-md dark:text-gray-400 ">
            <span className=' inline-block w-12'>To:</span>{toChainInfo.label}  
            </dt>
            
            <dd className="mb-1 text-md font-semibold flex flex-row justify-between items-center">
           <span className='w-1/2'>Input :{formatUnitsErc20(Item.input,Item.fromToken.symbol,Item.fromToken.decimals)}{" "} </span> 
           <span className='w-1/2'>Output:  {formatUnitsErc20(Item.output,Item.toToken.symbol,Item.toToken.decimals)}</span> 
            </dd>
            <dt className="mb-1 text-gray-500 md:text-md dark:text-gray-400">
                Time: {dayjs(Item.creattime).fromNow()}  
            </dt>
            <dt className="mb-1 text-gray-500 md:text-md dark:text-gray-400">
            State:
                <If condition={status.isLoading}>
                    <Then>
                        <span>Loading</span>
                    </Then>
                    <Else>
                        <When condition={statusMint.step==3}>
                        <span className=' text-green-600'>Success</span>
                        </When>
                        <When condition={statusMint.step!=3}>
                        <span className=' text-yellow-400'>{statusMint.text}</span>
                        </When>
                    
                    </Else>
                </If>
                
                 
            </dt>
            
        </div>
    );
};

export default Txinfo;