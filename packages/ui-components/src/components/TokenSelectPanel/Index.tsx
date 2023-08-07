import React from 'react';

const TokenSelectPanel = () => {
    return (
        <div className="bg-valuerouter-layers-2 rounded   ">
            <div className="border-b-valuerouter-primary flex items-center justify-between border-b px-3 py-2.5 sm:p-3">
              <div className="flex items-center">
                <p className="text-valuerouter-secondary text-sm font-medium sm:text-base">From</p>
                <div className="relative">
                  <button className="skt-w skt-w-input skt-w-button flex w-auto flex-shrink-0 items-center justify-start bg-transparent p-2 py-0 hover:bg-transparent sm:justify-between">
                    <span className="flex items-center">
                      <div className="relative flex h-fit w-fit">
                        <div className="skt-w h-5 w-5 overflow-hidden rounded-full sm:h-6 sm:w-6">
                          <img src="https://movricons.s3.ap-south-1.amazonaws.com/Ether.svg" width="100%" height="100%" />
                        </div>
                      </div>
                      <span className="skt-w text-valuerouter-primary -mb-0.5 ml-1 font-medium sm:text-lg">Ethereum</span>
                    </span>
                    <div className="bg-valuerouter-layers-2 ml-2 mt-[3px] h-4 w-4 rounded-full sm:h-5 sm:w-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="skt-w text-valuerouter-primary h-full w-full rotate-0 transition-all"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
              <div className="text-valuerouter-primary flex items-center text-sm font-semibold sm:text-base">
                <span className="text-medium text-valuerouter-secondary pr-1">Bal:</span>{' '}
                <span className="flex">
                  0 <span className="ml-1 hidden sm:block" />
                </span>
                <button className=" text-valuerouter-tag-purple dark:bg-valuerouter-tag-purple/10 ml-1 rounded-[2px] px-[5px] py-[3px] pb-0.5 text-sm font-semibold leading-[16.8px] disabled:opacity-50">
                  MAX
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-[14px] sm:py-4">
              <div className="relative flex w-full items-center overflow-hidden">
                <input
                  type="number"
                  className="skt-w skt-w-input text-valuerouter-primary w-full min-w-full max-w-[180px] bg-transparent pt-0.5 text-lg font-bold focus:max-w-none focus-visible:outline-none sm:max-w-full sm:text-xl"
                  placeholder={0.0}
                  spellCheck="false"
                  defaultValue=""
                />
                <div className="invisible absolute w-fit text-xl font-bold" />
              </div>
              <span>
                <button className="skt-w skt-w-input skt-w-button flex w-auto flex-shrink-0 items-center justify-between bg-transparent p-0 hover:bg-transparent">
                  <span className="flex items-center">
                    <div className="relative flex h-fit w-fit">
                      <div className="skt-w h-6 w-6 overflow-hidden rounded-full">
                        <img src="https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg" width="100%" height="100%" />
                      </div>
                    </div>
                    <span className="skt-w text-valuerouter-primary -mb-0.5 ml-1 font-medium sm:text-lg">USDC</span>
                  </span>
                  <div className="ml-0.5 h-5 w-5 sm:ml-2 sm:h-6 sm:w-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="skt-w text-valuerouter-primary h-full w-full rotate-0 transition-all"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>
              </span>
            </div>
          </div>
    );
};

export default TokenSelectPanel