import { observer } from 'mobx-react-lite';
import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Dropdown, Image, Menu } from 'semantic-ui-react';
import { useStore } from '../stores/store';

// interface Props {
//     openForm: ()=>(void);
// }
export default observer(function NavBar() {
    const {userStore: {user, logout}} = useStore();
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
                <Menu.Item as={NavLink} to='/errors' name='Errors' />
                <Menu.Item>
                    <Button as={NavLink} to='/createActivity' positive content='Create Activity' /> 
                    {/* // postive gives green color */}
                </Menu.Item>
                <Menu.Item position='right'>
                    <Image src={user?.image || '/assets/user.png'} avatar spaced='right'></Image>
                    <Dropdown pointing='top left' text={user?.displayName}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to={`profiles/${user?.username}`} text='My Profile' icon='user'></Dropdown.Item>
                            <Dropdown.Item onClick={logout} text='Logout' icon='power'/>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
            </Container>
        </Menu>
    )
})