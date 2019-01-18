import * as React from 'react'

import * as orgModel from '../../../data/models/organization/model'
import * as uberModel from '../../../data/models/uber'
import { NavLink } from 'react-router-dom';
import { Tooltip, Icon } from 'antd';
import UserLoader from '../../entities/UserLoader'

import './Organization.css'
import OrgLogo from '../../OrgLogo';
import { organizationLoader } from '../../../redux/actions/entities';

export interface OrganizationProps {
    organization: uberModel.UberOrganization
    // users: Map<userModel.Username, userModel.User>
}

interface OrganizationState {
}

export default class Organization extends React.Component<OrganizationProps, OrganizationState> {
    constructor(props: OrganizationProps) {
        super(props)
    }

    renderLogo(org: orgModel.Organization) {
        return (
            <OrgLogo logoUrl={org.logoUrl} size={64} organizationName={org.name} organizationId={org.id} />
        )
    }

    renderRelation() {
        switch (this.props.organization.relation.type) {
            case (orgModel.UserRelationToOrganization.NONE):
                return (
                    <span><Icon type="stop" />None</span>
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
                return (<span><Icon type="unlock" />You are an <b>admin</b> of this organization</span>)
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

    pluralize(count: number, singular: string, plural: string) {
        if (count === 0 || count > 1) {
            return plural
        }
        return singular
    }

    renderMemberCount() {
        const org = this.props.organization.organization
        return (
            <div className="memberCount">
                {org.members.length > 0 ? org.members.length : 'no'} {this.pluralize(org.members.length, 'member', 'members')}
            </div>
        )
    }

    renderRelationInfo() {
        switch (this.props.organization.relation.type) {
            case orgModel.UserRelationToOrganization.NONE:
                return (
                    <div>
                        Only members may view membership information
                    </div>
                )
                break
            case orgModel.UserRelationToOrganization.VIEW:
                return (
                    <div>Only members may view membership information</div>
                )
                break
            case orgModel.UserRelationToOrganization.MEMBER:
                return (
                    <div>
                        {this.renderMemberCount()}
                    </div>
                )
                break
            case orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING:
                return (
                    <div>Only members may view membership information</div>
                )
                break
            case orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING:
                return (
                    <div>
                        Only members may view membership information
                    </div>
                )
                break
            case orgModel.UserRelationToOrganization.ADMIN:
                return (
                    <div>
                        {this.renderMemberCount()}
                    </div>
                )
                break
            case orgModel.UserRelationToOrganization.OWNER:
                return (
                    <div>
                        {this.renderMemberCount()}
                    </div>
                )
                break
        }
    }

    renderAdminInfo() {
        if (!(this.props.organization.relation.type === orgModel.UserRelationToOrganization.OWNER ||
            this.props.organization.relation.type === orgModel.UserRelationToOrganization.ADMIN)) {
            return
        }
        const requests = this.props.organization.groupRequests
        let requestsPending
        if (requests && requests.length > 0) {
            requestsPending = (
                <div>
                    <Icon type="exclamation-circle" theme="twoTone" twoToneColor="orange" />
                    {' '}
                    there
                    {' '}
                    {requests.length > 1 ? 'are' : 'is'}
                    {' '}
                    <b>{requests.length} pending request{requests.length > 1 ? 's' : ''}</b>
                </div>
            )
        }

        return (
            <div className="admin">
                {requestsPending}
            </div>
        )
    }

    renderPrivate() {
        const org = this.props.organization
        if (org.organization.isPrivate) {
            return (
                <span>
                    <Icon type="lock" />{' '}private
                </span>
            )
        }
        return (
            <span>
                <Icon type="global" />{' '}public
            </span>
        )
    }

    renderMemberCompact(member: orgModel.Member) {
        // Look! Render props!
        return (
            <UserLoader userId={member.username} render={(user) => {
                return (
                    <a href={"/#people/" + member.username} target="_blank">
                        {user.realname} ❨{member.username}❩
                    </a>
                )
            }} />
        )
    }

    renderOwner(org: orgModel.Organization) {
        if (this.props.organization.relation.type === orgModel.UserRelationToOrganization.OWNER) {
            return
        }
        return (
            <div className="orgOwner">
                <span className="field-label">owner</span>
                <span className="field-value">{this.renderMemberCompact(org.owner)}</span>
            </div>
        )
    }

    renderHomeUrl(org: orgModel.Organization) {
        if (!org.homeUrl) {
            return
        }
        return (
            <div className="homeUrl">
                <a href={org.homeUrl} target="_blank">
                    <Icon type="home" />
                    {' '}
                    {org.homeUrl}
                </a>
            </div>
        )
    }

    render() {
        const org = this.props.organization.organization
        return (
            <div className="Organization" key={org.id}>
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
                    <div className="researchInterests">
                        {org.researchInterests}
                    </div>
                    {this.renderHomeUrl(org)}
                    <div>
                        {this.renderPrivate()}
                    </div>
                    <div>
                        {this.renderRelation()}
                    </div>
                    <div>
                        {this.renderRelationInfo()}
                    </div>
                    <div>
                        {this.renderAdminInfo()}
                    </div>

                    {this.renderOwner(org)}

                    <div className="orgCreated">
                        <span className="field-label">established</span>
                        <span className="field-value">{Intl.DateTimeFormat('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        }).format(org.createdAt)}</span>
                    </div>
                    {/* {this.renderAdminInfo(org)} */}
                </div>
            </div>
        )
    }
}
