import { NavLink } from 'react-router-dom';
import { Button, Container, Menu } from 'semantic-ui-react';

// interface Props {
//     openForm: ()=>(void);
// }
export default function NavBar() {
    return (
        <Menu inverted fixed='top'>  
        {/* inverted: darker color plus fixed to the top */}
            <Container> 
                {/* for padding */}
                <Menu.Item as={NavLink} to='/' header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: 10}}/>
                    Reactivities
                </Menu.Item>
                <Menu.Item as={NavLink} to='/activities' name='Activities' />
                <Menu.Item>
                    <Button as={NavLink} to='/createActivity' positive content='Create Activity' /> 
                    {/* // postive gives green color */}
                </Menu.Item>
            </Container>
        </Menu>
    )
}