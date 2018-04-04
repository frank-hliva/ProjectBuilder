import * as React from 'react';
import lang from '../../Core/LangManager';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import messenger from "../../App/Messenger";

type THeaderProps = {

}

type THeaderState = {
    
}

export class Header extends React.Component<THeaderProps, THeaderState>
{
    render() {
        return (
            <header>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/#">{lang.value.APP_BRAND}</a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav>
                            <NavItem eventKey={1} href="javascript:void(0)" onClick={() => messenger.success('Hello world')}>
                                Diár
                            </NavItem>
                            <NavItem eventKey={2} href="#">
                                Link
                            </NavItem>
                            <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
                                <MenuItem eventKey={3.1}>Action</MenuItem>
                                <MenuItem eventKey={3.2}>Another action</MenuItem>
                                <MenuItem eventKey={3.3}>Something else here</MenuItem>
                                <MenuItem divider />
                                <MenuItem eventKey={3.3}>Separated link</MenuItem>
                            </NavDropdown>
                        </Nav>
                        <Nav pullRight>
                            <NavItem eventKey={1} href="#">
                                Link Right
                            </NavItem>
                            <NavItem eventKey={2} href="#">
                                Link Right
                            </NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </header>
        )
    }
}