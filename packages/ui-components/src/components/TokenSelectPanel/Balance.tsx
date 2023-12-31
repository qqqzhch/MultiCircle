import { FC } from 'react'
import EthBalance from '../balance/EthBalance'
import Erc20Balance from '../balance/Erc20Balance'
import { If, Then, Else } from 'react-if'
import { useAppStore } from '../../state'

type proteType = {
  isFrom: boolean
}
const Balance: FC<proteType> = ({ isFrom }) => {
  const fromToken = useAppStore(state => state.fromToken)

  if (!isFrom) {
    return <></>
  }
  return (
    <div className="font-medium text-valuerouter-primary">
      <div>Balance</div>
      <div>
        <If condition={fromToken?.address == ''}>
          <Then>
            <EthBalance></EthBalance>
          </Then>
          <Else>
            <Erc20Balance></Erc20Balance>
          </Else>
        </If>
      </div>
    </div>
  )
}

export default Balance
