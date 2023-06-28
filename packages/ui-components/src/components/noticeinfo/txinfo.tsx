import React,{FC, useMemo} from 'react';
import {txItem} from '../../state/index'
import { getChainInfo } from '../../constants/chainInfo';
import { formatUnitsErc20,formatUnits } from '../../utils';
import dayjs from '../../utils/dayjs'
import useTxStatus from '../../hooks/useTxStatus';
import { Else, If, Then, When } from 'react-if';

//txItem
const Txinfo:FC<{Item:txItem}> = ({Item}) => {
    const fromChainInfo = getChainInfo(Item.fromChainID)
    const toChainInfo = getChainInfo(Item.toChainID)
    const status = useTxStatus(Item.txhash)

    //{"code":0,"data":{"attest":"done","mint":"done","scan":"done"}}
    const statusMint= useMemo(()=>{
        const statusText={
            text:"",
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
        }else{
            statusText.text="Waiting for scan "
        }
        return statusText

    },[status])
    return (
        <div  className="flex flex-col pb-3">
            <dt className="mb-1 text-gray-500 md:text-md dark:text-gray-400 mt-2">
                From: {fromChainInfo.label}, TO:{toChainInfo.label}  
            </dt>
            
            <dd className="text-md font-semibold">Amount:{formatUnitsErc20(Item.input,'usdc',6)}{" "}
            Fee:  {formatUnits(Item.fromChainID, Item.fee,true) }
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