import * as React from 'react';
import { NavLink } from 'react-router-dom'
import './Header.css';
import { FaUsers, FaChevronRight } from 'react-icons/fa'

export interface HeaderProps {
    title: string;
}

class Header extends React.Component<HeaderProps, object> {

    buildSeparator() {
        if (this.props.children) {
            return (
                <FaChevronRight style={{ verticalAlign: 'middle', marginLeft: '4px', marginRight: '4px' }} />
            )
        }
    }

    render() {
        const { title } = this.props;

        return (
            <div className="Header">
                <div style={{ flex: '0 0 auto' }}>
                    <NavLink to="/organizations">
                        <FaUsers style={{ verticalAlign: 'middle' }} />
                        {' '}
                        Orgs
                    </NavLink>
                </div>
                <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {this.buildSeparator()}
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Header;