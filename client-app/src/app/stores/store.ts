import { createContext, useContext } from "react";
import ActivityStore from "./activityStores";
// tempat nyimpen semua stores kita

// ini cm bikin tipe
interface Store {
    activityStore: ActivityStore
}

export const store: Store = {
    activityStore: new ActivityStore()
}
// context digunakan utk bisa akses store dari mana aja
export const StoreContext = createContext(store);

// buat hook sendiri
export function useStore() {
    return useContext(StoreContext);
}