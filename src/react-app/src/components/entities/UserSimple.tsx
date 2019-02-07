import * as React from 'react'
import './UserSimple.css'
import Avatar from './Avatar'
import * as userModel from '../../data/models/user'
import { Tooltip } from 'antd';

export interface UserProps {
    user: userModel.User
    avatarSize?: number
}

interface UserState {
}

class User extends React.Component<UserProps, UserState> {
    constructor(props: UserProps) {
        super(props)
    }

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
        )
        return (
            <div className="UserSimple">
                <Tooltip title={tooltip} placement="bottomRight">
                    <a href={"/#people/" + this.props.user.username} target="_blank">{this.props.user.realname}</a>
                </Tooltip>
            </div>
        )
    }
}

export default User