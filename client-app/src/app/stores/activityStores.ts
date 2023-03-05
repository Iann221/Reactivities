import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import {v4 as uuid} from 'uuid';

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
        Date.parse(a.date) - Date.parse(b.date));
        // sort date
    }

    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = activity.date; // key for each object
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
        activity.date = activity.date.split('T')[0];
        this.activityRegistry.set(activity.id,activity);
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

    createActivity = async (activity: Activity) => {
        this.loading = true
        activity.id = uuid();
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                // this.activities.push(activity);
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        }catch(error){
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                // this.activities = [...this.activities.filter(a => a.id !== activity.id), activity];
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch(error){
            console.log(error)
            runInAction(() => {
                this.loading = false;
            })
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

}