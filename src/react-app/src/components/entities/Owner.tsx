import * as React from 'react'
import './Owner.css'

import Avatar from './Avatar'
import { } from '../../types';
import { Icon } from 'antd';
import * as orgModel from '../../data/models/organization/model'
import * as userModel from '../../data/models/user'
import User from './UserContainer'

enum View {
    COMPACT = 0,
    NORMAL
}

export interface OwnerProps {
    // member: orgModel.Member
    user: userModel.User
    avatarSize?: number
}

interface OwnerState {
    view: View
}

function reverseView(v: View) {
    switch (v) {
        case View.COMPACT:
            return View.NORMAL
        case View.NORMAL:
            return View.COMPACT
    }
}

export default class Owner extends React.Component<OwnerProps, OwnerState> {
    constructor(props: OwnerProps) {
        super(props)

        this.state = {
            view: View.COMPACT
        }
    }

    onToggleView() {
        this.setState({
            view: reverseView(this.state.view)
        })
    }

    renderRole() {
        return (
            <span>
                <Icon type="crown" /> owner
        </span>
        )
    }

    renderCompact() {
        return (
            <div className="Owner View-COMPACT" >
                <div className="Owner-controlCol">
                    <a onClick={this.onToggleView.bind(this)}
                        className={`linkButton ${this.state.view === View.NORMAL ? "pressed" : ""}`}
                    >
                        <Icon type={`${this.state.view === View.NORMAL ? "up" : "down"}`} />
                    </a>
                </div>

                <div className="Owner-avatarCol">
                    <Avatar user={this.props.user} size={this.props.avatarSize || 30} />
                </div>
                <div className="Owner-infoCol">
                    <div className="Owner-name">
                        <a href={"/#people/" + this.props.user.username} target="_blank">{this.props.user.realname}</a>

                    </div>
                    <div className="Owner-username">
                        {this.props.user.username}
                    </div>
                </div>
            </div>
        )
    }

    renderNormal() {
        return (
            <div className="Owner View-NORMAL" >
                <div className="Owner-controlCol">
                    <a onClick={this.onToggleView.bind(this)}
                        className={`linkButton ${this.state.view === View.NORMAL ? "pressed" : ""}`}
                    >
                        <Icon type={`${this.state.view === View.NORMAL ? "up" : "down"}`} />
                    </a>
                </div>
                <div className="Owner-avatarCol">
                    <Avatar user={this.props.user} size={this.props.avatarSize || 30} />
                </div>
                <div className="Owner-infoCol">
                    <div className="Owner-name">
                        <a href={"/#people/" + this.props.user.username} target="_blank">{this.props.user.realname}</a>
                    </div>
                    <div className="Owner-username">
                        {this.props.user.username}
                    </div>
                    {/* <div className="role">
                        {this.renderRole()}
                    </div> */}
                    {/* <div className="joinedAt">
                        <span className="field-label">joined</span>{' '}{Intl.DateTimeFormat('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        }).format(this.props.member.joinedAt)}
                    </div> */}
                    <div className="Owner-title">
                        {this.props.user.title || <i>no title in user profile</i>}
                    </div>
                    <div className="Owner-organization">
                        {this.props.user.organization || <i>no organization in user profile</i>}
                    </div>
                    <div className="Owner-location">
                        {[this.props.user.city, this.props.user.state, this.props.user.country].filter(x => x).join(', ') || <i>no location information in user profile</i>}
                    </div>
                </div>

            </div>
        )
    }

    render() {
        switch (this.state.view) {
            case View.COMPACT:
                return this.renderCompact()

            case View.NORMAL:
                return this.renderNormal()
        }
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
    //                     <a href={"/#people/" + this.props.member.username} target="_blank">{this.props.user.realname}</a>
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

