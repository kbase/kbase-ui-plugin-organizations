import * as React from 'react'
import * as orgModel from '../../../data/models/organization/model'
import './BriefOrganization.css'
import { NavLink } from 'react-router-dom';
import OrgLogo from '../../OrgLogo';
import { Icon, Tooltip } from 'antd';
import Owner from '../../entities/OwnerContainer';
import { ComponentView } from '../../../types';

export interface BriefOrganizationProps {
    organization: orgModel.BriefOrganization
    lastVisitedAt: Date | null
}

interface BriefOrganizationState {
    view: ComponentView
}

function reverseView(v: ComponentView) {
    switch (v) {
        case ComponentView.COMPACT:
            return ComponentView.NORMAL
        case ComponentView.NORMAL:
            return ComponentView.COMPACT
    }
}

export default class BriefOrganization extends React.Component<BriefOrganizationProps, BriefOrganizationState> {
    constructor(props: BriefOrganizationProps) {
        super(props)

        this.state = {
            view: ComponentView.COMPACT
        }
    }

    onToggleView() {
        this.setState({
            view: reverseView(this.state.view)
        })
    }

    renderLogo(org: orgModel.BriefOrganization) {
        return (
            <OrgLogo logoUrl={org.logoUrl} size={64} organizationName={org.name} organizationId={org.id} />
        )
    }

    renderHomeUrl(org: orgModel.BriefOrganization) {
        if (!org.homeUrl) {
            return
        }
        return (
            <div className="BriefOrganization-homeUrl">
                <a href={org.homeUrl} target="_blank">
                    <Icon type="home" />
                    {' '}
                    {org.homeUrl}
                </a>
            </div>
        )
    }

    renderNarrativeCount(org: orgModel.BriefOrganization) {
        if (!org.narrativeCount) {
            return (
                <span style={{ color: 'gray' }}>
                    Ø
                </span>
            )
        }
        return (
            <span>
                {org.narrativeCount}
            </span>
        )
    }

    renderMemberCount(org: orgModel.BriefOrganization) {
        if (!org.memberCount) {
            return (
                <span style={{ color: 'gray' }}>
                    Ø
                </span>
            )
        }
        return (
            <span>
                {org.memberCount}
            </span>
        )
    }

    renderRelation(org: orgModel.BriefOrganization) {
        switch (org.relation) {
            case (orgModel.UserRelationToOrganization.NONE):
                return (
                    <span>
                        <Icon type="stop" />
                        {' '}
                        You are <b>not a member</b> of this organization
                    </span>
                )
            case (orgModel.UserRelationToOrganization.VIEW):
                return (
                    <Tooltip
                        placement="bottomRight"
                        mouseEnterDelay={0.5}
                        title="You are not a member of this org, but you may access it; you may request membership"
                    >
                        <span><Icon type="stop" /> You are not a member - view organization to join</span>
                    </Tooltip>
                )
            case (orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING):
                return (<span><Icon type="user" style={{ color: 'orange' }} /> Your membership <b>request</b> is pending</span>)
            case (orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING):
                return (<span><Icon type="user" style={{ color: 'blue' }} /> You have been <b>invited</b> to join</span>)
            case (orgModel.UserRelationToOrganization.MEMBER):
                return (<span><Icon type="user" /> You are a <b>member</b> of this organization</span>)
            case (orgModel.UserRelationToOrganization.ADMIN):
                return (<span><Icon type="unlock" /> You are an <b>admin</b> of this organization</span>)
            case (orgModel.UserRelationToOrganization.OWNER):
                return (
                    <Tooltip
                        placement="bottomRight"
                        mouseEnterDelay={0.5}
                        title="You own this org"
                    >
                        <span><Icon type="crown" /> You are the <b>owner</b> of this Organization</span>
                    </Tooltip>
                )
        }
    }

    renderNormal() {
        const org = this.props.organization
        return (
            <div className="BriefOrganization">
                <div className="BriefOrganization-body">
                    <div className="BriefOrganization-freshnessCol">
                        {this.renderFreshness(org)}
                    </div>
                    <div className="BriefOrganization-logoCol">
                        <NavLink to={`/viewOrganization/${org.id}`}>
                            {this.renderLogo(org)}
                        </NavLink>
                    </div>
                    <div className="BriefOrganization-infoCol">
                        <div className="BriefOrganization-infoCol-row">
                            <div className="BriefOrganization-infoCol-col1">
                                <div className="BriefOrganization-orgName BriefOrganization-infoTableRow">
                                    <NavLink to={`/viewOrganization/${org.id}`}>
                                        {org.name}
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                        <div className="BriefOrganization-infoCol-row">
                            <div className="BriefOrganization-infoCol-col1">
                                <div className="BriefOrganization-homeUrl BriefOrganization-infoTableRow">
                                    {this.renderHomeUrl(org)}
                                </div>
                                <div className="BriefOrganization-researchInterests BriefOrganization-infoTableRow">
                                    {org.researchInterests}
                                </div>
                                <div>
                                    {this.renderRelation(org)}
                                </div>
                            </div>
                            <div className="BriefOrganization-infoCol-col2">
                                <div className="BriefOrganization-orgCreated BriefOrganization-infoTableRow">
                                    <div className="BriefOrganization-infoTableCol1">
                                        <span className="field-label">established</span>
                                    </div>
                                    <div className="BriefOrganization-infoTableCol2">
                                        <span >{Intl.DateTimeFormat('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        }).format(org.createdAt)}</span>
                                    </div>
                                </div>
                                <div className="BriefOrganization-orgCreated BriefOrganization-infoTableRow">
                                    <div className="BriefOrganization-infoTableCol1">
                                        <span className="field-label">last changed</span>
                                    </div>
                                    <div className="BriefOrganization-infoTableCol2">
                                        <span >{Intl.DateTimeFormat('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        }).format(org.modifiedAt)}</span>
                                    </div>
                                </div>
                                <div className="BriefOrganization-orgCreated BriefOrganization-infoTableRow">
                                    <div className="BriefOrganization-infoTableCol1">
                                        <span className="field-label">members</span>
                                    </div>
                                    <div className="BriefOrganization-infoTableCol2">
                                        {this.renderMemberCount(org)}
                                    </div>
                                </div>
                                <div className="BriefOrganization-orgCreated BriefOrganization-infoTableRow">
                                    <div className="BriefOrganization-infoTableCol1">
                                        <span className="field-label">narratives</span>
                                    </div>
                                    <div className="BriefOrganization-infoTableCol2">
                                        {this.renderNarrativeCount(org)}
                                    </div>
                                </div>
                            </div>
                            <div className="BriefOrganization-infoCol-col3">
                                <div className="BriefOrganization-orgOwner BriefOrganization-infoTableRow">
                                    <div className="BriefOrganization-infoTableCol1" style={{ flex: '0 0 4em' }}>
                                        <span className="field-label">owner</span>
                                    </div>
                                    <div className="BriefOrganization-infoTableCol2">
                                        {/* TODO: render as Member or Owner component */}
                                        <Owner username={org.owner} avatarSize={30} />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div >
        )
    }

    renderFreshness(org: orgModel.BriefOrganization) {
        // FAKE - remove
        const lastVisitedAt = this.props.lastVisitedAt

        const isNew = lastVisitedAt && (org.modifiedAt.getTime() > lastVisitedAt.getTime())
        let newAlert
        if (isNew) {
            const title = 'This org has changed since your last visit to it'
            newAlert = (
                <div>
                    <Tooltip placement="topRight" title={title}>
                        <span style={{ color: 'red' }}>
                            ●
                    </span>
                    </Tooltip>
                </div>
            )
        } else {
            newAlert = (
                <div>
                    <span style={{ color: 'transparent' }}>
                        ●
                    </span>
                </div>
            )
        }

        const hasRequests = false

        let requestsAlert
        if (hasRequests) {
            requestsAlert = (
                <div>
                    <Icon type="bulb" style={{ color: "blue" }} />
                </div>
            )
        } else {
            requestsAlert = null
        }

        return (
            <div>
                {newAlert}
                {requestsAlert}
            </div>
        )
    }

    renderCompact() {
        const org = this.props.organization
        return (
            <div className="BriefOrganization">
                <div className="BriefOrganization-body">
                    <div className="BriefOrganization-freshnessCol">
                        {this.renderFreshness(org)}
                    </div>
                    <div className="BriefOrganization-logoCol">
                        <NavLink to={`/viewOrganization/${org.id}`}>
                            {this.renderLogo(org)}
                        </NavLink>
                    </div>
                    <div className="BriefOrganization-infoCol">
                        <div className="BriefOrganization-infoTable">
                            <div className="BriefOrganization-orgName BriefOrganization-infoTableRow">
                                <NavLink to={`/viewOrganization/${org.id}`}>
                                    {org.name}
                                </NavLink>
                            </div>
                            <div className="BriefOrganization-homeUrl BriefOrganization-infoTableRow">
                                {this.renderHomeUrl(org)}
                            </div>
                            <div className="BriefOrganization-researchInterests BriefOrganization-infoTableRow">
                                {org.researchInterests}
                            </div>
                            <div>
                                {this.renderRelation(org)}
                            </div>
                            <div className="BriefOrganization-orgCreated BriefOrganization-infoTableRow">
                                <div className="BriefOrganization-infoTableCol1">
                                    <span className="field-label">established</span>
                                </div>
                                <div className="BriefOrganization-infoTableCol2">
                                    <span >{Intl.DateTimeFormat('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    }).format(org.createdAt)}</span>
                                </div>
                            </div>
                            <div className="BriefOrganization-orgCreated BriefOrganization-infoTableRow">
                                <div className="BriefOrganization-infoTableCol1">
                                    <span className="field-label">last changed</span>
                                </div>
                                <div className="BriefOrganization-infoTableCol2">
                                    <span >{Intl.DateTimeFormat('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    }).format(org.modifiedAt)}</span>
                                </div>
                            </div>
                            <div className="BriefOrganization-infoTableRow">
                                <a onClick={this.onToggleView.bind(this)}
                                    className={`linkButton ${this.state.view === ComponentView.NORMAL ? "pressed" : ""}`}
                                >
                                    <Icon type={`${this.state.view === ComponentView.NORMAL ? "up" : "down"}`} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return this.renderNormal()
    }
}
