import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { ActivityFormValues } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";
import {v4 as uuid} from 'uuid';
import { Formik, Form } from "formik";
import * as Yup from 'yup';
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOption } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";

export default observer(function ActivityForm() {
    const {activityStore} = useStore();
    const {createActivity, updateActivity, 
         loadActivity, loadingInitial} = activityStore;
    const {id} = useParams();
    const navigate = useNavigate();

    // before activity punya attendee:
    // const [activity, setActivity] = useState<Activity>({
    //     id: '',
    //     title: '',
    //     category: '',
    //     description: '',
    //     date: null,
    //     city: '',
    //     venue: ''
    // });

    // after activity punya attendee:
    const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

    // isi rule validationnya
    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required'),
        description: Yup.string().required(),
        category: Yup.string().required(),
        date: Yup.string().required('Date is required').nullable(),
        city: Yup.string().required(),
        venue: Yup.string().required()
    })

    useEffect(() => {
        if(id) loadActivity(id).then((activity) => setActivity(new ActivityFormValues(activity))) 
    }, [id, loadActivity]); // yeah tipe Activity bisa diterima di ActivityFormValues asalkan tipenya mirip

    function handleFormSubmit(activity: ActivityFormValues){
                // walau activity.id='', tetap dihitung !activity.id
        if (!activity.id) {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(activity).then(() => navigate(`/activities/${newActivity.id}`))
        } else {
            updateActivity(activity).then(() => navigate(`/activities/${activity.id}`))
        }
    }

    // function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    //     const {name, value} = event.target;
    //     setActivity({...activity, [name]: value});
    //     // pecah activity dulu, terus key dengan nama sama dengan name akan menjadi value ini
    // }

    if (loadingInitial) return <LoadingComponent content='loading activity...'></LoadingComponent>

    return(
        <Segment clearing>
            {/* dia include konten yang floated */}
            <Header content='Activity Details' sub color='teal' />
            <Formik 
            validationSchema={validationSchema}
            enableReinitialize initialValues={activity} onSubmit={values => handleFormSubmit(values)}>
                {/* // enableReinitialize, dia ngeload lgi klo ngelakuin setState */}
                {({handleSubmit, isValid, isSubmitting, dirty}) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <MyTextInput name='title' placeholder="Title"></MyTextInput>
                    <MyTextArea placeholder='Description' name='description' rows={3}></MyTextArea>
                    <MySelectInput placeholder='Category' name='category' options={categoryOption}></MySelectInput>
                    <MyDateInput 
                        placeholderText='Date'  
                        name='date' 
                        showTimeSelect
                        timeCaption="time"
                        dateFormat='MMMM d, yyyy h:mm aa'
                    ></MyDateInput>
                    <Header content='Location Details' sub color='teal' />
                    <MyTextInput placeholder='City'  name='city' ></MyTextInput>
                    <MyTextInput placeholder='Venue'  name='venue' ></MyTextInput>
                    <Button 
                        disabled={isSubmitting || !dirty || !isValid}
                        loading={isSubmitting} floated='right' 
                        positive type='submit' content='Submit'/>
                    <Button as={Link} to='/activities' floated='right' type='button' content='Cancel'/>
                </Form>
                )} 
                {/* // get property values dan handlechange aja utk dipass ke form */}
            </Formik>  
        </Segment>
    )
})