import React,{FC,useState,useMemo,useCallback} from 'react';
import Balance from './Balance';
import useErc20Balance from '../../hooks/useErc20Balance'
import { useAppStore } from '../../state'
import { formatUnitsErc20, validateAmount,formatUnits } from '../../utils'
import { BigNumber, ethers } from 'ethers'
import { useDebounce } from 'react-use'
import useEthBalance from '../../hooks/useEthBalance';

type proteType={
  isFrom:boolean
}

const InputAndBalance:FC<proteType> = ({isFrom}) => {
  const fromToken = useAppStore((state)=>state.fromToken)
  const usdcBalance=  useErc20Balance(fromToken?.address)
  const ethBalance = useEthBalance()

  const [inputError,setinputError]=useState<string|undefined>()
  const setInput = useAppStore((state)=>state.setInput)
  const input = useAppStore((state)=>state.input)

  const inputAmount= useMemo(()=>{
    const valueHaveUnits=ethers.utils.formatUnits(input,fromToken?.decimals).toString()
    return valueHaveUnits

  },[input,fromToken])

  const [inputValue,setInputValue]=useState(inputAmount)

  useDebounce(()=>{
      
      const valueHaveUnits=ethers.utils.parseUnits(inputValue,fromToken?.decimals).toString()
      if(inputError==undefined){
        setInput(valueHaveUnits)
      }
      

    },300,[inputValue,inputError,fromToken])

  const inputAmountChange = useCallback((value:string)=>{
      console.log('inputAmountChange')
      // startTransition(()=>{
        setInputValue(value)

        const error=validateAmount(value)
        setinputError(undefined)
        if(error==undefined){
        
        
  
          const valueHaveUnits=ethers.utils.parseUnits(value,fromToken?.decimals).toString()
          if(usdcBalance.balance!=undefined&&fromToken?.address!==""){
            const inputAmount= BigNumber.from(valueHaveUnits);
            const usdcBalanceamount= BigNumber.from(usdcBalance.balance);
  
            if(inputAmount.gt(usdcBalanceamount)){ 
              setinputError('The value entered is greater than the balance')
            }

          }else if(ethBalance.balance!==undefined&&fromToken?.address==""){
            const inputAmount= BigNumber.from(valueHaveUnits);
            const ethBalanceamount= BigNumber.from(ethBalance.balance);
  
            if(inputAmount.gt(ethBalanceamount)){ 
              setinputError('The value entered is greater than the balance')
            }
          }
          
        }else{
          setinputError(error)
        
        }
      // })
      
    },[fromToken,setinputError,usdcBalance,setInputValue,ethBalance])

    return (
        <div className="flex items-center justify-between px-3 py-[14px] sm:py-4">
        <div className="relative flex w-full items-center overflow-hidden">
          <input
            type="number"
            className="skt-w skt-w-input text-valuerouter-primary w-full min-w-full max-w-[180px] bg-transparent pt-0.5 text-lg font-bold focus:max-w-none focus-visible:outline-none sm:max-w-full sm:text-xl"
            placeholder={'0.0'}
            spellCheck="false"
            disabled={!isFrom}
            value={inputValue}
            onChange={(e)=>{inputAmountChange(e.currentTarget.value)}}
          />
          <div className="invisible absolute w-fit text-xl font-bold" />
        </div>
        <Balance isFrom={isFrom}></Balance>
      </div>
    );
};

export default InputAndBalance;