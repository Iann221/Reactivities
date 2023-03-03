import React, { useEffect, useState } from 'react';
import { Container} from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {
  // cuma ambil activityStore aja
  const {activityStore} = useStore();

  useEffect(() => { // what we want to do when our app loads up
    activityStore.loadActivities();
  }, [activityStore]) // [] tu dependency agar ga manggil useEffect berkali setelah loaded

  // function handleSelectActivity(id: string) {
  //   setSelectedActivity(activities.find(x => x.id === id));
  // }

  // function handleCancelSelectActivity() {
  //   setSelectedActivity(undefined);
  // }

  // function handleFormOpen(id? : string){
  //   id ? handleSelectActivity(id) : handleCancelSelectActivity();
  //   setEditMode(true);
  // }

  // function handleFormClose(){
  //   setEditMode(false);
  // }

  // function handleCreateOrEditActivity(activity: Activity){
  //   setSubmitting(true);
  //   if(activity.id){
  //     agent.Activities.update(activity).then(() => {
  //       setActivities([...activities.filter(x => x.id !== activity.id),activity]);
  //       setSelectedActivity(activity);
  //       setEditMode(false);
  //       setSubmitting(false);
  //     })
  //   } else {
  //     activity.id = uuid();
  //     agent.Activities.create(activity).then(() => {
  //       setActivities([...activities, activity]);
  //       setSelectedActivity(activity);
  //       setEditMode(false);
  //       setSubmitting(false);
  //     });
  //   }
  // }

  // function handleDeleteActivity(id: string) {
  //   setSubmitting(true);
  //   agent.Activities.delete(id).then(() => {
  //     setActivities([...activities.filter(x => x.id !== id)])
  //     setSubmitting(false);
  //   })
  // }

  if(activityStore.loadingInitial) return <LoadingComponent content='Loading app'/>

  return (
    <>
        <NavBar/>
        <Container style={{marginTop: '7em'}}>
          {/* <h2>{activityStore.title}</h2>
          <Button onClick={activityStore.setTitle}>add exclamation</Button> */}
          <ActivityDashboard />
        </Container>  
    </>
  );
}

export default observer(App);
