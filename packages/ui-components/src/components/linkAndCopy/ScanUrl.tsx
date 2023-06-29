import { useParams } from 'react-router-dom'
import { FC } from 'react'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { useWeb3React } from '@web3-react/core'
import { getChainInfo } from '../../constants/chainInfo'
import { SupportedChainId } from '../../constants/chains'

type Prop = {
  addr?: string
  chainId:SupportedChainId
}
const ScanUrl: FC<Prop> = ({ addr,chainId }) => {

  
  const ChainInfo = getChainInfo(chainId)

  const data = addr
  return (
    <a
      data-tooltip-id="tooltip"
      data-tooltip-content={`View on ${ChainInfo?.label} Blockchain Explorer`}
      rel="noreferrer"
      target={'_blank'}
      href={`${ChainInfo?.explorer}tx/${data}`}
    >
      <ArrowTopRightOnSquareIcon className=" h-4 w-4 text-blue-500 "></ArrowTopRightOnSquareIcon>
    </a>
  )
}

export default ScanUrl