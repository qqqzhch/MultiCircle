import React from 'react';

const SwapBtn = () => {
    return (
        <div>
              <button className="bg-valuerouter-btn-primary hover:bg-valuerouter-btn-primary-hover text-valuerouter-btn-primary  disabled:bg-valuerouter-btn-disabled disabled:text-valuerouter-btn-disabled-text relative flex w-full items-center justify-center rounded px-4 py-[13px] font-semibold capitalize leading-[24px] transition-all sm:text-lg">
                Connect Wallet
              </button>
            </div>
    );
};

export default SwapBtn;