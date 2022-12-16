import { Component } from 'react';
// import { Route } from 'react-router-dom'
import './component.css';
// import { Menu } from 'antd';
// import { ClickParam } from 'antd/lib/menu';

interface MainMenuProps {
    buttons?: JSX.Element;
}

interface MainMenuState {
    currentMenuItem: string;
}

class MainMenu extends Component<MainMenuProps, MainMenuState> {
    constructor(props: MainMenuProps, context: React.Context<any>) {
        super(props);

        this.state = {
            currentMenuItem: 'myorgs'
        };
    }

    // onMenuSelection(e: ClickParam) {
    //     // this.setState({
    //     //     currentMenuItem: e.key
    //     // })
    //     // switch (e.key) {
    //     //     case 'myorgs':
    //     //         this.props.history.push('/dashboard')
    //     //     case 'allorgs':
    //     //         this.props.history.push('/organizations')
    //     // }
    // }


    // renderMenu() {
    //     return (
    //         <Route render={({ history, location }) => {
    //             let selectedKeys: Array<string> = [];
    //             switch (location.pathname) {
    //                 case '/organizations':
    //                     selectedKeys = ['allorgs'];
    //                     break;
    //                 case '/newOrganization':
    //                     selectedKeys = ['neworg'];
    //                     break;
    //             }
    //             return (
    //                 <Menu
    //                     // onClick={(e: ClickParam) => { doNavigate(e.key) }}
    //                     selectedKeys={selectedKeys}
    //                     style={{ backgroundColor: 'transparent' }}
    //                     mode="horizontal"
    //                 >
    //                     {/* <Menu.Item key="allorgs">
    //                         <Link to="/organizations">Browse &amp; Search</Link>
    //                     </Menu.Item> */}
    //                     {/* <Menu.Item key="neworg">
    //                         <Link to="/newOrganization">Create New Organization</Link>
    //                     </Menu.Item> */}
    //                 </Menu>
    //             );
    //         }} />
    //     );
    // }

    render() {
        // <div className="MainMenu-menu">
        //     {this.renderMenu()}
        // </div>
        return <div className="MainMenu">

            <div className="MainMenu-buttons">
                {this.props.buttons}
            </div>
        </div>;
    }
}

export default MainMenu;