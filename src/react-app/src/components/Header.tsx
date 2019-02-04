import * as React from 'react'
import { NavLink, withRouter, Route } from 'react-router-dom'
import './Header.css'
import { Icon, Menu } from 'antd';
import { ClickParam } from 'antd/lib/menu'

export interface HeaderProps {
    breadcrumbs: JSX.Element
    buttons?: JSX.Element
    test?: string
    // history: History.History
}

interface HeaderState {
    currentMenuItem: string
}

interface MenuProps {
    currentItem: string
}
// const TopMenu = withRouter<MenuProps>(({ history }) => {
//         function doNavigate(key: string) {
//             switch (key) {
//                 case 'myorgs':
//                     history.push('/dashboard')
//                 case 'allorgs':
//                     history.push('/organizations')
//             }
//         }
//         return (
//             <Menu
//                 onClick={(e: ClickParam) => { doNavigate(e.key) }}
//                 selectedKeys={[this.state.currentMenuItem]}
//                 mode="horizontal"
//             >
//                 <Menu.Item key="myorgs">
//                     My Organizations
//                 </Menu.Item>
//                 <Menu.Item key="allorgs">
//                     All Organizations
//                 </Menu.Item>
//             </Menu>
//         )
//     })
// }

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
        // switch (e.key) {
        //     case 'allorgs':
        //         this.props.history.push('/organizations')
        // }
    }

    render() {
        return (
            <div className="Header">
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