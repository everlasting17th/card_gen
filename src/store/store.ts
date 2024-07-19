import { createContext, useContext } from "react";
import { RootStore } from "./RootStore";
import { configure } from "mobx"

configure({
    enforceActions: "never",
});

export const StoreContext = createContext<RootStore>({} as RootStore);
export const StoreProvider = StoreContext.Provider;

export const useStore = (): RootStore => useContext(StoreContext);