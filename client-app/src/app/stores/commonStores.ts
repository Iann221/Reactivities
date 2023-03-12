import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../models/serverError";

export default class CommonStore {
    error: ServerError | null = null;
    token: string | null = localStorage.getItem('jwt');
    appLoaded = false;

    constructor() {
        makeAutoObservable(this);
        reaction( // dia hanya jalan kalo value token changes, tapi ga pas lagi initiate. cth pas user login/logout
            () => this.token, // we tell it we want to react to the token
            token =>{
                if(token){
                    localStorage.setItem('jwt', token) // shared preference
                } else {
                    localStorage.removeItem('jwt')
                }
            }
        )
    }

    setServerError(error: ServerError){
        this.error = error;
    }

    setToken(token: string | null){
        this.token = token;
    }

    setApploaded(){
        this.appLoaded = true;
    }
}