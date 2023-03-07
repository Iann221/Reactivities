import { createContext, useContext } from "react";
import ActivityStore from "./activityStores";
import CommonStore from "./commonStores";
// tempat nyimpen semua stores kita

// ini cm bikin tipe
interface Store {
    activityStore: ActivityStore;
    commonStore: CommonStore;
}

export const store: Store = {
    activityStore: new ActivityStore(),
    commonStore: new CommonStore()
}
// context digunakan utk bisa akses store dari mana aja
export const StoreContext = createContext(store);

// buat hook sendiri
export function useStore() {
    return useContext(StoreContext);
}