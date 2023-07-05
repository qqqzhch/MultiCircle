
import SwichNetwork from '../swichNetwork'
import ReceiveAmount from './ReceiveAmount'
import ProtocolFee from './ProtocolFee'
import GasFee from './GasFee'
import InputAmountBlance from './InputAmountBlance'
import { ProtectedConnectWallet } from '../Guard/ProtectedConnectWallet'
import ProtectedApprove from '../Guard/ProtectedApprove'
import ProtecteNetwork from '../Guard/ProtecteNetwork'
import SelectPanel from '../selectChainModal/SelectPanel'
import ReviewBtnPanel from './ReviewBtnPanel'



const Swap = () => {
 
  return (
    <div className=" text-left">
      <div>
      <SelectPanel dataType={true}></SelectPanel>
        <SwichNetwork></SwichNetwork>
        <SelectPanel dataType={false}></SelectPanel>
        <InputAmountBlance></InputAmountBlance>
       
        <ReceiveAmount></ReceiveAmount>
        <ProtocolFee></ProtocolFee>
        <GasFee></GasFee>
        <div className='  flex'>
        <ProtectedConnectWallet>
          <ProtecteNetwork>
              <ProtectedApprove>
                <ReviewBtnPanel></ReviewBtnPanel>
              </ProtectedApprove>
          </ProtecteNetwork>
          
        </ProtectedConnectWallet>
        </div>
        
  
        
      </div>
      
    
    </div>
  )
}

export default Swap
