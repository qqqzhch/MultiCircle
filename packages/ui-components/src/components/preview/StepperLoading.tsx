import React,{FC} from 'react'
import Loading from '../loading'
import { classNames } from '../../utils'
import { When } from 'react-if'

const StepperLoading:FC<{step:number}> = ({step}) => {
 console.log('step',step)
  return (
    <>
    <When condition={step==4}>
    <div className="p-4 mb-4 text-sm  text-center text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
      <span className="font-medium">Mint Success</span>.
    </div>
    </When>
    <ol className="items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 my-2 justify-center">
      <li className={classNames("flex items-center text-blue-600  space-x-2.5",step>=0?"text-blue-600":"text-gray-500")}>
        <span className={classNames(" flex items-center justify-center w-8 h-8 border  rounded-full shrink-0",step>=0?"border-blue-600":"text-gray-500")}>1</span>
        <span>
          <h3 className="font-medium leading-tight">send</h3>
          <p className="text-sm">
            <When condition={step==0}>
            <Loading></Loading>
            </When>
            
          </p>
        </span>
      </li>
      <li className={classNames("flex items-center text-blue-600  space-x-2.5",step>=1?"text-blue-600":"text-gray-500")}>
      <span className={classNames(" flex items-center justify-center w-8 h-8 border  rounded-full shrink-0",step>=1?"border-blue-600":"text-gray-500")}>2</span>
        <span>
          <h3 className="font-medium leading-tight">scan</h3>
          <p className="text-sm">
          <When condition={step==1}>
            <Loading></Loading>
            </When>
          </p>
        </span>
      </li>
      <li className={classNames("flex items-center text-blue-600  space-x-2.5",step>=2?"text-blue-600":"text-gray-500")}>
      <span className={classNames(" flex items-center justify-center w-8 h-8 border  rounded-full shrink-0",step>=2?"border-blue-600":"text-gray-500")}>3</span>
        <span>
          <h3 className="font-medium leading-tight">attest</h3>
          <p className="text-sm">
          <When condition={step==2}>
            <Loading></Loading>
            </When>
          </p>
        </span>
      </li>
      <li className={classNames("flex items-center text-blue-600  space-x-2.5",step>=3?"text-blue-600":"text-gray-500")}>
      <span className={classNames(" flex items-center justify-center w-8 h-8 border  rounded-full shrink-0",step>=3?"border-blue-600":"text-gray-500")}>4</span>
        <span>
          <h3 className="font-medium leading-tight">mint</h3>
          <p className="text-sm">
          <When condition={step==3}>
            <Loading></Loading>
            </When>
          </p>
        </span>
      </li>
    </ol>

    </>
      )
}

export default StepperLoading
