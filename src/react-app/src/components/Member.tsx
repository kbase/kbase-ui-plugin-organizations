import * as React from 'react'
import './Member.css'

import Avatar from './Avatar'
import * as types from '../types';
import { Icon } from 'antd';

export interface MemberProps {
    member: types.Member
    avatarSize?: number
}

interface MemberState {

}

class Member extends React.Component<MemberProps, MemberState> {
    constructor(props: MemberProps) {
        super(props)
    }

    renderRole() {
        switch (this.props.member.type) {
            case types.MemberType.OWNER:
                return (
                    <span>
                        <Icon type="crown" /> owner
                </span>
                )
            case types.MemberType.ADMIN:
                return (
                    <span>
                        <Icon type="unlock" /> admin
                </span>
                )
            case types.MemberType.MEMBER:
                return (
                    <span>
                        <Icon type="user" /> member
                </span>
                )
        }
    }

    render() {
        return (
            <div className="Member" >
                <div className="avatarCol">
                    <Avatar user={this.props.member.user} size={this.props.avatarSize || 30} />
                </div>
                <div className="infoCol">
                    <div className="name">
                        <a href={"#people/" + this.props.member.user.username} target="_blank">{this.props.member.user.realname}</a>
                        {' '}
                        ❨{this.props.member.user.username}❩
                    </div>
                    <div className="role">
                        {this.renderRole()}
                    </div>
                    <div className="title">
                        {this.props.member.user.title || <i>no title in user profile</i>}
                    </div>
                    <div className="organization">
                        {this.props.member.user.organization || <i>no organization in user profile</i>}
                    </div>
                    <div className="location">
                        {[this.props.member.user.city, this.props.member.user.state, this.props.member.user.country].filter(x => x).join(', ') || <i>no location information in user profile</i>}
                    </div>
                </div>
            </div>
        )
    }
}

export default Member