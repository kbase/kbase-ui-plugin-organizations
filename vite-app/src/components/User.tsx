import { Component } from 'react';
import './User.css';

import { europaLink } from '../lib/euoropa';
import * as types from '../redux/store/types/common';
import Avatar from './entities/Avatar';

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
                    {europaLink({hash: `people/${this.props.user.username}`}, `${this.props.user.realname} ❨${this.props.user.username}❩`, {newWindow: true} )}
                    {/* <a href={"/#people/" + this.props.user.username} target="_blank" rel="noopener noreferrer">{this.props.user.realname}</a>
                    {' '}
                    ❨{this.props.user.username}❩
                            </div> */}
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
