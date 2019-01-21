import * as React from 'react'
import './UserInline.css'
import Avatar from '../entities/Avatar'
import * as userModel from '../../data/models/user'

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
        return (
            <a href={"/#people/" + this.props.user.username} target="_blank">
                <Avatar user={this.props.user} size={this.props.avatarSize || 20} />
                {' '}
                {this.props.user.realname}
            </a>
        )
    }
}

export default User