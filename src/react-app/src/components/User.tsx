import * as React from 'react'
import './User.css'

import Avatar from './entities/Avatar'
import * as types from '../types';

export interface UserProps {
    user: types.User
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
            <div className="User">
                <div className="avatarCol">
                    <Avatar user={this.props.user} size={this.props.avatarSize || 30} />
                </div>
                <div className="infoCol">
                    <div className="name">
                        <a href={"/#people/" + this.props.user.username} target="_blank">{this.props.user.realname}</a>
                        {' '}
                        ❨{this.props.user.username}❩
                                </div>
                    <div className="organization">
                        {this.props.user.organization || <i>no organization in user profile</i>}
                    </div>
                    <div className="location">
                        {[this.props.user.city, this.props.user.state, this.props.user.country].filter(x => x).join(', ') || <i>no location information in user profile</i>}
                    </div>
                </div>
            </div>
        )
    }
}

export default User