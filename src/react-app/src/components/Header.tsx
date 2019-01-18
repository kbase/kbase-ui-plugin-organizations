import * as React from 'react'
import { NavLink } from 'react-router-dom'
import './Header.css'
import { FaUsers, FaChevronRight } from 'react-icons/fa'
import { Icon, Menu } from 'antd';
import { ClickParam } from 'antd/lib/menu';

export interface HeaderProps {
    breadcrumbs: JSX.Element
    buttons?: JSX.Element
}

interface HeaderState {
    currentMenuItem: string
}

class Header extends React.Component<HeaderProps, HeaderState> {

    constructor(props: HeaderProps, context: React.Context<any>) {
        super(props)

        this.state = {
            currentMenuItem: 'myorgs'
        }
    }
    // <FaChevronRight style={{ verticalAlign: 'middle', marginLeft: '4px', marginRight: '4px' }} />
    buildSeparator() {
        if (this.props.breadcrumbs) {
            return (
                <Icon type="right" style={{ verticalAlign: 'middle', marginLeft: '4px', marginRight: '4px' }} />
            )
        }
    }

    onMenuSelection(e: ClickParam) {
        // this.setState({
        //     currentMenuItem: e.key
        // })
        console.log('here', e.key)
        switch (e.key) {
            case 'myorgs':
                window.history.pushState(null, 'Dashboard', '/dashboard')
            case 'allorgs':
                window.history.pushState(null, 'All Orgs', '/organizations')
        }
    }

    renderMenu() {
        return (
            <Menu
                onClick={this.onMenuSelection.bind(this)}
                selectedKeys={[this.state.currentMenuItem]}
                mode="horizontal"
            >
                <Menu.Item key="myorgs">
                    My Organizations
                </Menu.Item>
                <Menu.Item key="allorgs">
                    All Organizations
                </Menu.Item>
            </Menu>
        )
    }

    rederMenu2() {
        return (
            <div>
                <span style={{ padding: '4px', marginRight: '4px' }}>
                    <NavLink to="/">
                        <span data-test="orgs-label">My Organizations</span>
                    </NavLink>

                </span>
                <span style={{ padding: '4px', marginRight: '4px', marginLeft: '4px' }}>
                    <NavLink to="/organizations">
                        <span data-test="orgs-label">All Organizations</span>
                    </NavLink>
                </span>
            </div>
        )
    }

    render() {
        return (
            <div className="Header">
                <div className="Header-menu">
                    {this.rederMenu2()}
                    {/* <NavLink to="/">
                        <span data-test="orgs-label">My Organizations</span>
                    </NavLink>

                    <NavLink to="/organizations">
                        <span data-test="orgs-label">All Organizations</span>
                    </NavLink> */}
                </div>
                <div className="Header-contextual">

                    <div className="Header-userColumn">

                        <div className="Header-breadcrumbs">
                            {this.props.breadcrumbs}
                        </div>
                        <div className="Header-buttons">
                            {this.props.buttons}
                        </div>

                        {/* {this.props.children} */}
                    </div>
                </div>
            </div>
        )
    }
}

export default Header;