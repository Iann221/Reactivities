import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Card, Image } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";

export default observer(function ActivityDetails(){
    const {activityStore} = useStore();
    const {selectedActivity: activity, loadActivity, loadingInitial} = activityStore; //: activity mksdnya itu didefine as activity di file ini
    const {id} = useParams();

    useEffect(() => {
        if (id) loadActivity(id);
    }, [id, loadActivity])

    if(loadingInitial || !activity) return <LoadingComponent content={""} />; //cek apa ada activity, walau fix ada. ini mah cm bwt ngilangin errornya aja

    return(
        <Card fluid>
            {/* // fluid: ngambil sisa spacenya */}
            <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
            <Card.Content>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Meta>
                    <span>{activity.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activity.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
               <Button.Group widths={'2'}>
                {/* // klo 2, dia kefill sampe ujung */}
                    <Button as={Link} to={`/manage/${activity.id}`} basic color='blue' content='Edit'/>
                    {/* // klo basic, dia buttonnya ga fill */}
                    <Button as={Link} to={'/activities'} basic color='grey' content='Cancel'/>
               </Button.Group>
            </Card.Content>
        </Card>
    )
})