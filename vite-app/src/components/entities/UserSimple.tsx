import { Tooltip } from 'antd';
import { Component } from 'react';
import * as userModel from '../../data/models/user';
import { europaLink } from '../../lib/euoropa';
import Avatar from './Avatar';
import './UserSimple.css';

export interface UserProps {
    user: userModel.User;
    avatarSize?: number;
}

interface UserState {
}

class User extends Component<UserProps, UserState> {
    render() {
        const tooltip = (
            <div>
                <div>
                    {this.props.user.realname}
                </div>
                <div>
                    <span><Avatar user={this.props.user} size={20} /></span>
                    {' '}
                    <span>{this.props.user.username}</span>
                </div>
            </div>
        );
        return (
            <div className="UserSimple">
                <Tooltip title={tooltip} placement="bottomRight">
                    {europaLink({hash: `people/${this.props.user.username}`}, this.props.user.realname, {newWindow: true})}
                    {/* <a href={"/#people/" + this.props.user.username} target="_blank" rel="noopener noreferrer">{this.props.user.realname}</a> */}
                </Tooltip>
            </div>
        );
    }
}

export default User;