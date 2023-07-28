import {FC} from 'react'

import {  Bars3Icon } from '@heroicons/react/24/solid'
import mobilelogo from '../../assets/ValueRouter.png'

import Connectwallet from '../connectwallet'
import ChainList from '../chainList/index'
import Noticeinfo from '../noticeinfo'







export const Header:FC = () => {
  return (
    <header className="text-gray-600 body-font">
         <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <a href="/" className="flex items-center">
                <img src={mobilelogo} className="mr-3  h-12" alt="MultiCircle Logo" />

            </a>
            <div className="flex items-center lg:order-2">
                <Noticeinfo></Noticeinfo>
                 <ChainList></ChainList>
                 <Connectwallet></Connectwallet>
                <button data-collapse-toggle="mobile-menu-2" type="button" className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
                   <Bars3Icon className=' w-6 h-6'></Bars3Icon>
                </button>
            </div>
            <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1 flex-1 sm:ml-8" id="mobile-menu-2">
                <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                    <li>
                        <a href="#" className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white" aria-current="page">USDC Router</a>
                    </li>
                    <li>
                        <a href="#" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Doc</a>
                    </li>
              
                </ul>
            </div>
        </div>
    </nav>
    </header>
  )
}
