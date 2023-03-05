import { Container} from 'semantic-ui-react';
import NavBar from './NavBar';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import { Fragment } from 'react';

function App() {
  // cuma ambil activityStore aja
  const {activityStore} = useStore();

  

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

  const location = useLocation()

  return (
    <div>
        {location.pathname === '/' ? <HomePage /> : (
          <>
          <NavBar/>
        <Container style={{marginTop: '7em'}}>
          {/* <h2>{activityStore.title}</h2>
          <Button onClick={activityStore.setTitle}>add exclamation</Button> */}
          {/* <ActivityDashboard /> */}
          <Outlet />
          {/* // kalo pake router, outlet akan berubha tergantung routenya */}
        </Container> 
          </>
        )} 
    </div>
  );
}

export default observer(App);
