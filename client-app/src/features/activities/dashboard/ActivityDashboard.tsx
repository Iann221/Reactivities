import { observer } from 'mobx-react-lite';
import { Grid } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';

// interface Props {
//     activities: Activity[];
//     deleteActivity: (id: string) => (void)
//     submitting: boolean
// }

export default observer(function ActivityDashboard(){

    const {activityStore} = useStore();
    const {selectedActivity, editMode} = activityStore // destructure

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
                {selectedActivity && !editMode &&
                <ActivityDetails 
                />} 
                {/* && anything to the right of this will execute as long as it's not null */}
                {editMode &&
                    <ActivityForm />}
            </Grid.Column>
        </Grid>
    )
})