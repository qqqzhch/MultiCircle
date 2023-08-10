import { FC } from 'react'

import { formatUnitsErc20, cutOut } from '../../utils'
import { Token } from '../../types/token'
import { getChainInfo } from '../../constants/chainInfo'
import { SupportedChainId } from '../../constants/chains'
import ScanUrl from '../linkAndCopy/ScanUrl'
import CopyAddressBtn from '../linkAndCopy/CopyAddressBtn'
import { When } from 'react-if'

type proteType = {
  Tokeninfo: Token
  ChainID: SupportedChainId
  Amount: string
  isFrom: boolean
  txhash: string | undefined
}

const TokenAndChainInfo: FC<proteType> = ({ Tokeninfo, ChainID, Amount, isFrom, txhash }) => {
  const ChainInfo = getChainInfo(ChainID)

  if (Tokeninfo == null) {
    return <></>
  }

  return (
    <div className=" bg-slate-50 flex rounded-md items-center space-x-1 p-4 flex-wrap w-full sm:w-1/2 ">
      <div className="flex -space-x-4  items-start">
        <img width={40} src={Tokeninfo.logoURI}></img>
        <img width={20} src={ChainInfo?.logoUrl}></img>
      </div>
      <div>
        <div>
          {isFrom ? 'From' : 'To'} {ChainInfo?.label}
        </div>
        <div className=" flex flex-wrap">{formatUnitsErc20(Amount, Tokeninfo.symbol, Tokeninfo.decimals)}</div>
      </div>
      <div className=" flex items-center  mt-2 space-x-2">
        <When condition={txhash}>
          Tx Hash: {txhash && cutOut(txhash, 2, 2)} <ScanUrl addr={txhash} chainId={ChainID}></ScanUrl> <CopyAddressBtn addr={txhash}></CopyAddressBtn>
        </When>
      </div>
    </div>
  )
}

export default TokenAndChainInfo
