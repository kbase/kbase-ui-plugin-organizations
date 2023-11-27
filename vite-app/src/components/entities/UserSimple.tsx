import { Tooltip } from 'antd';
import { Component } from 'react';
import * as userModel from '../../data/models/user';
import UILink from '../UILink';
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
                    <UILink
                        hashPath={{hash: `people/${this.props.user.username}`}}
                        newWindow={true}
                    >
                        {this.props.user.realname}
                    </UILink>
                </Tooltip>
            </div>
        );
    }
}

export default User;