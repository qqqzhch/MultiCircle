import React from 'react'
import { ProtectedConnectWallet } from '../Guard/ProtectedConnectWallet'
import ProtectedApprove from '../Guard/ProtectedApprove'
import ProtecteNetwork from '../Guard/ProtecteNetwork'
import ReviewBtnPanel from './ReviewBtnPanel'
const SwapBtn = () => {
  return (
    <div className='  flex'>
      <ProtectedConnectWallet>
        <ProtecteNetwork>
          <ProtectedApprove>
            <ReviewBtnPanel></ReviewBtnPanel>
          </ProtectedApprove>
        </ProtecteNetwork>
      </ProtectedConnectWallet>
    </div>
  )
}

export default SwapBtn
