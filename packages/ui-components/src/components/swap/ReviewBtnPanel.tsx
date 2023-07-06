import React,{useCallback,useMemo,useState} from 'react';
import { useAppStore } from '../../state'
import { useToasts } from 'react-toast-notifications'
import { BigNumber } from 'ethers';
import useErc20Balance from '../../hooks/useErc20Balance'
import PreviewModal from '../preview'
import { USECHAIN_IDS } from '../../constants/chains'



const ReviewBtnPanel = () => {
    const fromChainInfo= useAppStore((state)=>state.fromChain) 
    const toChainInfo = useAppStore((state)=>state.toChain)
    const fromChainID = useAppStore((state)=>state.fromChainID)
    const toChainID = useAppStore((state)=>state.toChainID)
    const setInput = useAppStore((state)=>state.setInput)
    const inputNumer = useAppStore((state)=>state.input)
    const { addToast } = useToasts()
    const usdcBalance=  useErc20Balance()

    const [isPreviewOpen, setPreviewOpen] = useState(false)




    
    const ValidateAmountFN = useCallback(()=>{

        if(fromChainID==null||toChainID==null|| USECHAIN_IDS.includes(fromChainID)==false||USECHAIN_IDS.includes(toChainID)==false){
          addToast("Please check the network", { appearance: 'error' })
          return false
        }
        const  num =BigNumber.from(inputNumer)
        if(usdcBalance.balance==undefined){
          addToast("Please check the balance", { appearance: 'error' })
          return false
        }
        if(num.gt(0)&&num.lte(usdcBalance.balance)){
          setPreviewOpen(true)
          return true
        }else{
          addToast("Please check the values entered", { appearance: 'error' })
          return false
        }
    
      },[inputNumer,usdcBalance,addToast,fromChainID,toChainID])

    
      
  const closePreModel= useCallback(()=>{
    console.log('closePreModel')
    setPreviewOpen(false)
  },[setPreviewOpen])

      
    return (
        <>
        <button
                  onClick={()=>{ValidateAmountFN()}}
                
                className="px-6 py-3.5 text-white flex-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
              Review
              </button>
              <PreviewModal isOpen={isPreviewOpen} closeModal={closePreModel}></PreviewModal>

        </>
        
    );
};

export default ReviewBtnPanel;