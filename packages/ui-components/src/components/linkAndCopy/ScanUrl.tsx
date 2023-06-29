import { useParams } from 'react-router-dom'
import { FC } from 'react'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { useWeb3React } from '@web3-react/core'
import { getChainInfo } from '../../constants/chainInfo'

type Prop = {
  addr?: string
}
const ScanUrl: FC<Prop> = ({ addr }) => {
  const { address } = useParams<{ address: string; chainType: string }>()
  const { chainId } = useWeb3React()
  const ChainInfo = getChainInfo(chainId)

  const data = addr || address || ''
  return (
    <a
      data-tooltip-id="tooltip"
      data-tooltip-content={`View on ${ChainInfo?.label} Blockchain Explorer`}
      rel="noreferrer"
      target={'_blank'}
      href={`${ChainInfo?.explorer}address/${data}`}
    >
      <ArrowTopRightOnSquareIcon className=" h-4 w-4 "></ArrowTopRightOnSquareIcon>
    </a>
  )
}

export default ScanUrl