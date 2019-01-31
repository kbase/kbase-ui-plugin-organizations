import * as React from 'react'

import Avatar from './Avatar'
import { } from '../../types';
import { Icon } from 'antd';
import * as orgModel from '../../data/models/organization/model'
import * as userModel from '../../data/models/user'

import './Member.css'

enum View {
    COMPACT = 0,
    NORMAL
}

export interface MemberProps {
    member: orgModel.Member
    user: userModel.User
    avatarSize?: number
}

interface MemberState {
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

class Member extends React.Component<MemberProps, MemberState> {
    constructor(props: MemberProps) {
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

    renderCompact() {
        return (
            <div className="Member View-COMPACT" >
                <div className="Member-controlCol">
                    <a onClick={this.onToggleView.bind(this)}
                        className={`linkButton ${this.state.view === View.NORMAL ? "pressed" : ""}`}
                    >
                        <Icon type={`${this.state.view === View.NORMAL ? "up" : "down"}`} />
                    </a>
                </div>
                <div className="Member-avatarCol">
                    <Avatar user={this.props.user} size={this.props.avatarSize || 30} />
                </div>
                <div className="Member-infoCol">
                    <div className="Member-name">
                        <a href={"/#people/" + this.props.member.username} target="_blank">{this.props.user.realname}</a>
                        {' '}
                        ❨{this.props.user.username}❩
                    </div>
                    <div className="Member-role">
                        {this.renderRole()}
                    </div>
                    <div className="Member-title">
                        {this.props.member.title || this.props.user.title}
                    </div>
                </div>
            </div>
        )
    }

    renderNormal() {
        return (
            <div className="Member View-NORMAL" >
                <div className="Member-controlCol">
                    <a onClick={this.onToggleView.bind(this)}
                        className={`linkButton ${this.state.view === View.NORMAL ? "pressed" : ""}`}
                    >
                        <Icon type={`${this.state.view === View.NORMAL ? "up" : "down"}`} />
                    </a>
                </div>
                <div className="Member-avatarCol">
                    <Avatar user={this.props.user} size={this.props.avatarSize || 30} />
                </div>
                <div className="Member-infoCol">
                    <div className="Member-name">
                        <a href={"/#people/" + this.props.member.username} target="_blank">{this.props.user.realname}</a>
                        {' '}
                        ❨{this.props.user.username}❩
                    </div>
                    <div className="Member-role">
                        {this.renderRole()}
                    </div>
                    <div className="Member-title">
                        {this.props.member.title || this.props.user.title}
                    </div>
                    <div className="Member-joinedAt">
                        <span className="field-label">joined</span>{' '}{Intl.DateTimeFormat('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        }).format(this.props.member.joinedAt)}
                    </div>

                    <div className="Member-organization">
                        {this.props.user.organization || <i>no organization in user profile</i>}
                    </div>
                    <div className="Member-location">
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
}

export default Member