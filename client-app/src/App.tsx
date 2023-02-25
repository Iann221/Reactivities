import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { ducks } from './demo';
import DuckItem from './DuckItem';
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';

function App() {
  const [activities, setActivities] = useState<any>([]);

  useEffect(() => { // what we want to do when our app loads up
    axios.get('http://localhost:5000/api/activities')
    .then(response => {
      console.log('response '+response.data);
      setActivities(response.data);
    })
  }, []) // [] tu dependency agar ga manggil useEffect berkali setelah loaded

  return (
    <div>
      <Header as='h2' icon='users' content='Reactivities'/>
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <List>
          {activities.map((activity: any) => {
            return(
            <List.Item key={activity.id}>{activity.title}</List.Item>
            );
          })}
        </List>
        {/* <>
          {ducks.map(duck => {
            return <DuckItem duck={duck} key={duck.name} />
          })}
        </> */}
        {/* <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
    </div>
  );
}

export default App;
