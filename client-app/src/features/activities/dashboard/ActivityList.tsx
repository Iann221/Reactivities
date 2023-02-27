import { Button, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props {
    activities: Activity[];
    selectActivity: (id: string) => (void);
    deleteActivity: (id: string) => (void)
}

export default function ActivityList({activities, selectActivity, deleteActivity}: Props){
    return (
        <Segment>
            <Item.Group divided>
                {/* divided: ada horizontal line */}
                {activities.map(activity => (
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
                                <Button onClick={() => selectActivity(activity.id)} floated='right' color='blue'>View</Button>
                                <Button onClick={() => deleteActivity(activity.id)} floated='right' color='red'>Delete</Button>
                                <Label basic content={activity.category}/>
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
}