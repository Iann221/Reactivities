import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity";
import {v4 as uuid} from 'uuid';
import {format} from 'date-fns';
import { store } from "./store";
import { Profile } from "../models/profile";

export default class ActivityStore{
    // activities: Activity[] = [];
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        // makeObservable(this, {
        //     title: observable,
        //     setTitle: action  //klo g pke arrow function, pke action.bound agar bisa ngehubungin
        //     // setTitle dgn ActivityStore dan pake this
        // })
        makeAutoObservable(this) // klo g mw define satu2
    }

    get activitiesByDate() { // computed
        return Array.from(this.activityRegistry.values()).sort((a,b) => 
        a.date!.getTime() - b.date!.getTime());
        // sort date
    }

    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = format(activity.date!, 'dd MMM yyyy'); // key for each object
                activities[date] = activities[date] ? [...activities[date], activity] : [activity]
                // apa activities punya date?
                return activities; // activities akan punya tipe {"2022-11-11" : [Activity], dst}
            }, {} as {[key: string]: Activity[]}) // initial value
        ) 
        // final object:
        // [
        //     [
        //       "2020-01-04",
        //       [
        //         {
        //             activity1
        //         }
        //       ]
        //     ]
        //     [
        //       "2020-02-04",
        //       [
        //         {
        //             activity1
        //         },
        //         {
        //             activity2
        //         }
        //       ]
        //     ] 
        //   ]
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const activities = await agent.Activities.list();
            // runInAction(() => {
                activities.forEach(activity => {
                    this.setActivity(activity);
                })
                // this.loadingInitial = false;
                this.setLoadingInitial(false);
            // })
        } catch(error) {
            console.log(error);
            this.setLoadingInitial(false);
            // runInAction(() => {
            //     this.loadingInitial = false;
            // })
            // jadi mobx tu ada strict mode, yang ngedit observablenya kan async function nih itungannya,
            // bkn actionnya. hrs ditambahin runinaction bwt bener
            // bisa juga bikin action sendiri
        }
    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity;
            return activity;
        }
        else {
            this.setLoadingInitial(true);
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => this.selectedActivity = activity);
                this.setLoadingInitial(false);
                return activity
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private setActivity = (activity: Activity) => {
        // klo datenya string:
        // activity.date = activity.date.split('T')[0];
        // this.activityRegistry.set(activity.id,activity);
        console.log('set activity:' + JSON.stringify(activity));

        const user = store.userStore.user;
        if (user) {
            activity.isGoing = activity.attendees!.some( // return true/false for any element of an array
                a => a.username === user.username // jika dlm attendees ada username kita, isgoing = true
            )
            activity.isHost = activity.hostUsername === user.username;
            activity.host = activity.attendees?.find(x => x.username === activity.hostUsername)
        }
        // klo datenya js dateObject:
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }

    private getActivity = (id: string) => {
        // gonna return activity jika idnya ada ato undefined
        return this.activityRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    // selectActivity = (id: string) => {
    //     // this.selectedActivity = this.activities.find(a => a.id === id);
    //     this.selectedActivity = this.activityRegistry.get(id);
    // }

    // cancelSelectedActivity = () => {
    //     this.selectedActivity = undefined;
    // }

    // openForm = (id?: string) => {
    //     id ? this.selectActivity(id) : this.cancelSelectedActivity();
    //     this.editMode = true;
    // }

    // closeForm = () => {
    //     this.editMode = false;
    // }

    createActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!);
        try {
            await agent.Activities.create(activity);
            const newActivity = new Activity(activity);
            newActivity.hostUsername = user!.username;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);
            runInAction(() => {
                // this.activities.push(activity);
                this.selectedActivity = newActivity;
            })
        }catch(error){
            console.log(error);
        }
    }

    updateActivity = async (activity: ActivityFormValues) => {
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                if(activity.id) {
                    let updateActivity = {...this.getActivity(activity.id), ...activity} 
                    // gabungan current activity plus activity dari form //activity form bisa nimpa hasil current activity
                    this.activityRegistry.set(activity.id, updateActivity as Activity); 
                    this.selectedActivity = updateActivity as Activity;
                }
            })
        } catch(error){
            console.log(error)
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                // this.activities = [...this.activities.filter(a => a.id !== id)];
                this.activityRegistry.delete(id);
                // if (this.selectedActivity?.id === id) this.cancelSelectedActivity();
                this.loading = false;
            })
        }catch(error){
            console.log(error)
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateAttendance = async () => {
        const user = store.userStore.user
        this.loading = true
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            // sebenernya bisa aja update dari hasil return si api attend ini, tpi di lecture lakuinnya manual
            runInAction(() => {
                if(this.selectedActivity?.isGoing){
                    this.selectedActivity.attendees = 
                        this.selectedActivity.attendees?.filter(a => a.username !== user?.username); // hanya return array yg usernamemnya ga sama
                    this.selectedActivity.isGoing = false
                } else {
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!)
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    cancelActivityToggle = async () => {
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

}