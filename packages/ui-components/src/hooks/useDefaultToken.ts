import { Token } from '../types/token'
import { getChainInfo } from '../constants/chainInfo'
import { SupportedChainId } from '../constants/chains'

export default function useDefaultToken(ChainID: SupportedChainId | null) {
  if (ChainID == null) {
    return
  }
  const chainInfo = getChainInfo(ChainID)
  const item: Token = {
    chainId: ChainID,
    address: '',
    name: chainInfo.nativeCurrency.name,
    symbol: chainInfo.nativeCurrency.symbol,
    decimals: chainInfo.nativeCurrency.decimals,
    logoURI: chainInfo.logoUrl
  }
  return item
}
