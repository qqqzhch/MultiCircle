import React,{FC} from 'react';
import { Web3ReactProvider } from "@web3-react/core";
import {ethers} from 'ethers'
import { ToastProvider } from "react-toast-notifications";

const getLibrary = (provider: any) => {
    const library = new ethers.providers.Web3Provider(provider);
    library.pollingInterval = 8000; // frequency provider is polling
    return library;
  };

type Props = {
    children?: React.ReactNode
};

export  const Web3Provider:FC<Props> = ({children}) => {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
        <ToastProvider autoDismiss={true} autoDismissTimeout={2000}  placement={"top-center"}>
          {children }
        </ToastProvider>
      </Web3ReactProvider>
    );
};

