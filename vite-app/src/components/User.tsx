import { Component } from 'react';
import './User.css';

import * as types from '../redux/store/types/common';
import Avatar from './entities/Avatar';
import UILink from './UILink';

export interface UserProps {
    user: types.User;
    avatarSize?: number;
}

interface UserState {

}

class User extends Component<UserProps, UserState> {
    render() {
        return <div className="User">
            <div className="avatarCol">
                <Avatar user={this.props.user} size={this.props.avatarSize || 30} />
            </div>
            <div className="infoCol">
                <div className="name">
                    <UILink hashPath={{pathname: `people/${this.props.user.username}`}}
                            newWindow={true}>
                        {this.props.user.realname} ❨{this.props.user.username}❩
                    </UILink>
                </div>
                <div className="organization">
                    {this.props.user.organization || <i>no organization in user profile</i>}
                </div>
                <div className="location">
                    {[this.props.user.city, this.props.user.state, this.props.user.country].filter(x => x).join(', ') || <i>no location information in user profile</i>}
                </div>
            </div>
        </div>
      
    }
}

export default User;
