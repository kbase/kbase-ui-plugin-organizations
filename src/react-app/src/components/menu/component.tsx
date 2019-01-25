import * as React from 'react'
import { NavLink, withRouter, Route, Link } from 'react-router-dom'
import './component.css'
import { Icon, Menu } from 'antd';
import { ClickParam } from 'antd/lib/menu'

interface MainMenuProps {
    // currentItem: string
}

interface MainMenuState {
    currentMenuItem: string
}

class MainMenu extends React.Component<MainMenuProps, MainMenuState> {
    constructor(props: MainMenuProps, context: React.Context<any>) {
        super(props)

        this.state = {
            currentMenuItem: 'myorgs'
        }
    }

    onMenuSelection(e: ClickParam) {
        // this.setState({
        //     currentMenuItem: e.key
        // })
        // console.log('here', e.key)
        // switch (e.key) {
        //     case 'myorgs':
        //         this.props.history.push('/dashboard')
        //     case 'allorgs':
        //         this.props.history.push('/organizations')
        // }
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

    renderMenu3() {
        return withRouter(({ history }) => {
            function doNavigate(key: string) {
                switch (key) {
                    case 'myorgs':
                        history.push('/dashboard')
                    case 'allorgs':
                        history.push('/organizations')
                }
            }
            return (
                <Menu
                    onClick={(e: ClickParam) => { doNavigate(e.key) }}
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
        })
    }

    renderMenu4() {
        return (
            <Route render={({ history, location }) => {
                function doNavigate(key: string) {
                    console.log('navigate to ...', key)
                    switch (key) {
                        case 'myorgs':
                            console.log('my orgs?', key, history)
                            history.push('/dashboard')
                        case 'allorgs':
                            history.push('/organizations')
                    }
                }
                let selectedKeys: Array<string> = []
                switch (location.pathname) {
                    case '/dashboard':
                        selectedKeys = ['myorgs']
                        break
                    case '/organizations':
                        selectedKeys = ['allorgs']
                        break
                }
                return (
                    <Menu
                        onClick={(e: ClickParam) => { doNavigate(e.key) }}
                        selectedKeys={selectedKeys}
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
            }} />
        )
    }

    renderMenu6() {
        return (
            <Route render={({ history, location }) => {
                function doNavigate(key: string) {
                    console.log('navigate to ...', key)
                    switch (key) {
                        case 'myorgs':
                            console.log('my orgs?', key, history)
                            history.push('/dashboard')
                        case 'allorgs':
                            history.push('/organizations')
                    }
                }
                let selectedKeys: Array<string> = []
                switch (location.pathname) {
                    case '/dashboard':
                        selectedKeys = ['myorgs']
                        break
                    case '/organizations':
                        selectedKeys = ['allorgs']
                        break
                    case '/newOrganization':
                        selectedKeys = ['neworg']
                        break
                }
                return (
                    <Menu
                        // onClick={(e: ClickParam) => { doNavigate(e.key) }}
                        selectedKeys={selectedKeys}
                        mode="horizontal"
                    >
                        {/* <Menu.Item key="myorgs">
                            <Link to="/dashboard">My Organizations</Link>
                        </Menu.Item> */}
                        <Menu.Item key="allorgs">
                            <Link to="/organizations">Organizations</Link>
                        </Menu.Item>
                        <Menu.Item key="neworg">
                            <Link to="/newOrganization">Create New Organization</Link>
                        </Menu.Item>
                    </Menu>
                )
            }} />
        )
    }

    renderMenu5() {
        return (
            <React.Fragment>
                {/* <span style={{ padding: '4px', marginRight: '4px' }}>
                    <NavLink to="/">
                        <span data-test="orgs-label">My Organizations</span>
                    </NavLink>

                </span> */}
                <span style={{ padding: '4px', marginRight: '4px', marginLeft: '4px' }}>
                    <NavLink to="/organizations">
                        <span data-test="orgs-label">Organizations</span>
                    </NavLink>
                </span>
                <span style={{ padding: '4px', marginRight: '4px', marginLeft: '4px' }}>
                    <NavLink to="/newOrganization">
                        <span data-test="orgs-label">Create New Organization</span>
                    </NavLink>
                </span>
            </React.Fragment>
        )
    }

    render() {
        return (
            <div className="MainMenu">
                <div className="MainMenu-menu">
                    {this.renderMenu6()}
                </div>
            </div>
        )
    }
}

export default MainMenu;