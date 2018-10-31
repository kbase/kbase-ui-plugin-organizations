import * as React from 'react';
import {NavLink} from 'react-router-dom'
import './Header.css';
import {FaUsers} from 'react-icons/fa'

export interface HeaderProps {
    title: string;
}

class Header extends React.Component<HeaderProps, object> {
    render() {
        const {title} = this.props;

        return (
            <div className="Header">
                <NavLink to="/organizations">
                <FaUsers />
                {' '}
                Orgs
                </NavLink>
            </div>
        )
    }
}

export default Header;