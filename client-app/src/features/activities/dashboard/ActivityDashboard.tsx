import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import ActivityList from './ActivityList';

// interface Props {
//     activities: Activity[];
//     deleteActivity: (id: string) => (void)
//     submitting: boolean
// }

export default observer(function ActivityDashboard(){

    const {activityStore} = useStore();
    const {loadActivities, activityRegistry} = activityStore;
    // const {selectedActivity, editMode} = activityStore // destructure

    useEffect(() => { // what we want to do when our app loads up
        if(activityRegistry.size <= 1) loadActivities();
    }, [loadActivities]) // [] tu dependency agar ga manggil useEffect berkali setelah loaded
    
    if(activityStore.loadingInitial) return <LoadingComponent content='Loading app'/>

    return (
        <Grid>
            <Grid.Column width={'10'}> 
            {/* grid pny 16 length cenah */}
                {/* <List>
                    {activities.map(activity  => {
                    return(
                    <List.Item key={activity.id}>{activity.title}</List.Item>
                    );
                    })}
                </List>    */}
                <ActivityList />
            </Grid.Column>
            <Grid.Column width={'6'}>
                <h2>Activity filters</h2>
            </Grid.Column>
        </Grid>
    )
})