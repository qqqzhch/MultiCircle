import { SupportedChainId } from "./chains"


export const Relayer_IDS_TO_ADDR = {
    [SupportedChainId.GOERLI]: '0x3b632adcF6C44715DF5bDA353F8332cd33C749E8',
    [SupportedChainId.AVALANCHE_FUJITEST]: '0xDe58B4282BF2308F51e7c4cbAF0B62b06C2d74a0',
    [SupportedChainId.AVALANCHE_C_HAIN]:'0x589c770e6DB222bEd273332c6E7267d3DF1C0036',
    [SupportedChainId.MAINNET]: '0x589c770e6DB222bEd273332c6E7267d3DF1C0036',
    [SupportedChainId.ROPSTEN]: '',
    [SupportedChainId.RINKEBY]: '',
    [SupportedChainId.KOVAN]: '',
    [SupportedChainId.POLYGON]: '',
    [SupportedChainId.POLYGON_MUMBAI]: '',
    [SupportedChainId.CELO]: '',
    [SupportedChainId.CELO_ALFAJORES]: '',
    [SupportedChainId.ARBITRUM_ONE]: '0x589c770e6DB222bEd273332c6E7267d3DF1C0036',
    [SupportedChainId.ARBITRUM_Goerli]: '0xC1a66ff524ca631e8a887Da7Ee44e615Ef6313Dc',
    [SupportedChainId.OPTIMISM]: '',
    [SupportedChainId.OPTIMISM_GOERLI]: '',
  }

  export const Circle_Chainid = {
    [SupportedChainId.GOERLI]:0,
    [SupportedChainId.AVALANCHE_FUJITEST]:1,
    [SupportedChainId.AVALANCHE_C_HAIN]:1,
    [SupportedChainId.MAINNET]: 0,
    [SupportedChainId.ROPSTEN]: '',
    [SupportedChainId.RINKEBY]: '',
    [SupportedChainId.KOVAN]: '',
    [SupportedChainId.POLYGON]: '',
    [SupportedChainId.POLYGON_MUMBAI]: '',
    [SupportedChainId.CELO]: '',
    [SupportedChainId.CELO_ALFAJORES]: '',
    [SupportedChainId.ARBITRUM_ONE]: 3,
    [SupportedChainId.ARBITRUM_Goerli]: 3,
    [SupportedChainId.OPTIMISM]: '',
    [SupportedChainId.OPTIMISM_GOERLI]: '',
  }
  //Time needed to leave
  export const LeaveTime_Chainid = {
    [SupportedChainId.GOERLI]:13,
    [SupportedChainId.AVALANCHE_FUJITEST]:3,
    [SupportedChainId.AVALANCHE_C_HAIN]:3,
    [SupportedChainId.MAINNET]: 13,
    [SupportedChainId.ROPSTEN]: '',
    [SupportedChainId.RINKEBY]: '',
    [SupportedChainId.KOVAN]: '',
    [SupportedChainId.POLYGON]: '',
    [SupportedChainId.POLYGON_MUMBAI]: '',
    [SupportedChainId.CELO]: '',
    [SupportedChainId.CELO_ALFAJORES]: '',
    [SupportedChainId.ARBITRUM_ONE]: 13,
    [SupportedChainId.ARBITRUM_Goerli]: 13,
    [SupportedChainId.OPTIMISM]: '',
    [SupportedChainId.OPTIMISM_GOERLI]: '',
  }

  export const BaseUrl="https://express-hello-world-p8m1l2gqb-qqqzhch.vercel.app/api"