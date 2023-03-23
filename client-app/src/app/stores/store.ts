import { createContext, useContext } from "react";
import ActivityStore from "./activityStores";
import CommentStore from "./commentStore";
import CommonStore from "./commonStores";
import ModalStore from "./modalStore";
import ProfileStore from "./profileStore";
import UserStore from "./userStores";
// tempat nyimpen semua stores kita

// ini cm bikin tipe
interface Store {
    activityStore: ActivityStore;
    commonStore: CommonStore;
    userStore: UserStore;
    modalStore: ModalStore;
    profileStore: ProfileStore;
    commentStore: CommentStore;
}

export const store: Store = {
    activityStore: new ActivityStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore(),
    profileStore: new ProfileStore(),
    commentStore: new CommentStore()
}
// context digunakan utk bisa akses store dari mana aja
export const StoreContext = createContext(store);

// buat hook sendiri
export function useStore() {
    return useContext(StoreContext);
}