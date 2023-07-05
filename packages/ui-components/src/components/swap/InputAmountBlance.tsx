import React,{useCallback,useState} from 'react';
import Balance from '../balance'
import useErc20Balance from '../../hooks/useErc20Balance'
import { useAppStore } from '../../state'
import { formatUnitsErc20, validateAmount,formatUnits } from '../../utils'
import { BigNumber, ethers } from 'ethers'
import { useDebounce } from 'react-use'

const InputAmountBlance = () => {
    const usdcBalance=  useErc20Balance()
    const [inputValue,setInputValue]=useState("0")
    const [inputError,setinputError]=useState<string|undefined>()
    const setInput = useAppStore((state)=>state.setInput)

    useDebounce(()=>{
        const valueHaveUnits=ethers.utils.parseUnits(inputValue,6).toString()
        setInput(valueHaveUnits)
      },1000,[inputValue])

    const inputAmountChange = useCallback((value:string)=>{
        console.log('inputAmountChange')
        // startTransition(()=>{
   
          const error=validateAmount(value)
          setinputError(undefined)
          if(error==undefined){
          
          
    
            const valueHaveUnits=ethers.utils.parseUnits(value,6).toString()
            if(usdcBalance.balance!=undefined){
              const inputAmount= BigNumber.from(valueHaveUnits);
              const usdcBalanceamount= BigNumber.from(usdcBalance.balance);
    
              if(inputAmount.gt(usdcBalanceamount)){ 
                setinputError('The value entered is greater than the balance')
              }
            }
            setInputValue(value)
           
    
            
          }else{
            setinputError(error)
            setInput("0")
            setInputValue("0")
          }
        // })
        
      },[setInput,setinputError,usdcBalance,setInputValue])


    return (
        <div className="z-0 w-full mb-6   ">
          <div className=' flex flex-row justify-between space-x-2'>

          
          <div className=' flex-1 '>
          <input
            type="text"
            name="input"
            className="bg-gray-50 border  outline-none  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="0.0"
     
         
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