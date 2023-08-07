import React from 'react';

const TokenSwapRecipient = () => {
    return (
        <div className="flex items-center justify-between">
      <span className="text-valuerouter-primary font-medium">Recipient Address</span>
      <div className="flex items-center font-medium">
        <button className="text-valuerouter-theme-primary flex items-center font-semibold">
          <svg
            width={25}
            height={25}
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.5 2.97162C6.977 2.97162 2.5 7.44862 2.5 12.9716C2.5 18.4946 6.977 22.9716 12.5 22.9716C18.023 22.9716 22.5 18.4946 22.5 12.9716C22.5 7.44862 18.023 2.97162 12.5 2.97162ZM15.5 13.9716H13.5V15.9716C13.5 16.5236 13.052 16.9716 12.5 16.9716C11.948 16.9716 11.5 16.5236 11.5 15.9716V13.9716H9.5C8.948 13.9716 8.5 13.5236 8.5 12.9716C8.5 12.4196 8.948 11.9716 9.5 11.9716H11.5V9.97162C11.5 9.41962 11.948 8.97162 12.5 8.97162C13.052 8.97162 13.5 9.41962 13.5 9.97162V11.9716H15.5C16.052 11.9716 16.5 12.4196 16.5 12.9716C16.5 13.5236 16.052 13.9716 15.5 13.9716Z"
              fill="#3838f0"
            />
          </svg>{" "}
          <span className="ml-1">Add Address</span>
        </button>
      </div>
    </div>
    );
};

export default TokenSwapRecipient;