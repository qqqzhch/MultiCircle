import React,{FC} from 'react';
import SelectChain from './SelectChain';
import SelectToken from './SelectToken';
import InputAndBalance from './InputAndBalance';
import ReceiveAmount from './ReceiveAmount';
import { Else, If, Then } from 'react-if';





type proteType={
  isFrom:boolean
}

const TokenSelectPanel:FC<proteType> = ({isFrom}) => {
    return (
        <div className="bg-valuerouter-layers-2 rounded   ">
            <div className="border-b-valuerouter-primary/10 flex items-center justify-between border-b px-3 py-2.5 sm:p-3">
              <div className="flex items-center space-x-2">
              
                <p className="text-valuerouter-secondary text-sm font-medium sm:text-base ">
                  {isFrom?"From":"To" }
                </p>
                <div className="relative">
                 <SelectToken isFrom={isFrom}></SelectToken>
                 
                </div>
                <p className="text-valuerouter-secondary text-sm font-medium sm:text-base">On</p>
                <div className="relative">
                 
                 <SelectChain isFrom={isFrom}></SelectChain>
                </div>
              </div>
            
            </div>
            <If condition={isFrom}>
              <Then>
               <InputAndBalance isFrom={isFrom}></InputAndBalance>
              </Then>
              <Else>
               <ReceiveAmount></ReceiveAmount>
              </Else>
            </If>
            
           
          </div>
    );
};

export default TokenSelectPanel