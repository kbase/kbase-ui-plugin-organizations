import { Component } from 'react';
import './Header.css';
// import { ClickParam } from 'antd/lib/menu';
import { RightOutlined } from '@ant-design/icons';

export interface HeaderProps {
    breadcrumbs: JSX.Element;
    buttons?: JSX.Element;
    test?: string;
    // history: History.History
}

interface HeaderState {
    currentMenuItem: string;
}


class Header extends Component<HeaderProps, HeaderState> {

    constructor(props: HeaderProps, context: React.Context<any>) {
        super(props);

        this.state = {
            currentMenuItem: 'myorgs'
        };
    }
    // <FaChevronRight style={{ verticalAlign: 'middle', marginLeft: '4px', marginRight: '4px' }} />
    buildSeparator() {
        if (this.props.breadcrumbs) {
            return (
                <RightOutlined style={{ verticalAlign: 'middle', marginLeft: '4px', marginRight: '4px' }} />
            );
        }
    }

    // onMenuSelection(e: ClickParam) {
    //     // this.setState({
    //     //     currentMenuItem: e.key
    //     // })
    //     // switch (e.key) {
    //     //     case 'allorgs':
    //     //         this.props.history.push('/organizations')
    //     // }
    // }

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
        );
    }
}

export default Header;