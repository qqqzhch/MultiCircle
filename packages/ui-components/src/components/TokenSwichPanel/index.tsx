import React from 'react';
import swichImg from '../../assets/switch.svg'
const TokenSwichPanel = () => {
    return (
        <button className="relative mx-auto -mt-2.5 flex h-[42px] w-[42px] items-center justify-center rounded-full border-4 border-valuerouter-switch bg-valuerouter-switch disabled:opacity-60  ">
              <img src={swichImg} className="h-5 w-5" />
            </button>
    );
};

export default TokenSwichPanel;