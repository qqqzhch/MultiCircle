import { FC, useMemo } from 'react'
import { txItem } from '../../state/index'

import dayjs from '../../utils/dayjs'
import useTxStatus from '../../hooks/useTxStatus'
import { Else, If, Then, When } from 'react-if'

import TokenAndChainInfo from './TokenAndChainInfo'

//txItem
const Txinfo: FC<{ Item: txItem }> = ({ Item }) => {
  const status = useTxStatus(Item.txhash)

  //{"code":0,"data":{"attest":"done","mint":"done","scan":"done"}}
  const statusMint = useMemo(() => {
    const statusText = {
      text: 'Waiting for scan',
      step: 0
    }
    if (status && status.data && status.data.data) {
      if (status.data.data.scan == 'done') {
        statusText.text = 'Waiting for attest'
        statusText.step = 1
      }
      if (status.data.data.attest == 'done') {
        statusText.text = 'Waiting for mint'
        statusText.step = 2
      }
      if (status.data.data.mint == 'done') {
        statusText.text = 'Success'
        statusText.step = 3
      }
    }
    return statusText
  }, [status])

  // useEffect(()=>{
  //     if(statusMint.text=='Success'&&status.data?.data.to?.txhash){
  //         updateHistoryBytxhash(Item.txhash,status.data?.data.to?.txhash)
  //     }

  // },[statusMint.text,updateHistoryBytxhash,Item.txhash,status.data?.data.to?.txhash])

  return (
    <div className="flex flex-col pb-3 mt-2 pt-2">
      <div className=" flex flex-col sm:flex-row justify-around   items-stretch">
        <TokenAndChainInfo Tokeninfo={Item.fromToken} ChainID={Item.fromChainID} Amount={Item.input} isFrom={true} txhash={Item.txhash}></TokenAndChainInfo>
        <div className=" flex">
          <span className=" m-auto">{'>'}</span>
        </div>
        <TokenAndChainInfo
          Tokeninfo={Item.toToken}
          ChainID={Item.toChainID}
          Amount={Item.output}
          isFrom={false}
          txhash={status.data?.data.to?.tx_hash}
        ></TokenAndChainInfo>
      </div>

      <dt className="mb-1 text-gray-500 md:text-md dark:text-gray-400">Time: {dayjs(Item.creattime).fromNow()}</dt>
      <dt className="mb-1 text-gray-500 md:text-md dark:text-gray-400">
        State:
        <If condition={status.isLoading}>
          <Then>
            <span>Loading</span>
          </Then>
          <Else>
            <When condition={statusMint.step == 3}>
              <span className=" text-green-600">Success</span>
            </When>
            <When condition={statusMint.step != 3}>
              <span className=" text-yellow-400">{statusMint.text}</span>
            </When>
          </Else>
        </If>
      </dt>
    </div>
  )
}

export default Txinfo
