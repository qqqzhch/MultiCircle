import React, { FC, useCallback } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { useAppStore } from '../../state'
import { formatUnitsErc20 } from '../../utils'
import useRelayCall from '../../hooks/useRelayCall'
import { Else, If, Then, When } from 'react-if'


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

    const SubmitFN = useCallback(async ()=>{
     await RelayCall.doFetch()
     closeModal()
    },[RelayCall,closeModal])



    return (
    <div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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

                  <div className="mt-4 flex">
                    <If condition={RelayCall.state.loading}>
                      <Then>
                      <button
                      type="button"
                      className="inline-flex flex-1 justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium  text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                     
                    >
                     loading
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
