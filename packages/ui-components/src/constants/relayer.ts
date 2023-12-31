import { SupportedChainId } from './chains'

export const Relayer_IDS_TO_ADDR = {
  [SupportedChainId.GOERLI]: '0x86BD43AE87ad6bD18bb26E6631ae44f0c507D5cA',
  [SupportedChainId.AVALANCHE_FUJITEST]: '0xDe58B4282BF2308F51e7c4cbAF0B62b06C2d74a0',
  [SupportedChainId.AVALANCHE_C_HAIN]: '0x2B6C2d554Ac3Dfb03c912f02B3823Aa04d0Fc838',
  [SupportedChainId.MAINNET]: '0x589c770e6DB222bEd273332c6E7267d3DF1C0036',
  [SupportedChainId.ROPSTEN]: '',
  [SupportedChainId.RINKEBY]: '',
  [SupportedChainId.KOVAN]: '',
  [SupportedChainId.POLYGON]: '',
  [SupportedChainId.POLYGON_MUMBAI]: '',
  [SupportedChainId.CELO]: '',
  [SupportedChainId.CELO_ALFAJORES]: '',
  [SupportedChainId.ARBITRUM_ONE]: '0xF8D0F5F8BBA78F1D91b8576C4C5C8399b0BdD33F',
  [SupportedChainId.ARBITRUM_Goerli]: '0xC1a66ff524ca631e8a887Da7Ee44e615Ef6313Dc',
  [SupportedChainId.OPTIMISM]: '',
  [SupportedChainId.OPTIMISM_GOERLI]: ''
}

export const Circle_Chainid = {
  [SupportedChainId.GOERLI]: 0,
  [SupportedChainId.AVALANCHE_FUJITEST]: 1,
  [SupportedChainId.AVALANCHE_C_HAIN]: 1,
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
  [SupportedChainId.OPTIMISM_GOERLI]: ''
}
//Time needed to leave
export const LeaveTime_Chainid = {
  [SupportedChainId.GOERLI]: '1 minutes',
  [SupportedChainId.MAINNET]: '13 minutes',

  [SupportedChainId.AVALANCHE_FUJITEST]: '1 minutes',
  [SupportedChainId.AVALANCHE_C_HAIN]: '3 minutes',

  [SupportedChainId.ARBITRUM_Goerli]: '1 minutes',
  [SupportedChainId.ARBITRUM_ONE]: '13 minutes',

  [SupportedChainId.ROPSTEN]: '',
  [SupportedChainId.RINKEBY]: '',
  [SupportedChainId.KOVAN]: '',
  [SupportedChainId.POLYGON]: '',
  [SupportedChainId.POLYGON_MUMBAI]: '',
  [SupportedChainId.CELO]: '',
  [SupportedChainId.CELO_ALFAJORES]: '',
  [SupportedChainId.OPTIMISM]: '',
  [SupportedChainId.OPTIMISM_GOERLI]: ''
}

//TokenList
export const TokenList_Chainid = {
  [SupportedChainId.GOERLI]: '',
  [SupportedChainId.MAINNET]: 'https://tokens.coingecko.com/ethereum/all.json',

  [SupportedChainId.AVALANCHE_FUJITEST]: '',
  [SupportedChainId.AVALANCHE_C_HAIN]: 'https://tokens.coingecko.com/avalanche/all.json',

  [SupportedChainId.ARBITRUM_Goerli]: '',
  [SupportedChainId.ARBITRUM_ONE]: 'https://tokens.coingecko.com/arbitrum-one/all.json',

  [SupportedChainId.ROPSTEN]: '',
  [SupportedChainId.RINKEBY]: '',
  [SupportedChainId.KOVAN]: '',
  [SupportedChainId.POLYGON]: '',
  [SupportedChainId.POLYGON_MUMBAI]: '',
  [SupportedChainId.CELO]: '',
  [SupportedChainId.CELO_ALFAJORES]: '',
  [SupportedChainId.OPTIMISM]: '',
  [SupportedChainId.OPTIMISM_GOERLI]: ''
}

//TokenList
export const TokenList_Balance = {
  [SupportedChainId.GOERLI]: '',
  [SupportedChainId.MAINNET]: '0xb1f8e55c7f64d203c1400b9d8555d050f94adf39',

  [SupportedChainId.AVALANCHE_FUJITEST]: '',
  [SupportedChainId.AVALANCHE_C_HAIN]: '0xD023D153a0DFa485130ECFdE2FAA7e612EF94818',

  [SupportedChainId.ARBITRUM_Goerli]: '',
  [SupportedChainId.ARBITRUM_ONE]: '0x151E24A486D7258dd7C33Fb67E4bB01919B7B32c',

  [SupportedChainId.ROPSTEN]: '',
  [SupportedChainId.RINKEBY]: '',
  [SupportedChainId.KOVAN]: '',
  [SupportedChainId.POLYGON]: '',
  [SupportedChainId.POLYGON_MUMBAI]: '',
  [SupportedChainId.CELO]: '',
  [SupportedChainId.CELO_ALFAJORES]: '',
  [SupportedChainId.OPTIMISM]: '',
  [SupportedChainId.OPTIMISM_GOERLI]: ''
}

export const BaseUrl = 'https://express-hello-world-gamma.vercel.app/api'

export const BaseQuote = 'https://express-hello-world-gamma.vercel.app/api/quote'

//https://express-hello-world-gamma.vercel.app/api/quote?buyToken=DAI&sellToken=ETH&sellAmount=100000&chainid=1

export const uniswapTokenList = 'https://gateway.ipfs.io/ipns/tokens.uniswap.org'
