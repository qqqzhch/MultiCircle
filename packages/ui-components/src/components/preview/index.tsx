import { FC, useCallback, useEffect, useMemo } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { useAppStore } from '../../state'
import { formatUnitsErc20, formatUnits, cutOut } from '../../utils'
import useRelayCall from '../../hooks/useRelayCall'
import { Else, If, Then } from 'react-if'
import useTxStatus from '../../hooks/useTxStatus'

import useAverageTime from '../../hooks/useAverageTime'
import SetepLoading from './StepperLoading'

import TokenAndChainInfo from './TokenAndChainInfo'
import useCusRecipientAddress from '../../hooks/useCusRecipientAddress'
import { useWeb3React } from '@web3-react/core'
import { ChevronDoubleRightIcon } from '@heroicons/react/24/solid'
// import EventEmitter from '../../EventEmitter/index'



interface componentprops {
  isOpen: boolean
  closeModal: () => void
}

const PreviewModal: FC<componentprops> = ({ isOpen, closeModal }) => {
  const fromChainInfo = useAppStore(state => state.fromChain)

  const fromChainID = useAppStore(state => state.fromChainID)

  const gasFee = useAppStore(state => state.gasFee)
  const fee = useAppStore(state => state.fee)
  const RelayCall = useRelayCall()
  const [txHash, setTxHash] = useState<string | null>(null)
  const status = useTxStatus(txHash)
  const [isTxLoading, setIsTxLoading] = useState(false)
  const AverageTime = useAverageTime(fromChainID)
  const [stepLoading, setStep] = useState(-1)

  const fromToken = useAppStore(state => state.fromToken)
  const toToken = useAppStore(state => state.toToken)
  // const setInput = useAppStore(state => state.setInput)

  const CusRecipientAddress = useCusRecipientAddress()
  const { account } = useWeb3React()

  useEffect(() => {
    if (isTxLoading) {
      // statusText.step=0
      // statusText.text='sending tx'
      setStep(0)
    } else if (status && status.data && status.data.data) {
      if (status.data.data.scan == undefined) {
        // statusText.text="Waiting for scan"
        // statusText.step=1
        setStep(1)
      } else if (status.data.data.attest == undefined) {
        // statusText.text="Waiting for attest"
        // statusText.step=2
        setStep(2)
      } else if (status.data.data.mint == undefined) {
        // statusText.text="Waiting for mint"
        // statusText.step=3
        setStep(3)
      } else if (status.data.data.mint == 'done') {
        // statusText.text="Success"
        // statusText.step=4
        setStep(4)
      }
    }
  }, [status, isTxLoading])

  const SubmitFN = useCallback(async () => {
    setIsTxLoading(true)
    try {
      // console.log('--')
      const { hash } = await RelayCall.doSwapFetch()
      setTxHash(hash)

      //eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (ex: any) {
      setTxHash(null)
    }
    setIsTxLoading(false)
    setStep(-1)
  }, [RelayCall, setTxHash, setIsTxLoading])

  // useEffect(()=>{
  //  if(statusMint.step==3){
  //   setIsTxLoading(false)
  //  }
  // },[statusMint,closeModal])

  const closeModalFn = useCallback(() => {
    setTxHash(null)
    closeModal()
    setStep(-1)
    // EventEmitter.emit('Refresh')
    // setInput('0')
  }, [closeModal, setTxHash])

  const RecipientAddress = useMemo(() => {
    return CusRecipientAddress || account
  }, [CusRecipientAddress, account])

  if (fromToken == null || toToken == null) {
    return <></>
  }

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
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Preview
                  </Dialog.Title>
                  <div className="mt-2">
                    <div className="w-full  lg:py-6 mb-6 lg:mb-0">
                      <div className=" flex  justify-around mb-2 items-center">
                        <TokenAndChainInfo isFrom={true}></TokenAndChainInfo>
                        <div>
                          <ChevronDoubleRightIcon className=' w-4 h-4'></ChevronDoubleRightIcon>
                        </div>
                        <TokenAndChainInfo isFrom={false}></TokenAndChainInfo>
                      </div>

                      <div className="flex border-t border-gray-200 py-2">
                        <span className="text-gray-500">Average time</span>
                        <span className="ml-auto text-gray-900">{AverageTime}</span>
                      </div>
                      <div className="flex border-t border-gray-200 py-2">
                        <span className="text-gray-500">Gas Fee</span>
                        <span className="ml-auto text-gray-900">{fromChainID && formatUnits(fromChainID, gasFee, true)}</span>
                      </div>
                      <div className="flex border-t border-gray-200 py-2">
                        <span className="text-gray-500">Recipient Address</span>
                        <span className="ml-auto text-gray-900">{RecipientAddress && cutOut(RecipientAddress, 6, 6)}</span>
                      </div>
                      {/* <div className="flex border-t border-b mb-6 border-gray-200 py-2">
                        <span className="text-gray-500">Protocol Fee</span>
                        <span className="ml-auto text-gray-900">
                          {formatUnitsErc20(fee, fromChainInfo?.nativeCurrency.symbol || '', fromChainInfo?.nativeCurrency.decimals || 18)}
                        </span>
                      </div> */}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col">
                    <If condition={stepLoading == -1}>
                      <Then>
                        <button
                          type="button"
                          className="px-6 py-3.5 inline-flex flex-1 justify-center rounded-md border border-transparent bg-blue-700  text-sm font-medium  text-white hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={SubmitFN}
                        >
                          Submit
                        </button>
                      </Then>
                      <Else>
                        <SetepLoading step={stepLoading}></SetepLoading>
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
