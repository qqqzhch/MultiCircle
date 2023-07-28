import React,{useCallback,useMemo,useState} from 'react';
import Balance from '../balance'
import useErc20Balance from '../../hooks/useErc20Balance'
import { useAppStore } from '../../state'
import { formatUnitsErc20, validateAmount,formatUnits } from '../../utils'
import { BigNumber, ethers } from 'ethers'
import { useDebounce } from 'react-use'
import useEthBalance from '../../hooks/useEthBalance';


const InputAmountBlance = () => {
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
        

      },1000,[inputValue,inputError,fromToken])

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
        <div className="z-0 w-full mb-6   ">
          <div className=' flex flex-row justify-between space-x-2'>

          
          <div className=' flex-1 '>
          <input
            type="text"
            name="input"
            className="bg-gray-50 border  outline-none  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="0.0"
       
            value={inputValue}
            onChange={(e)=>{inputAmountChange(e.currentTarget.value)}}
          />
         
          </div>
          <Balance></Balance>

          </div>
          {/* <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            input
          </label> */}
           <p className=' mt-2 text-sm text-red-600 dark:text-red-500 '>{inputError}  </p>
        </div>
    );
};

export default InputAmountBlance;