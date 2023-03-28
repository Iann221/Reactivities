import { Container} from 'semantic-ui-react';
import NavBar from './NavBar';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import { Fragment, useEffect } from 'react';
import { ToastContainer} from 'react-toastify';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';

function App() {
  // cuma ambil activityStore aja
  // const {activityStore} = useStore();

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
  const {commonStore, userStore} = useStore();

  useEffect(() => {
    if (commonStore.token){
      userStore.getUser().finally(() => commonStore.setApploaded())
    } else {
      commonStore.setApploaded()
    }
  }, [commonStore, userStore])

  if(!commonStore.appLoaded) return <LoadingComponent content='Loading app...' />

  return (
    <div>
        <ScrollRestoration />
        <ModalContainer />
        <ToastContainer position='bottom-right' hideProgressBar theme='colored' />
        {location.pathname === '/' ? <HomePage /> : (
          <>
          <NavBar/>
        <Container style={{marginTop: '7em'}}>
          {/* <h2>{activityStore.title}</h2>
          <Button onClick={activityStore.setTitle}>add exclamation</Button> */}
          {/* <ActivityDashboard /> */}
          <Outlet />
          {/* // kalo pake router, outlet akan berubah tergantung routenya */}
        </Container> 
          </>
        )} 
    </div>
  );
}

export default observer(App);
