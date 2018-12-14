import * as React from 'react'
import { NavLink } from 'react-router-dom'
import './Header.css'
import { FaUsers, FaChevronRight } from 'react-icons/fa'
import { Icon } from 'antd';

export interface HeaderProps {
    breadcrumbs: JSX.Element
    buttons?: JSX.Element
}

class Header extends React.Component<HeaderProps, object> {
    // <FaChevronRight style={{ verticalAlign: 'middle', marginLeft: '4px', marginRight: '4px' }} />
    buildSeparator() {
        if (this.props.breadcrumbs) {
            return (
                <Icon type="right" style={{ verticalAlign: 'middle', marginLeft: '4px', marginRight: '4px' }} />
            )
        }
    }

    render() {
        return (
            <div className="Header">
                <div className="defaultCrumbs">
                    <NavLink to="/">
                        <Icon type="team" style={{ verticalAlign: 'middle' }} />
                        {' '}
                        <span data-test="orgs-label">Orgs</span>
                    </NavLink>
                    {this.buildSeparator()}
                    {/* {this.buildSeparator()}
                    <NavLink to="/organizations">
                        <FaUsers style={{ verticalAlign: 'middle' }} />
                        {' '}
                        <span data-test="orgs-label">Orgs</span>
                    </NavLink> */}
                </div>
                <div className="userColumn">

                    <div className="breadcrumbs">
                        {this.props.breadcrumbs}
                    </div>
                    <div className="buttons">
                        {this.props.buttons}
                    </div>

                    {/* {this.props.children} */}
                </div>
            </div>
        )
    }
}

export default Header;