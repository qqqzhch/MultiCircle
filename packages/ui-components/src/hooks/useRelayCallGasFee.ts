import { useWeb3React } from '@web3-react/core'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { Contract, ethers } from 'ethers'
import { useDebounce } from 'react-use'
import UsdcRelayerABI from './../constants/ABI/UsdcRelayer.json'
import useRelayerAddress from './useRelayer'

import { Circle_Chainid } from '../constants/relayer'
import { useAppStore } from '../state'

import useErcCheckAllowance from './useCheckAllowance'

import useSwapParameter from './useSwapParameter'
import useCusRecipientAddress from './useCusRecipientAddress'

export default function useRelayCallGasFee() {
  const { library, account } = useWeb3React()

  const contractAddress = useRelayerAddress()

  const inputAmount = useAppStore(state => state.input)
  const toChainID = useAppStore(state => state.toChainID)
  const setGasFeeStore = useAppStore(state => state.setGasFee)
  const setError = useAppStore(state => state.setError)

  const { Validation2, allowanceValue } = useErcCheckAllowance()

  const fromToken = useAppStore(state => state.fromToken)
  const SwapParameter = useSwapParameter()

  const [gasFeeLoading, setGasFeeLoading] = useState(false)
  const CusRecipientAddress = useCusRecipientAddress()

  const isAllowance = useMemo(() => {
    return Validation2(allowanceValue, inputAmount) || fromToken?.address == ''
  }, [Validation2, inputAmount, allowanceValue, fromToken])

  useEffect(() => {
    if (SwapParameter.error) {
      setError(SwapParameter.error?.message)
    }
  }, [SwapParameter.error, setError])

  const getgas = useCallback(
    async (isestimateGas: boolean) => {
      if (
        contractAddress == undefined ||
        toChainID == null ||
        isAllowance == false ||
        SwapParameter.sellArgs == null ||
        SwapParameter.buyArgs == null ||
        account == undefined ||
        account == null
      ) {
        return
      }

      const signer = library.getSigner()
      const contract = new Contract(contractAddress, UsdcRelayerABI, signer)
      const destDomain = Circle_Chainid[toChainID]
      /**
     *    function swapAndBridge(
        SellArgs calldata sellArgs,
        BuyArgs calldata buyArgs,
        uint32 destDomain,
        bytes32 recipient
    ) public payable returns (uint64, uint64)
    */
      const sellArgs = SwapParameter.sellArgs
      const buyArgs = SwapParameter.buyArgs
      const value = fromToken?.address == '' ? inputAmount : '0'
      const accounthex32 = ethers.utils.hexZeroPad(CusRecipientAddress || account, 32)

      const gasAndValue: { value?: string; gaslimit?: number } = {}
      if (value != '0') {
        gasAndValue.value = value
      }
      if (isestimateGas) {
        setGasFeeLoading(true)
        try {
          const result = await contract.estimateGas.swapAndBridge(sellArgs, buyArgs, destDomain, accounthex32, gasAndValue)
          setGasFeeStore(result.toString())
        } catch (error: unknown) {
          setGasFeeLoading(false)
          const errorInfo = error as { reason: string }
          setError(errorInfo.reason || 'call swap failed')
          throw error as Error
        }
        setGasFeeLoading(false)
      } else {
        try {
          const result = await contract.swapAndBridge(sellArgs, buyArgs, destDomain, accounthex32, gasAndValue)
          return result
        } catch (error: unknown) {
          throw error as Error
        }
      }
    },
    [
      library,
      contractAddress,
      setGasFeeStore,
      toChainID,
      account,
      SwapParameter.buyArgs,
      SwapParameter.sellArgs,
      setGasFeeLoading,
      isAllowance,
      inputAmount,
      fromToken?.address,
      CusRecipientAddress,
      setError
    ]
  )

  useDebounce(
    () => {
      getgas(true)
    },
    100,
    [getgas]
  )

  const sendTx = useCallback(() => {
    return getgas(false)
  }, [getgas])

  return {
    gasFeeLoading: gasFeeLoading,
    sendTx
  }
}
