import { observer } from "mobx-react-lite";
import { SyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";

// interface Props {
//     activities: Activity[];
//     deleteActivity: (id: string) => (void);
//     submitting: boolean;
// }

export default observer(function ActivityList(){
    const {activityStore} = useStore();
    const {deleteActivity, activitiesByDate, loading} = activityStore;

    const [target, setTarget] = useState('');

    function handleactivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) // e=event
    {
        setTarget(e.currentTarget .name);
        deleteActivity(id);
    }

    return (
        <Segment>
            <Item.Group divided>
                {/* divided: ada horizontal line */}
                {activitiesByDate.map(activity => (
                    // pokonya klo mau specify kita bikin elemen unik, hrs pake key 
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button as={Link} to={`/activities/${activity.id}`} floated='right' color='blue'>View</Button>
                                <Button 
                                name={activity.id}
                                loading={loading && target === activity.id} // mastiin yg loading dia doang. 
                                // klo submitting doang ntar semua button ikutan loading
                                onClick={(e) => handleactivityDelete(e, activity.id)} 
                                floated='right' 
                                color='red'>Delete</Button>
                                <Label basic content={activity.category}/>
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
})