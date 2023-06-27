import React,{useCallback, useEffect, useMemo, useState} from 'react'
import SelectChainModal from '../selectChainModal'
import { ArrowDownIcon } from '@heroicons/react/24/solid'
import { useAppStore } from '../../state'
import useUSDCAddress from '../../hooks/useUsdc'
import useErc20Balance from '../../hooks/useErc20Balance'
import { useWeb3React } from '@web3-react/core'
import { formatUnitsErc20, validateAmount,formatUnits } from '../../utils'
import useErcCheckAllowance from '../../hooks/useCheckAllowance'
import { BigNumber, ethers } from 'ethers'
import { Else, If, Then,When } from 'react-if'
import useErc20Approve from '../../hooks/useApprove'
import useSwitchingNetwork from '../../hooks/useSwitchingNetwork'
import { useToasts } from 'react-toast-notifications'
import PreviewModal from '../preview'
import SwichNetwork from '../swichNetwork'
import useRelayerFee from '../../hooks/useRelayerFee'
import EventBus from '../../EventEmitter/index'
import usdclogo from '../../assets/icon/usdc.png'



const Swap = () => {
  const [isFromOpen, setIsFromOpen] = useState(false)
  const [isToOpen, setIsToOpen] = useState(false)
  const { account,chainId } = useWeb3React()
  const [inputAmount,setInputAmount]=useState("0")
  const [inputIsgtebalance,setInputIsgtebalance]=useState(false)
  const [isPreviewOpen, setPreviewOpen] = useState(false)

  const fromChainInfo= useAppStore((state)=>state.fromChain) 
  const toChainInfo = useAppStore((state)=>state.toChain)
  const fromChainID = useAppStore((state)=>state.fromChainID)
  const toChainID = useAppStore((state)=>state.toChainID)
  const setInput = useAppStore((state)=>state.setInput)


  const USDCAddress = useUSDCAddress()
  const usdcBalance=  useErc20Balance(account,USDCAddress)
  const RelayerFee = useRelayerFee()


  const inputAmountBigNum = useMemo(()=>{
    try {
      return   ethers.utils.parseUnits(inputAmount,6).toString();
     
    } catch (error) {
     console.log(error)      
    }
  return  '0'

  },[inputAmount])


  const ApproveUSDT = useErc20Approve()
 
  const {allowance}= useErcCheckAllowance(inputAmountBigNum)
  const switchingNetwork = useSwitchingNetwork()  
 
  const { addToast } = useToasts()

  const inputAmountChange= useCallback((value:string)=>{
    
    
    if(validateAmount(value)==undefined){
      
      setInputAmount(value)
      setInput(ethers.utils.parseUnits(value,6).toString())
    }
  },[])
  useEffect(()=>{
  if(usdcBalance.balance!=undefined){
    const inputAmount= BigNumber.from(inputAmountBigNum);
    const usdcBalanceamount= BigNumber.from(usdcBalance.balance);
    if(inputAmount.gt(usdcBalanceamount)){
      // addToast("The value entered is greater than the balance", { appearance: 'error' })
      setInputIsgtebalance(true)
      console.log('The value entered is greater than the balance')
    }else{
      setInputIsgtebalance(false)
    }
  }
    

  },[inputAmountBigNum,usdcBalance,addToast])

  const ValidateAmount = useCallback(()=>{
    const  num =BigNumber.from(inputAmountBigNum)
    if(usdcBalance.balance==undefined){
      return false
    }
    if(num.gt(0)&&num.lte(usdcBalance.balance)){
      setPreviewOpen(true)
      return true
    }else{
      return false
    }

  },[inputAmountBigNum,usdcBalance])

  const connectWallet = useCallback(() => {
    EventBus.emit('connectwallet')
  }, [])
  
  

  

  return (
    <div className=" text-left">
      <div>
        <div onClick={()=>{setIsFromOpen(true)}} className=" inline-flex  items-center  z-0 w-full   mb-6 group  p-2  cursor-pointer border   border-gray-300 rounded-md ">
        <img className=' w-8 mr-2' src={fromChainInfo?.logoUrl}></img>
        <div>
        <div className='peer-focus:font-medium  text-sm text-gray-500  ' >
          From 
         </div> 
         <div className='peer-focus:font-medium  text-sm text-gray-800   inline-flex items-center' >
         {fromChainInfo?.label}  
          <ArrowDownIcon  className="h-4 w-4 text-blue-500  "></ArrowDownIcon>
 
         </div> 
          
         
        </div>
        
          
        </div>
        <SwichNetwork></SwichNetwork>
        <div onClick={()=>{setIsToOpen(true)}} className=" inline-flex  items-center  z-0 w-full   mb-6 group   p-2  cursor-pointer border   border-gray-300 rounded-md">
        <img className=' w-8 mr-2' src={toChainInfo?.logoUrl}></img>
        <div>
        <div className='peer-focus:font-medium  text-sm text-gray-500  ' >
          To
         </div> 
         <div className='peer-focus:font-medium  text-sm text-gray-800   inline-flex items-center' >
         {toChainInfo?.label}  
          <ArrowDownIcon  className="h-4 w-4 text-blue-500  "></ArrowDownIcon>
 
         </div> 
          
         
        </div>
        </div>
        <div className="relative z-0 w-full mb-6 group  flex flex-row justify-between">
          <div className=' flex-1 '>
          <input
            type="text"
            name="input"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder="0"
            required
            onChange={(e)=>{inputAmountChange(e.currentTarget.value)}}
          />
          </div>
          <div className=' flex   flex-row  text-gray-500 items-center justify-end'>
            <div className=' flex flex-col mr-2 text-sm   text-gray-400'>
            <div>Balance</div>
            <div>{formatUnitsErc20(usdcBalance.balance,'',6)} </div>
            </div>
            
            <img className=' w-10 h-10' src={usdclogo}></img>
          </div>
          
          <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            input
          </label>
        </div>
        
        
        
       
        <div className="relative z-0 w-full  group  mb-14">
          
          <label className="peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
          You will receive: {" "}  {inputAmount} USDC
          </label>
        </div>
        <div className="relative z-0 w-full  group mb-20">
          
          <label className="peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
          Protocol Fee: {" "} {fromChainID!==null&&formatUnits(fromChainID,RelayerFee,true) } 
          </label>
        </div>
        <div className=' relative z-0 w-full mb-6 group flex mt-10'>
        <When condition={inputIsgtebalance}>
        <div className="p-4 mb-4 w-full text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
        The value entered is greater than the balance
            </div>
        </When>
        </div>
        <div className=' relative z-0 w-full mb-6 group flex mt-10'>
        
        <When condition={account!==undefined&&account!==null}>
        <If condition={allowance&&fromChainID==chainId&&fromChainID!==toChainID}>
         <Then>
          
          <When condition={ApproveUSDT.state.loading}>
          <button
          className="text-white flex-1  bg-red-400 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800  cursor-wait"
        >
         Approve loading  
        </button>

          </When>
          <When condition={ApproveUSDT.state.loading!==true}>
          <button
         onClick={ApproveUSDT.doFetch}
          className="text-white flex-1  bg-red-400 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
         Approve  
        </button>

          </When>
          

          
        

         </Then>
         <Else>
          <If condition={fromChainID==chainId&&fromChainID!==toChainID}>
            <Then>
            <button
            onClick={()=>{ValidateAmount()}}
          
          className="text-white flex-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
         Submit
        </button>

            </Then>
            <Else>

            <When condition={fromChainID!==toChainID}>
            <button
          onClick={switchingNetwork.doSwitch}
          className="text-white flex-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        > Switch to {fromChainInfo?.label}
        </button>

            </When>
            <When condition={fromChainID==toChainID}>
            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                  The source and target network cannot be the same network 
            </div>

            </When>
        
      

            </Else>

          </If>
         

         </Else>
        </If>
        </When>
        <When condition={account==undefined||account==null}>
        <button
         
        onClick={connectWallet}
        className="text-white flex-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
        Connect wallet
        </button>
        </When>
        


        </div>
      </div>
        <SelectChainModal isOpen={ isFromOpen} closeModal={()=>{setIsFromOpen (false)}}  dataType={true}   ></SelectChainModal>
        <SelectChainModal isOpen={ isToOpen} closeModal={()=>{setIsToOpen(false)}} dataType={false} ></SelectChainModal>
        <PreviewModal isOpen={isPreviewOpen} closeModal={()=>{setPreviewOpen(false)}}></PreviewModal>
    </div>
  )
}

export default Swap
