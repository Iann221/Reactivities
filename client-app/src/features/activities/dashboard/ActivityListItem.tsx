import { Link } from "react-router-dom";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import {format} from 'date-fns';
import ActivityListItemAttendee from "./ActivityListItemAttendee";

interface Props {
    activity: Activity
}

export default function ActivityListItem({activity}: Props) {
    // const {activityStore} = useStore();
    // const {deleteActivity, loading} = activityStore;

    // const [target, setTarget] = useState('');

    // function handleactivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) // e=event
    // {
    //     setTarget(e.currentTarget .name);
    //     deleteActivity(id);
    // }
    return (
        // <Item key={activity.id}>
        //     <Item.Content>
        //         <Item.Header as='a'>{activity.title}</Item.Header>
        //         <Item.Meta>{activity.date}</Item.Meta>
        //         <Item.Description>
        //             <div>{activity.description}</div>
        //             <div>{activity.city}, {activity.venue}</div>
        //         </Item.Description>
        //         <Item.Extra>
        //             <Button as={Link} to={`/activities/${activity.id}`} floated='right' color='blue'>View</Button>
        //             <Button 
        //             name={activity.id}
        //             loading={loading && target === activity.id} // mastiin yg loading dia doang. 
        //             // klo submitting doang ntar semua button ikutan loading
        //             onClick={(e) => handleactivityDelete(e, activity.id)} 
        //             floated='right' 
        //             color='red'>Delete</Button>
        //             <Label basic content={activity.category}/>
        //         </Item.Extra>
        //     </Item.Content>
        // </Item>
        <Segment.Group>
             <Segment>
                {activity.isCancelled &&
                    <Label attached="top" color='red' content='cancelled' style={{textAlign: 'center'}}/>
                }
                <Item.Group>
                    <Item>
                        <Item.Image style={{marginBottom: 3}} size='tiny' circular src='/assets/user.png'/>
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>
                              {activity.title}  
                            </Item.Header>
                            <Item.Description>Hosted by {activity.host?.displayName}</Item.Description>
                            {activity.isHost && (
                                <Item.Description>
                                    <Label basic color='orange'>
                                        You are hosting this activity
                                    </Label>
                                </Item.Description>
                            )}
                            {activity.isGoing && !activity.isHost && (
                                <Item.Description>
                                    <Label basic color='green'>
                                        You are going to this activity
                                    </Label>
                                </Item.Description>
                            )}
                        </Item.Content>
                    </Item>
                </Item.Group>
             </Segment>
             <Segment>
                <span>
                    <Icon name='clock' /> {format(activity.date!, 'dd MMM yyyy h:mm aa')}
                    <Icon name='marker' /> {activity.venue}
                </span>
             </Segment>
             <Segment secondary>
                <ActivityListItemAttendee attendees={activity.attendees!}></ActivityListItemAttendee>
             </Segment>
             <Segment clearing>
                <span>{activity.description}</span>
                <Button as={Link} to={`/activities/${activity.id}`} color='teal' floated='right' content='View'/>
             </Segment>
        </Segment.Group>
    )
}