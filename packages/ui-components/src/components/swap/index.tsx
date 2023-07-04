import React,{useCallback, useEffect, useMemo, useState, useTransition} from 'react'
import SelectChainModal from '../selectChainModal'
import { ArrowDownIcon,ChevronDownIcon } from '@heroicons/react/24/solid'
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
import { USECHAIN_IDS } from '../../constants/chains'
import Skeleton from 'react-loading-skeleton'
import useRelayCallGasFee from '../../hooks/useRelayCallGasFee'
import { useDebounce } from 'react-use'
import Balance from '../balance'
import ReceiveAmount from './ReceiveAmount'
import ProtocolFee from './ProtocolFee'
import GasFee from './GasFee'









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
  const inputNumer = useAppStore((state)=>state.input)


  const USDCAddress = useUSDCAddress()
  const usdcBalance=  useErc20Balance()
  const RelayerFee = useRelayerFee()
  const [isPending, startTransition] = useTransition();
  const [inputError,setinputError]=useState<string|undefined>()
  const {gasFee,gasFeeLoading} = useRelayCallGasFee()


  const inputAmountBigNum = useMemo(()=>{
    // try {
    //   return   ethers.utils.parseUnits(inputAmount,6).toString();
     
    // } catch (error) {
    //  console.log(error)      
    // }
  return  inputNumer

  },[inputNumer])



  const ApproveUSDT = useErc20Approve()
 
  const checkAllowance= useErcCheckAllowance()

  const allowance = useMemo(()=>{
    return  checkAllowance(inputNumer)
  },[checkAllowance,inputNumer])
  
  const switchingNetwork = useSwitchingNetwork()

 
  const { addToast } = useToasts()
  
  useDebounce(()=>{
    const valueHaveUnits=ethers.utils.parseUnits(inputAmount,6).toString()
    setInput(valueHaveUnits)
  },1000,[inputAmount])

  const inputAmountChange = useCallback((value:string)=>{
    console.log('inputAmountChange')
    // startTransition(()=>{
    if(inputAmount==''){
      return
    }
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
        setInputAmount(value)
       

        
      }else{
        setinputError(error)
        setInput("0")
        setInputAmount("0")
      }
    // })
    
  },[setInput,setinputError,usdcBalance,inputAmount,setInputAmount])




  const ValidateAmountFN = useCallback(()=>{

    if(fromChainID==null||toChainID==null|| USECHAIN_IDS.includes(fromChainID)==false||USECHAIN_IDS.includes(toChainID)==false){
      addToast("Please check the network", { appearance: 'error' })
      return false
    }
    const  num =BigNumber.from(inputAmountBigNum)
    if(usdcBalance.balance==undefined){
      addToast("Please check the balance", { appearance: 'error' })
      return false
    }
    if(num.gt(0)&&num.lte(usdcBalance.balance)){
      setPreviewOpen(true)
      return true
    }else{
      addToast("Please check the values entered", { appearance: 'error' })
      return false
    }

  },[inputAmountBigNum,usdcBalance,addToast,fromChainID,toChainID])

  const connectWallet = useCallback(() => {
    EventBus.emit('connectwallet')
  }, [])

  const closePreModel= useCallback(()=>{
    console.log('closePreModel')
    setPreviewOpen(false)
  },[setPreviewOpen])
  
  

  

  return (
    <div className=" text-left">
      <div>
        <div onClick={()=>{setIsFromOpen(true)}} className=" inline-flex  items-center  z-0 w-full   mb-6 group  p-2  cursor-pointer border   border-gray-200 rounded-md shadow-md hover:shadow-lg ">
        <img className=' w-8 mr-2' src={fromChainInfo?.logoUrl}></img>
        <div>
        <div className='peer-focus:font-medium  text-sm text-gray-500  ' >
          From 
         </div> 
         <div className='peer-focus:font-medium  text-sm text-gray-800   inline-flex items-center' >
         {fromChainInfo?.label}  
          <ChevronDownIcon  className="h-4 w-4 text-blue-500  "></ChevronDownIcon>
 
         </div> 
          
         
        </div>
        
          
        </div>
        <SwichNetwork></SwichNetwork>
        <div onClick={()=>{setIsToOpen(true)}} className=" inline-flex  items-center  z-0 w-full   mb-6 group   p-2  cursor-pointer border   border-gray-200 rounded-md shadow-md hover:shadow-lg ">
        <img className=' w-8 mr-2' src={toChainInfo?.logoUrl}></img>
        <div>
        <div className='peer-focus:font-medium  text-sm text-gray-500  ' >
          To
         </div> 
         <div className='peer-focus:font-medium  text-sm text-gray-800   inline-flex items-center' >
         {toChainInfo?.label}  
          <ChevronDownIcon  className="h-4 w-4 text-blue-500  "></ChevronDownIcon>
 
         </div> 
          
         
        </div>
        </div>
        <div className="z-0 w-full mb-6  ">
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
           <p className='mt-2 text-sm text-red-600 dark:text-red-500'>{inputError}</p>
        </div>
       
        
        

        <ReceiveAmount></ReceiveAmount>
        <ProtocolFee></ProtocolFee>
        <GasFee></GasFee>
        
  
        
       
        <div className=' relative z-0 w-full mb-6 group flex mt-10'>
        
        <When condition={account!==undefined&&account!==null}>
        <If condition={allowance==false&&fromChainID==chainId&&fromChainID!==toChainID}>
         <Then>
          
          <When condition={ApproveUSDT.state.loading&&inputAmountBigNum!=="0"}>
          <button
          className="text-white flex-1  bg-red-400 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800  cursor-wait"
        >
         Approve loading  
        </button>

          </When>
          <When condition={ApproveUSDT.state.loading!==true&&inputAmountBigNum!=='0'}>
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
            onClick={()=>{ValidateAmountFN()}}
          
          className="text-white flex-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
         Review
        </button>

            </Then>
            <Else>

            <When condition={fromChainID!==toChainID}>
            <button
          onClick={()=>{if(fromChainID!==null){switchingNetwork.doSwitch(fromChainID)}}}
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
        <PreviewModal isOpen={isPreviewOpen} closeModal={closePreModel}></PreviewModal>
    </div>
  )
}

export default Swap
