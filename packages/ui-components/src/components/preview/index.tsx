import React, { FC, useCallback,useEffect,useMemo } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { useAppStore } from '../../state'
import { formatUnitsErc20 } from '../../utils'
import useRelayCall from '../../hooks/useRelayCall'
import { Else, If, Then, When } from 'react-if'
import useTxStatus from '../../hooks/useTxStatus';
import Loading from '../loading'


interface componentprops {
  isOpen: boolean
  closeModal: () => void
}

const PreviewModal: FC<componentprops> = ({ isOpen, closeModal }) => {
    const fromChainInfo= useAppStore((state)=>state.fromChain) 
    const toChainInfo = useAppStore((state)=>state.toChain)
    const fromChainID = useAppStore((state)=>state.fromChainID)
    const toChainID = useAppStore((state)=>state.toChainID)
    const input = useAppStore((state)=>state.input)
    const output = useAppStore((state)=>state.output)
    const fee = useAppStore((state)=>state.fee)
    const RelayCall =useRelayCall()
    const [txHash,setTxHash]= useState<string|null>(null)
    const status = useTxStatus(txHash)
    const [isTxLoading,setIsTxLoading]=useState(false)
    const statusMint= useMemo(()=>{
      const statusText={
          text:"Waiting for scan",
          step:0,
          isloading:status.isLoading
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



    const SubmitFN = useCallback(async ()=>{
    setIsTxLoading(true)
    try {
      const {hash} =  await RelayCall.doFetch()
      setTxHash(hash)    
    } catch (ex:any) {
      setTxHash(null)
      setIsTxLoading(false)
    }
  

    },[RelayCall,setTxHash,setIsTxLoading])

    useEffect(()=>{
     if(statusMint.step==3){
      setIsTxLoading(false)
     }
    },[statusMint,closeModal])

    const closeModalFn= useCallback(()=>{
      setTxHash(null)
      closeModal()
      setIsTxLoading(false)
    },[closeModal,setTxHash])

  console.log('- -')

    return (
    <div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModalFn}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Preview
                  </Dialog.Title>
                  <div className="mt-2">
                  <div className="w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
     
     
     <div className="flex border-t border-gray-200 py-2">
       <span className="text-gray-500">FROM</span>
       <span className="ml-auto text-gray-900">{fromChainInfo?.label}</span>
     </div>
     <div className="flex border-t border-gray-200 py-2">
       <span className="text-gray-500">TO</span>
       <span className="ml-auto text-gray-900">{toChainInfo?.label}</span>
     </div>
     <div className="flex border-t border-gray-200 py-2">
       <span className="text-gray-500">AMOUNT</span>
       <span className="ml-auto text-gray-900">{formatUnitsErc20(input,'usdc',6)}</span>
     </div>
     <div className="flex border-t border-gray-200 py-2">
       <span className="text-gray-500 uppercase">You will receive</span>
       <span className="ml-auto text-gray-900">{formatUnitsErc20(input,'usdc',6)}</span>
     </div>
     <div className="flex border-t border-b mb-6 border-gray-200 py-2">
       <span className="text-gray-500">Protocol Fee</span>
       <span className="ml-auto text-gray-900">{formatUnitsErc20(fee ,fromChainInfo?.nativeCurrency.symbol||"",fromChainInfo?.nativeCurrency.decimals||18)}</span>
     </div>
  
   
   </div>
                  </div>

                  <div className="mt-4 flex flex-col">
                  <When condition={statusMint.step==3}>
                    <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                        <span className="font-medium">Success </span> 
                    </div>
                  </When>
                  <When condition={statusMint.step!==3}>

                    <If condition={isTxLoading}>
                      <Then>
                      <button
                      type="button"
                      className="inline-flex flex-1 justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium  text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                     
                    >
                     <Loading></Loading>
                     Verfying...{statusMint.text}
                    </button>

                      </Then>
                      <Else>
                      <button
                      type="button"
                      className="inline-flex flex-1 justify-center rounded-md border border-transparent bg-blue-700 px-4 py-2 text-sm font-medium  text-white hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                     onClick={SubmitFN}
                    >
                  
                     Submit
                    </button>
                    

                      </Else>
                    </If>
                  </When>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default PreviewModal
