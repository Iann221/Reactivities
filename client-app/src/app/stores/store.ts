import { createContext, useContext } from "react";
import ActivityStore from "./activityStores";
import CommonStore from "./commonStores";
import ModalStore from "./modalStore";
import UserStore from "./userStores";
// tempat nyimpen semua stores kita

// ini cm bikin tipe
interface Store {
    activityStore: ActivityStore;
    commonStore: CommonStore;
    userStore: UserStore;
    modalStore: ModalStore;
}

export const store: Store = {
    activityStore: new ActivityStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore()
}
// context digunakan utk bisa akses store dari mana aja
export const StoreContext = createContext(store);

// buat hook sendiri
export function useStore() {
    return useContext(StoreContext);
}