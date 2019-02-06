import * as React from 'react'
import * as orgModel from '../../../data/models/organization/model'
import './BriefOrganization.css'
import { NavLink } from 'react-router-dom';
import OrgLogo from '../../OrgLogo';
import { Icon, Tooltip, Menu, Dropdown, Modal } from 'antd';
import Owner from '../../entities/OwnerContainer';
import { ComponentView } from '../../../types';
import { RequestStatus } from '../../../data/models/requests';
import { niceElapsed } from '../../../lib/time';

export interface BriefOrganizationProps {
    organization: orgModel.BriefOrganization
    openRequestsStatus: orgModel.RequestStatus | null
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
        const tooltip = (
            <React.Fragment>
                <p>
                    Home page for this Organization (external to KBase)
                </p>
            </React.Fragment>
        )
        return (
            <div className="BriefOrganization-homeUrl">
                <Tooltip
                    placement="bottomRight"
                    mouseEnterDelay={0.5}
                    title={tooltip}
                >
                    <a href={org.homeUrl} target="_blank">
                        <Icon type="home" />
                    </a>
                </Tooltip>
            </div >
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
        if (org.memberCount == 1) {
            return (
                <span style={{ color: 'gray' }}>
                    Ø
                </span>
            )
        }
        return (
            <span>
                {org.memberCount - 1}
            </span>
        )
    }

    renderRelation(org: orgModel.BriefOrganization) {
        switch (org.relation) {
            case (orgModel.UserRelationToOrganization.NONE):
                return (
                    <Tooltip
                        placement="bottomRight"
                        mouseEnterDelay={0.5}
                        title="You are not a member of this org; you may request membership"
                    >
                        <span>
                            <Icon type="stop" />
                        </span>
                    </Tooltip>
                )
            case (orgModel.UserRelationToOrganization.VIEW):
                return (
                    <Tooltip
                        placement="bottomRight"
                        mouseEnterDelay={0.5}
                        title="You are not a member of this org; you may request membership"
                    >
                        <Icon type="stop" />
                    </Tooltip>
                )
            case (orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING):
                return (
                    <Tooltip
                        placement="bottomRight"
                        mouseEnterDelay={0.5}
                        title="Your membership request is pending"
                    >
                        <Icon type="user" style={{ color: 'orange' }} /> Your membership <b>request</b> is pending
                </Tooltip>
                )

            case (orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING):
                return (
                    <Tooltip
                        placement="bottomRight"
                        mouseEnterDelay={0.5}
                        title="You have been invited to join this organization"
                    >
                        <Icon type="user" style={{ color: 'blue' }} />
                    </Tooltip>
                )
            case (orgModel.UserRelationToOrganization.MEMBER):
                return (
                    <Tooltip
                        placement="bottomRight"
                        mouseEnterDelay={0.5}
                        title="You are a member of this organization"
                    >
                        <Icon type="user" />
                    </Tooltip>
                )
            case (orgModel.UserRelationToOrganization.ADMIN):
                return (
                    <Tooltip
                        placement="bottomRight"
                        mouseEnterDelay={0.5}
                        title="You are an administrator of this organization"
                    >
                        <Icon type="robot" />
                    </Tooltip>
                )
            case (orgModel.UserRelationToOrganization.OWNER):
                return (
                    <Tooltip
                        placement="bottomRight"
                        mouseEnterDelay={0.5}
                        title="You are the owner of this organization"
                    >
                        <Icon type="crown" />
                    </Tooltip>
                )
        }
    }

    renderPrivacy() {
        const org = this.props.organization
        if (org.private) {
            return (
                <Tooltip
                    placement="bottomRight"
                    mouseEnterDelay={0.5}
                    title="This organization is private - may only be viewed by members">
                    <span>
                        <Icon type="unlock" />
                    </span>
                </Tooltip>
            )
        } else {
            return (
                <Tooltip
                    placement="bottomRight"
                    mouseEnterDelay={0.5}
                    title="This organization is public - may be viewed by any KBase user">
                    <span>
                        <Icon type="global" />
                    </span>
                </Tooltip>
            )
        }
    }

    renderOrgFreshness(org: orgModel.BriefOrganization) {
        const isNew = org.lastVisitedAt && (org.modifiedAt.getTime() > org.lastVisitedAt.getTime())
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

    // renderOpenRequests() {
    //     const title = (
    //         <span>
    //             There are outstanding requests for this organization
    //         </span>
    //     )
    //     return (
    //         <Tooltip placement="topRight" title={title}>
    //             <span style={{ color: 'blue', fontSize: '80%' }}>
    //                 <Icon type="mail" />
    //             </span>
    //         </Tooltip>
    //     )
    // }

    // renderNewOpenRequests() {
    //     const title = (
    //         <span>
    //             There are new requests for this organization
    //         </span>
    //     )
    //     return (
    //         <Tooltip placement="topRight" title={title}>
    //             <span style={{ color: 'red', fontSize: '80%' }}>
    //                 <Icon type="mail" />
    //             </span>
    //         </Tooltip>
    //     )
    // }

    renderRequests() {
        if (!(this.props.organization.relation === orgModel.UserRelationToOrganization.ADMIN ||
            this.props.organization.relation === orgModel.UserRelationToOrganization.OWNER)) {
            return
        }
        let message
        let iconColor
        switch (this.props.openRequestsStatus) {
            case orgModel.RequestStatus.NONE:
                // case null:
                message = 'There are no open requests for this organization'
                iconColor = 'rgba(200, 200, 200, 0.3)'
                break
            case orgModel.RequestStatus.NEW:
                message = 'There are new requests since you last visited this organization'
                iconColor = 'red'
                break
            case orgModel.RequestStatus.OLD:
                message = 'There are open requests for this organization'
                iconColor = 'blue'
                break
            case orgModel.RequestStatus.INAPPLICABLE:
                return
            default:
                console.warn('Invalid open request status: ' + this.props.openRequestsStatus)
                return
        }
        const title = (
            <span>
                {message}
            </span>
        )
        return (
            <Tooltip
                placement="topRight"
                title={title}>
                <span style={{ color: iconColor, fontSize: '80%' }}>
                    <Icon type="mail" />
                </span>
            </Tooltip>
        )
    }

    renderPermalink() {
        const permalink = (
            <div>
                <p>
                    Below is the "permalink" for this organization. You may copy
                    this url and use it to access this organization in a web browser.
                </p>
                <p style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                    {window.location.origin}/#org/{this.props.organization.id}
                </p>
            </div>
        )
        const menuClick = ({ key }: { key: string }) => {
            Modal.info({
                title: 'Org Permalink',
                content: permalink
            })
        }
        const menu = (
            <Menu
                onClick={menuClick}
            >
                <Menu.Item key="view">
                    View Permalink
                </Menu.Item>
            </Menu>
        )
        return (
            <Dropdown
                overlay={menu}
                trigger={['click', 'contextMenu']}>
                <a href={"/#org/" + this.props.organization.id}>
                    <Icon type="link" />
                </a>
            </Dropdown>
        )
    }

    renderLogoColumn(org: orgModel.BriefOrganization) {
        return (
            <React.Fragment>
                <div className="BriefOrganization-logoRow">
                    <NavLink to={`/viewOrganization/${org.id}`}>
                        {this.renderLogo(org)}
                    </NavLink>
                </div>
                <div className="BriefOrganization-statusRow">
                    <div className="BriefOrganization-relationCol">
                        {this.renderRelation(org)}
                    </div>
                    <div className="BriefOrganization-privacyCol">
                        {this.renderPrivacy()}
                    </div>

                    <div className="BriefOrganization-homeLinkCol">
                        {this.renderHomeUrl(org)}
                    </div>
                </div>
                <div className="BriefOrganization-freshnessRow">
                    <div className="BriefOrganization-orgFreshnessCol">
                        {this.renderOrgFreshness(org)}
                    </div>
                    <div className="BriefOrganization-openRequestsCol">
                        {this.renderRequests()}
                    </div>
                    <div className="BriefOrganization-openNewRequestsCol">
                        {this.renderPermalink()}
                    </div>
                </div>
            </React.Fragment>
        )
    }

    fullTimestamp(d: Date) {
        return Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short'
        }).format(d)
    }

    renderInfoCol(org: orgModel.BriefOrganization) {
        return (
            <React.Fragment>
                <div className="BriefOrganization-researchInterests BriefOrganization-infoTableRow">
                    {org.researchInterests}
                </div>

                <div className="BriefOrganization-orgOwner BriefOrganization-infoTableRow">
                    <div className="BriefOrganization-infoTableCol1">
                        <span className="field-label">owner</span>
                    </div>
                    <div className="BriefOrganization-infoTableCol2">
                        {/* TODO: render as Member or Owner component */}
                        <Owner username={org.owner.username} avatarSize={16} showAvatar={false} />
                    </div>
                </div>
                <div className="BriefOrganization-orgCreated BriefOrganization-infoTableRow">
                    <div className="BriefOrganization-infoTableCol1">
                        <span className="field-label">created</span>
                    </div>
                    <div className="BriefOrganization-infoTableCol2">
                        {/* {niceElapsed(org.createdAt, 30)} */}
                        <Tooltip
                            placement="bottomRight"
                            mouseEnterDelay={0.5}
                            title={this.fullTimestamp(org.createdAt)}>
                            <span>
                                {Intl.DateTimeFormat('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                }).format(org.createdAt)}
                            </span>
                        </Tooltip>
                    </div>
                </div>
                <div className="BriefOrganization-orgCreated BriefOrganization-infoTableRow">
                    <div className="BriefOrganization-infoTableCol1">
                        <span className="field-label">updated</span>
                    </div>
                    <div className="BriefOrganization-infoTableCol2">
                        <Tooltip
                            placement="bottomRight"
                            mouseEnterDelay={0.5}
                            title={this.fullTimestamp(org.modifiedAt)}>
                            {niceElapsed(org.modifiedAt, 30, false)}
                        </Tooltip>

                    </div>
                </div>
            </React.Fragment>
        )
    }

    renderStatsCol(org: orgModel.BriefOrganization) {
        return (
            <React.Fragment>
                <div className="BriefOrganization-orgCreated BriefOrganization-infoTableRow">
                    <div className="BriefOrganization-infoTableCol1">
                        <span className="field-label"><Icon type="team" /></span>
                    </div>
                    <div className="BriefOrganization-infoTableCol2">
                        {this.renderMemberCount(org)}
                    </div>
                </div>
                <div className="BriefOrganization-orgCreated BriefOrganization-infoTableRow">
                    <div className="BriefOrganization-infoTableCol1">
                        <span className="field-label"><Icon type="file" /></span>
                    </div>
                    <div className="BriefOrganization-infoTableCol2">
                        {this.renderNarrativeCount(org)}
                    </div>
                </div>
            </React.Fragment>
        )
    }

    renderNormal() {
        const org = this.props.organization
        return (
            <div className="BriefOrganization">
                <div className="BriefOrganization-body">
                    {/* <div className="BriefOrganization-freshnessCol">
                        {this.renderFreshness(org)}
                    </div> */}
                    <div className="BriefOrganization-logoCol">
                        {this.renderLogoColumn(org)}
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
                                {this.renderInfoCol(org)}
                            </div>
                            <div className="BriefOrganization-infoCol-col2">
                                {this.renderStatsCol(org)}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }

    render() {
        return this.renderNormal()
    }
}
