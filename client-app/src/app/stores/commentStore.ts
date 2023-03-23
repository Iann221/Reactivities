import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { ChatComment } from "../models/comments";
import { store } from "./store";

export default class CommentStore {
    comments: ChatComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (activityId: string) => {
        if(store.activityStore.selectedActivity) {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl('http://localhost:5000/chat?activityId=' + activityId, {//activityId hrs sama dengan yg di ChatHub.cs
                    accessTokenFactory: () => store.userStore.user?.token! // get the token
                }) 
                .withAutomaticReconnect() // attempt to reconnect client to chathub if they lose connection
                .configureLogging(LogLevel.Information) // agar bisa liat whats going on when we connect
                .build(); // create connection

            this.hubConnection.start().catch(error => console.log('Error establishing connection'))

            this.hubConnection.on('LoadComments', (comments: ChatComment[]) => {// namanya hrs sama dengan ChatHub.cs
                runInAction(() => {
                    comments.forEach(comment => {
                        comment.createdAt = new Date(comment.createdAt + 'Z')
                    })
                    this.comments = comments;
                });
            }) 

            this.hubConnection.on('ReceiveComment', (comment: ChatComment) => {
                runInAction(() => {
                    comment.createdAt = new Date(comment.createdAt)
                    this.comments.unshift(comment); // put comment on start of array
                });
            })
        }
    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log('Error stopping connection; ', error))
    }

    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }

    addComment = async (values: any) => {
        values.activityId = store.activityStore.selectedActivity?.id;
        try {
            await this.hubConnection?.invoke('SendComment', values); // namanya hrs sama dengan method SendComment
        } catch (error) {
            console.log(error)
        }
    }
}