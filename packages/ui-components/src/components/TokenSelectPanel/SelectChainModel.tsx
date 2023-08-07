import React, { useMemo, useEffect, useCallback, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, FC } from 'react'
import { Else, If, Then, When } from 'react-if'
import { SupportedChainId, TESTNET_CHAIN_IDS, USECHAIN_IDS } from '../../constants/chains'
import { L1ChainInfo, L2ChainInfo, getChainInfo } from '../../constants/chainInfo'
import { useAppStore } from '../../state'
import useSwitchingNetwork from '../../hooks/useSwitchingNetwork'
import useTokenList from '../../hooks/useTokenList'
import Skeleton from 'react-loading-skeleton'
import { Token } from '../../types/token'
import { CheckIcon } from '@heroicons/react/24/solid'
import List from 'rc-virtual-list'

interface componentprops {
  isOpen: boolean
  closeModal: () => void
  isFrom: boolean
}

/**
 * 切换网络，token也需要清空
 */

const SelectChainModal: FC<componentprops> = ({ isOpen, closeModal, isFrom }) => {
  const setFromOrTOChain = useAppStore(state => state.setFromOrTOChain)
  const fromChainID = useAppStore(state => state.fromChainID)
  const toChainID = useAppStore(state => state.toChainID)
  const setToken = useAppStore(state => state.setToken)
  const fromToken = useAppStore(state => state.fromToken)
  const toToken = useAppStore(state => state.toToken)
  const [searchKey, setSearchKey] = useState('')

  const switchingNetwork = useSwitchingNetwork()
  const listIng = useMemo(() => {
    // if(isFrom==false){
    //   return  USECHAIN_IDS.filter((item)=>{return  item!==fromChainID})
    // }
    return USECHAIN_IDS
  }, [])
  const currChainID = useMemo(() => {
    if (isFrom) return fromChainID
    else return toChainID
  }, [isFrom, fromChainID, toChainID])





  useEffect(() => {
    const need = fromChainID == null || toChainID == null || USECHAIN_IDS.includes(fromChainID) == false || USECHAIN_IDS.includes(toChainID) == false
    //set default
    if (need && isFrom) {
      const networkFrom = getChainInfo(USECHAIN_IDS[0])
      const networkTo = getChainInfo(USECHAIN_IDS[1])

      setFromOrTOChain(networkFrom, true, USECHAIN_IDS[0]) // true from
      setFromOrTOChain(networkTo, false, USECHAIN_IDS[1]) //false to
    }
  }, [fromChainID, toChainID, isFrom, setFromOrTOChain])

  const selectToken = useCallback(
    (data: Token | null) => {
      setToken(isFrom, data)
      if (data !== null) {
        closeModal()
      }
    },
    [setToken, closeModal, isFrom]
  )

  const clickFn = useCallback(
    async (network: L1ChainInfo | L2ChainInfo, chainId: SupportedChainId) => {
      setFromOrTOChain(network, isFrom, chainId)
      selectToken(null)
    },
    [isFrom, setFromOrTOChain, selectToken]
  )

  return (
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
                  <If condition={isFrom}>
                    <Then>Select a token</Then>
                    <Else>Select a token</Else>
                  </If>
                </Dialog.Title>
                <div className="mt-2">
                  <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700 flex  flex-col  ">
                    {listIng.map((chainId, index) => {
                      const network = getChainInfo(chainId)

                      return (
                        <li
                          key={index}
                          onClick={() => {
                            clickFn(network, chainId)
                          }}
                          className="   pb-3 pt-2 sm:pb-4 cursor-pointer hover:bg-slate-50"
                        >
                          <div className="flex flex-row items-center space-y-4   relative">
                            <div className=" absolute   right-2">
                              <When condition={currChainID == chainId}>
                                <CheckIcon className=" w-6 h-6  text-green-600"></CheckIcon>
                              </When>
                            </div>
                            <div className="flex-shrink-0 p-2">
                              <img className="w-8 h-8 rounded-full" src={network.logoUrl}></img>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate dark:text-white">{network.label}</p>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
       
     
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default SelectChainModal
