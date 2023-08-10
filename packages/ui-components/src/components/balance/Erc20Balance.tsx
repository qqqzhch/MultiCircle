import useErc20Balance from '../../hooks/useErc20Balance'
import { formatUnitsErc20 } from '../../utils'
import { When } from 'react-if'
import Skeleton from 'react-loading-skeleton'

import { useAppStore } from '../../state'

const Balance = () => {
  const fromToken = useAppStore(state => state.fromToken)
  const usdcBalance = useErc20Balance(fromToken?.address)

  if (fromToken == null) return <></>

  return (
    <div>
      <When condition={usdcBalance.isloading}>
        <Skeleton />
      </When>
      <When condition={usdcBalance.isloading == false}>{formatUnitsErc20(usdcBalance.balance, '', fromToken.decimals)}</When>
    </div>
  )
}

export default Balance
