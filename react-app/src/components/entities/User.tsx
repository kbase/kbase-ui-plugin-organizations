import * as React from 'react';
import './User.css';
import Avatar from './Avatar';
import * as userModel from '../../data/models/user';
import { Icon, Button } from 'antd';

export interface UserProps {
    user: userModel.User;
    avatarSize?: number;
}

enum View {
    COMPACT = 0,
    NORMAL
}

interface UserState {
    view: View;
}

function reverseView(v: View) {
    switch (v) {
        case View.COMPACT:
            return View.NORMAL;
        case View.NORMAL:
            return View.COMPACT;
    }
}

// function viewLabel(v: View) {
//     switch (v) {
//         case View.COMPACT:
//             return 'Compact';
//         case View.NORMAL:
//             return 'Normal';
//     }
// }

class User extends React.Component<UserProps, UserState> {
    constructor(props: UserProps) {
        super(props);

        this.state = {
            view: View.COMPACT
        };
    }

    onToggleView() {
        this.setState({
            view: reverseView(this.state.view)
        });
    }

    renderCompact() {
        return (
            <React.Fragment>
                <div className="controlCol">
                    <Button
                        type="link"
                        size="small"
                        onClick={this.onToggleView.bind(this)}
                    >
                        <Icon type={`${this.state.view === View.NORMAL ? "up" : "down"}`} />
                    </Button>
                </div>
                <div className="avatarCol">
                    <Avatar user={this.props.user} size={this.props.avatarSize || 30} />
                </div>
                <div className="infoCol">
                    <div className="name">
                        <a href={"/#people/" + this.props.user.username} target="_blank" rel="noopener noreferrer">{this.props.user.realname}</a>
                    </div>
                    <div>
                        {this.props.user.username}
                    </div>
                </div>
            </React.Fragment>
        );
    }

    renderNormal() {
        return (
            <React.Fragment>
                <div className="controlCol">
                    <Button
                        type="link"
                        size="small"
                        onClick={this.onToggleView.bind(this)}
                    >
                        <Icon type={`${this.state.view === View.NORMAL ? "up" : "down"}`} />
                    </Button>
                </div>
                <div className="avatarCol">
                    <Avatar user={this.props.user} size={this.props.avatarSize || 30} />
                </div>
                <div className="infoCol">
                    <div className="name">
                        <a href={"/#people/" + this.props.user.username} target="_blank" rel="noopener noreferrer">{this.props.user.realname}</a>
                    </div>
                    <div>
                        {this.props.user.username}
                    </div>
                    <div className="organization">
                        {this.props.user.organization || <i>no organization in user profile</i>}
                    </div>
                    <div className="location">
                        {[this.props.user.city, this.props.user.state, this.props.user.country].filter(x => x).join(', ') || <i>no location information in user profile</i>}
                    </div>
                </div>
            </React.Fragment>
        );
    }

    render() {
        switch (this.state.view) {
            case View.COMPACT:
                return (
                    <div className="User View-COMPACT">
                        {this.renderCompact()}
                    </div>
                );
            case View.NORMAL:
                return (
                    <div className="User View-NORMAL">
                        {this.renderNormal()}
                    </div>
                );
        }
    }
}

export default User;