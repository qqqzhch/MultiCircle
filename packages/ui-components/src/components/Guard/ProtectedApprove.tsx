import React,{useCallback, useMemo,useState} from 'react';
import useErc20Approve from '../../hooks/useApprove'
import useErcCheckAllowance from '../../hooks/useCheckAllowance'
import { useAppStore } from '../../state'
import Loading from '../loading';



const ProtectedApprove = ({ children, className }: { children: JSX.Element; className?: string }) => {
    const ApproveUSDT = useErc20Approve()
    const checkAllowance= useErcCheckAllowance()
    const inputNumer = useAppStore((state)=>state.input)
    const [isLoading,setIsisLoading] = useState(false)

    const allowance = useMemo(()=>{
      return  checkAllowance.Validation(inputNumer)
    },[checkAllowance,inputNumer])

    const Submit = useCallback(async()=>{
      setIsisLoading(true)
      await ApproveUSDT.doFetch()
      setIsisLoading(false)
    },[ApproveUSDT,setIsisLoading])

    if(allowance==true){
        return children
    }

    if(inputNumer=="0"){
      return (
        <button
        disabled
            className="px-6 py-3.5 text-white flex-1  bg-blue-600 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800  cursor-wait"
          >
           Approve   
          </button>)
      
    }

    if(isLoading){
        return (<button
            className="px-6 py-3.5 text-white flex-1 flex    bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800  cursor-wait"
          >
            <Loading></Loading>
           <div className=' text-center'>Approve loading</div>   
          </button>)
    }
     
    return (
        <button
         onClick={Submit}
          className="px-6 py-3.5 text-white flex-1  bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto  text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
         Approve  
        </button>
    );
};

export default ProtectedApprove;