import * as React from 'react'

import * as orgModel from '../../../data/models/organization/model'
import { NavLink } from 'react-router-dom';

import './OrganizationCompact.css'
import { Icon } from 'antd';
import OrgLogo from '../../OrgLogo';
import Owner from '../../entities/OwnerContainer';

export interface OrganizationProps {
    organization: orgModel.Organization | orgModel.InaccessiblePrivateOrganization
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

    renderLogo(org: orgModel.Organization) {
        return (
            <OrgLogo logoUrl={org.logoUrl} size={32} organizationName={org.name} organizationId={org.id} />
        )
    }


    pluralize(count: number, singular: string, plural: string) {
        if (count === 0 || count > 1) {
            return plural
        }
        return singular
    }

    renderMemberCount(org: orgModel.Organization) {
        return (
            <div className="memberCount">
                {org.members.length > 0 ? org.members.length : 'no'} {this.pluralize(org.members.length, 'member', 'members')}
            </div>
        )
    }

    renderNormal(org: orgModel.Organization) {
        return (
            <div className="OrganizationCompact" key={org.id}>
                <div className="controlCol">
                    <a onClick={this.onToggleView.bind(this)}
                        className={`linkButton ${this.state.view === View.NORMAL ? "pressed" : ""}`}
                    >
                        <Icon type={`${this.state.view === View.NORMAL ? "up" : "down"}`} />
                    </a>
                </div>
                <div className="avatarCol">
                    <NavLink to={`/viewOrganization/${org.id}`}>
                        {this.renderLogo(org)}
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
                        <span>
                            <Owner username={org.owner.username} avatarSize={30} />
                        </span>
                        {/* <span className="field-value"><a href={"/#people/" + org.owner.username} target="_blank">{org.owner.username} ❨{org.owner.username}❩</a></span> */}
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

            </div>
        )
    }

    renderCompact(org: orgModel.Organization) {
        return (
            <div className="OrganizationCompact" key={org.id}>
                <div className="controlCol">
                    <a onClick={this.onToggleView.bind(this)}
                        className={`linkButton ${this.state.view === View.NORMAL ? "pressed" : ""}`}
                    >
                        <Icon type={`${this.state.view === View.NORMAL ? "up" : "down"}`} />
                    </a>
                </div>
                <div className="avatarCol">
                    <NavLink to={`/viewOrganization/${org.id}`}>
                        {this.renderLogo(org)}
                    </NavLink>
                </div>
                <div className="bodyCol">
                    <div className="orgName">
                        <NavLink to={`/viewOrganization/${org.id}`}>
                            {org.name}
                        </NavLink>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const org = this.props.organization
        if (org.kind !== orgModel.OrganizationKind.NORMAL) {
            return (
                <div>
                    Private Organization
                </div>
            )
        }
        switch (this.state.view) {
            case View.COMPACT:
                return (
                    <div className="User View-COMPACT">
                        {this.renderCompact(org)}
                    </div>
                )
            case View.NORMAL:
                return (
                    <div className="User View-NORMAL">
                        {this.renderNormal(org)}
                    </div>
                )
        }
    }
}
