import { observer } from "mobx-react-lite";
import { ChangeEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Form, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";
import {v4 as uuid} from 'uuid';

export default observer(function ActivityForm() {
    const {activityStore} = useStore();
    const {createActivity, updateActivity, 
        loading, loadActivity, loadingInitial} = activityStore;
    const {id} = useParams();
    const navigate = useNavigate();

    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    });

    useEffect(() => {
        if(id) loadActivity(id).then((activity) => setActivity(activity!))
    }, [id, loadActivity]);

    function handleSubmit(){
                // walau activity.id='', tetap dihitung !activity.id
        if (!activity.id) {
            activity.id = uuid();
            createActivity(activity).then(() => navigate(`/activities/${activity.id}`))
        } else {
            updateActivity(activity).then(() => navigate(`/activities/${activity.id}`))
        }
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = event.target;
        setActivity({...activity, [name]: value});
        // pecah activity dulu, terus key dengan nama sama dengan name akan menjadi value ini
    }

    if (loadingInitial) return <LoadingComponent content='loading activity...'></LoadingComponent>

    return(
        <Segment clearing>
            {/* dia include konten yang floated */}
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange}></Form.Input>
                <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleInputChange}></Form.TextArea>
                <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleInputChange}></Form.Input>
                <Form.Input type='date' placeholder='Date' value={activity.date} name='date' onChange={handleInputChange}></Form.Input>
                <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleInputChange}></Form.Input>
                <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange}></Form.Input>
                <Button loading={loading} onClick={handleSubmit} floated='right' positive type='submit' content='Submit'/>
                <Button as={Link} to='/activities' floated='right' type='button' content='Cancel'/>
            </Form>
        </Segment>
    )
})