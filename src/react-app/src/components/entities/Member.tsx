import * as React from 'react'
import './Member.css'

import Avatar from './Avatar'
import { } from '../../types';
import { Icon } from 'antd';
import * as orgModel from '../../data/models/organization/model'
import * as userModel from '../../data/models/user'
import User from './UserContainer'

export interface MemberProps {
    member: orgModel.Member
    user: userModel.User
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
            case orgModel.MemberType.OWNER:
                return (
                    <span>
                        <Icon type="crown" /> owner
                </span>
                )
            case orgModel.MemberType.ADMIN:
                return (
                    <span>
                        <Icon type="unlock" /> admin
                </span>
                )
            case orgModel.MemberType.MEMBER:
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
                    <Avatar user={this.props.user} size={this.props.avatarSize || 30} />
                </div>
                <div className="infoCol">
                    <div className="name">
                        <a href={"#people/" + this.props.member.username} target="_blank">{this.props.user.realname}</a>
                        {' '}
                        ❨{this.props.user.username}❩
                    </div>
                    <div className="role">
                        {this.renderRole()}
                    </div>
                    <div className="joinedAt">
                        <span className="field-label">joined</span>{' '}{Intl.DateTimeFormat('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        }).format(this.props.member.joinedAt)}
                    </div>
                    <div className="title">
                        {this.props.user.title || <i>no title in user profile</i>}
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

    // render() {
    //     return (
    //         <div className="Member" >
    //             <div className="role">
    //                 {this.renderRole()}
    //             </div>

    //             <User userId={this.props.member.username} avatarSize={this.props.avatarSize || 30} />

    //             {/* <div className="avatarCol">
    //                 <Avatar user={this.props.user} size={this.props.avatarSize || 30} />
    //             </div>
    //             <div className="infoCol">
    //                 <div className="name">
    //                     <a href={"#people/" + this.props.member.username} target="_blank">{this.props.user.realname}</a>
    //                     {' '}
    //                     ❨{this.props.user.username}❩
    //                 </div>

    //                 <div className="title">
    //                     {this.props.user.title || <i>no title in user profile</i>}
    //                 </div>
    //                 <div className="organization">
    //                     {this.props.user.organization || <i>no organization in user profile</i>}
    //                 </div>
    //                 <div className="location">
    //                     {[this.props.user.city, this.props.user.state, this.props.user.country].filter(x => x).join(', ') || <i>no location information in user profile</i>}
    //                 </div>
    //             </div> */}
    //         </div>
    //     )
    // }
}

export default Member