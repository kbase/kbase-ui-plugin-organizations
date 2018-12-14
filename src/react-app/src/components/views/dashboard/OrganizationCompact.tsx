import * as React from 'react'

import * as organizationModel from '../../../data/models/organization/model'
import * as userModel from '../../../data/models/user'
import { NavLink } from 'react-router-dom';

import './OrganizationCompact.css'
import { Icon } from 'antd';

export interface OrganizationProps {
    organization: organizationModel.Organization
}

enum View {
    COMPACT = 0,
    NORMAL
}
interface OrganizationState {
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

export default class OrganizationCompact extends React.Component<OrganizationProps, OrganizationState> {
    constructor(props: OrganizationProps) {
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

    getAvatarUrl(org: organizationModel.Organization) {
        // const defaultImages = [
        //     'orgs-64.png',
        //     'unicorn-64.png'
        // ]
        // if (!org.gravatarHash) {
        //     return defaultImages[Math.floor(Math.random() * 2)]
        // }
        if (!org.gravatarHash) {
            return 'unicorn-64.png'
        }
        const gravatarDefault = 'identicon';

        return 'https://www.gravatar.com/avatar/' + org.gravatarHash + '?s=64&amp;r=pg&d=' + gravatarDefault;
    }

    renderAvatar(org: organizationModel.Organization) {
        return (
            <img style={{ width: 30, height: 30 }}
                src={this.getAvatarUrl(org)} />
        )
    }


    pluralize(count: number, singular: string, plural: string) {
        if (count === 0 || count > 1) {
            return plural
        }
        return singular
    }

    renderMemberCount(org: organizationModel.Organization) {
        return (
            <div className="memberCount">
                {org.members.length > 0 ? org.members.length : 'no'} {this.pluralize(org.members.length, 'member', 'members')}
            </div>
        )
    }

    renderNormal() {
        const org = this.props.organization
        return (
            <div className="OrganizationCompact" key={org.id}>
                <div className="avatarCol">
                    <NavLink to={`/viewOrganization/${org.id}`}>
                        {this.renderAvatar(org)}
                    </NavLink>
                </div>
                <div className="bodyCol">
                    <div className="orgName">
                        <NavLink to={`/viewOrganization/${org.id}`}>
                            {org.name}
                        </NavLink>
                    </div>
                    <div className="orgOwner">
                        <span className="field-label">owner</span>
                        <span className="field-value"><a href={"/#people/" + org.owner.username} target="_blank">{org.owner.username} ❨{org.owner.username}❩</a></span>

                    </div>
                    <div className="orgCreated">
                        <span className="field-label">established</span>
                        <span className="field-value">{Intl.DateTimeFormat('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        }).format(org.createdAt)}</span>
                    </div>
                </div>
                <div className="controlCol">
                    <a onClick={this.onToggleView.bind(this)}
                        className={`linkButton ${this.state.view === View.NORMAL ? "pressed" : ""}`}
                    >
                        <Icon type={`${this.state.view === View.NORMAL ? "up" : "down"}`} />
                    </a>
                </div>
            </div>
        )
    }

    renderCompact() {
        const org = this.props.organization
        return (
            <div className="OrganizationCompact" key={org.id}>
                <div className="avatarCol">
                    <NavLink to={`/viewOrganization/${org.id}`}>
                        {this.renderAvatar(org)}
                    </NavLink>
                </div>
                <div className="bodyCol">
                    <div className="orgName">
                        <NavLink to={`/viewOrganization/${org.id}`}>
                            {org.name}
                        </NavLink>
                    </div>

                </div>
                <div className="controlCol">
                    <a onClick={this.onToggleView.bind(this)}
                        className={`linkButton ${this.state.view === View.NORMAL ? "pressed" : ""}`}
                    >
                        <Icon type={`${this.state.view === View.NORMAL ? "up" : "down"}`} />
                    </a>
                </div>
            </div>
        )
    }

    render() {
        switch (this.state.view) {
            case View.COMPACT:
                return (
                    <div className="User View-COMPACT">
                        {this.renderCompact()}
                    </div>
                )
            case View.NORMAL:
                return (
                    <div className="User View-NORMAL">
                        {this.renderNormal()}
                    </div>
                )
        }
    }
}
