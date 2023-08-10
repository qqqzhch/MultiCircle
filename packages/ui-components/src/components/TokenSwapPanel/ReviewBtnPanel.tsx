import React,{useCallback,useEffect,useMemo,useState} from 'react';
import { useAppStore } from '../../state'
import { useToasts } from 'react-toast-notifications'
import { BigNumber } from 'ethers';
import useErc20Balance from '../../hooks/useErc20Balance'
import PreviewModal from '../preview'
import { USECHAIN_IDS } from '../../constants/chains'
import useEthBalance from '../../hooks/useEthBalance';
import useQuote from '../../hooks/useQuote';




const ReviewBtnPanel = () => {
    const fromChainInfo= useAppStore((state)=>state.fromChain) 
    const toChainInfo = useAppStore((state)=>state.toChain)
    const fromChainID = useAppStore((state)=>state.fromChainID)
    const toChainID = useAppStore((state)=>state.toChainID)
    const setInput = useAppStore((state)=>state.setInput)
    const inputNumer = useAppStore((state)=>state.input)
    const fromToken = useAppStore((state)=>state.fromToken)
    const { addToast } = useToasts()
    const usdcBalance=  useErc20Balance(fromToken?.address)
    const ethBalance = useEthBalance()
    const gasFee = useAppStore((state)=>state.gasFee)
   

    const [isPreviewOpen, setPreviewOpen] = useState(false)





    
    const ValidateAmountFN = useCallback(()=>{

        if(fromChainID==null||toChainID==null|| USECHAIN_IDS.includes(fromChainID)==false||USECHAIN_IDS.includes(toChainID)==false){
          addToast("Please check the network", { appearance: 'error' })
          return false
        }
        const  num =BigNumber.from(inputNumer)
        let tempbalance
        if(fromToken?.address!==""){
          tempbalance=usdcBalance;
        }else{
          tempbalance=ethBalance;

        }
        if(tempbalance.balance==undefined){
          addToast("Please check the balance", { appearance: 'error' })
          return false
        }
        if(num.gt(0)&&num.lte(tempbalance.balance)){
          setPreviewOpen(true)
          return true
        }else{
          addToast("Please check the values entered", { appearance: 'error' })
          return false
        }
    
      },[inputNumer,usdcBalance,addToast,fromChainID,toChainID,ethBalance,fromToken])

    
      
  const closePreModel= useCallback(()=>{
    console.log('closePreModel')
    setPreviewOpen(false)
  },[setPreviewOpen])

      
    return (
        <>
        <button
                  onClick={()=>{ValidateAmountFN()}}
              disabled={gasFee==="0"}
                className="px-6 py-3.5 text-white flex-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto text-center disabled:bg-slate-700"
              >
              Review
              </button>
              <PreviewModal isOpen={isPreviewOpen} closeModal={closePreModel}></PreviewModal>

        </>
        
    );
};

export default ReviewBtnPanel;