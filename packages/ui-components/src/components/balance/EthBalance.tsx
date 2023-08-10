import { formatUnitsErc20 } from '../../utils'
import { When } from 'react-if'
import Skeleton from 'react-loading-skeleton'

import { useAppStore } from '../../state'

import useEthBalance from '../../hooks/useEthBalance'

const Balance = () => {
  const fromToken = useAppStore(state => state.fromToken)
  const ethBalance = useEthBalance()

  if (fromToken == null) return <></>

  return (
    <div>
      <When condition={ethBalance.isloading}>
        <Skeleton />
      </When>
      <When condition={ethBalance.isloading == false}>{formatUnitsErc20(ethBalance.balance, '', fromToken.decimals)}</When>
    </div>
  )
}

export default Balance
