import { createStore,useStore } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from "zustand/middleware/immer";
import React, { createContext, FC, useContext } from "react";
import { L1ChainInfo,L2ChainInfo } from '../constants/chainInfo';
import { SupportedChainId } from '../constants/chains';
//SupportedChainId


export  interface txItem {
  fromChainID:SupportedChainId
  toChainID:SupportedChainId
  input:string
  fee:string
  txhash:string
  status?:string|undefined,
  creattime:number,
  user:string
}

interface AppState {
  counter: number
  increase: (by: number) => void
  fromChain:L1ChainInfo|L2ChainInfo|null
  toChain:L1ChainInfo|L2ChainInfo|null
  fromChainID:SupportedChainId|null
  toChainID:SupportedChainId|null
  input:string
  output:string
  fee:string
  history:Array<txItem>
  setFromOrTOChain:(data:L1ChainInfo|L2ChainInfo,dataType:boolean,chainID:SupportedChainId )=>void
  getFromChain:()=>L1ChainInfo|L2ChainInfo|null
  getToChain:()=>L1ChainInfo|L2ChainInfo|null
  setInput:(amount:string)=>void
  setOutPut:(amount:string)=>void
  setFee:(amount:string)=>void
  getInPut:()=>string
  getOutPut:()=>string
  getFee:()=>string
  addToHistory:(tx:txItem)=>void
  getHistory:(account:string|undefined|null)=>Array<txItem>

}

const intialState = {
  counter: 5,
  fromChain:null,
  toChain:null,
  fromChainID:null,
  toChainID:null,
  input:"0",
  output:"0",
  fee:"0",
  history:[]
};


const createMyStore = (state: typeof intialState = intialState) => {
  return createStore<AppState, [['zustand/devtools', never], ["zustand/immer", never], ["zustand/persist", AppState]]>(
    devtools(immer(persist((set,get) => ({
      ...state,
      increase: () =>
        set((state) => {
          state.counter++;
        }),
      setFromOrTOChain:(data:L1ChainInfo|L2ChainInfo,dataType:boolean,chainID:SupportedChainId)=>{
        if(dataType==true){
          set((state)=>{
            state.fromChain=data
            state.fromChainID=chainID
          })
        }else{
         set((state)=>{
            state.toChain=data
            state.toChainID=chainID
           })
        }
      },
      getFromChain(){
        const data = get().fromChain
        return data
      },
      getToChain() {
        const data = get().toChain        
        return data
      },
      setInput:(amount:string)=>{
        set((state)=>{
          state.input=amount
        })
      },
      setOutPut:(amount:string)=>{
        set((state)=>{
          state.output=amount
        })
      },
      setFee:(amount:string)=>{
        set((state)=>{
          state.fee=amount
        })
      },
      getInPut() {
        return get().input
      },
      getOutPut() {
        return get().output
      },
      getFee() {
        return get().fee
      },
      addToHistory:(tx:txItem)=>{
       const history = get().history;
       const data = history.find((item:txItem)=>{
        return item.txhash==tx.txhash
       })
       if(data==undefined||data==null){
        set((state)=>{
          state.history.push(tx);
        })
       }

      },
      getHistory:(account:string|undefined|null)=>{
        return  get().history.filter((item)=>{return item.user==account});
      }
    }), { name: 'app-storage' })))
  );
};

const MyStoreContext = createContext<ReturnType<typeof createMyStore> | null>(
  null
);





export const AppStoreProvider:FC<{children:React.ReactNode}> = ({children}) => {

  const store = createMyStore(intialState);
  
  return (<MyStoreContext.Provider value={store}>{children}</MyStoreContext.Provider>)
};

export function useAppStore(): AppState;
export function useAppStore<T>(
  selector: (store: AppState) => T,
  equalityFn?: (left: T, right: T) => boolean
): T;
export function useAppStore<T>(
  selector?: (store: AppState) => T,
  equalityFn?: (left: T, right: T) => boolean
) {
  const store = useContext(MyStoreContext);

  if (!store) {
    throw new Error("MyStoreContext is not provided");
  }

  return useStore(store, selector as any, equalityFn);
}

