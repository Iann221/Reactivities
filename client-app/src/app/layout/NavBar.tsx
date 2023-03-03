import React from 'react';
import { Button, Container, Menu } from 'semantic-ui-react';
import { useStore } from '../stores/store';

// interface Props {
//     openForm: ()=>(void);
// }
export default function NavBar() {

    const {activityStore} = useStore();

    return (
        <Menu inverted fixed='top'>  
        {/* inverted: darker color plus fixed to the top */}
            <Container> 
                {/* for padding */}
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: 10}}/>
                    Reactivities
                </Menu.Item>
                <Menu.Item name='Activities' />
                <Menu.Item>
                    <Button onClick={() => activityStore.openForm()} positive content='Create Activity' /> 
                    {/* // postive gives green color */}
                </Menu.Item>
            </Container>
        </Menu>
    )
}