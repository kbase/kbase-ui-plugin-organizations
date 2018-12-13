import * as React from 'react'

import * as organizationModel from '../../../data/models/organization/model'
import * as uberModel from '../../../data/models/uber'
import { NavLink } from 'react-router-dom';
import { Tooltip, Icon } from 'antd';
import UserComponent from '../../entities/UserContainer'

import './Organization.css'

export interface OrganizationProps {
    organization: uberModel.UberOrganization
    // users: Map<userModel.Username, userModel.User>
}

interface OrganizationState {
}

export default class OrganizationBlock extends React.Component<OrganizationProps, OrganizationState> {
    constructor(props: OrganizationProps) {
        super(props)
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
            <img style={{ width: 64, height: 64 }}
                src={this.getAvatarUrl(org)} />
        )
    }

    renderRelation() {
        switch (this.props.organization.relation.type) {
            case (organizationModel.UserRelationToOrganization.NONE):
                return (
                    <span><Icon type="stop" />None</span>
                )
            case (organizationModel.UserRelationToOrganization.VIEW):
                return (
                    <Tooltip
                        placement="bottomRight"
                        mouseEnterDelay={0.5}
                        title="You are not a member of this org, but you may access it; you may request membership"
                    >
                        <span><Icon type="stop" /> You are not a member - view group to join</span>
                    </Tooltip>
                )
            case (organizationModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING):
                return (<span><Icon type="user" style={{ color: 'orange' }} /> Your membership <b>request</b> is pending</span>)
            case (organizationModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING):
                return (<span><Icon type="user" style={{ color: 'blue' }} /> You have been <b>invited</b> to join</span>)
            case (organizationModel.UserRelationToOrganization.MEMBER):
                return (<span><Icon type="user" /> You are a <b>member</b> of this organization</span>)
            case (organizationModel.UserRelationToOrganization.ADMIN):
                return (<span><Icon type="unlock" />Admin</span>)
            case (organizationModel.UserRelationToOrganization.OWNER):
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
            case organizationModel.UserRelationToOrganization.NONE:
                return (
                    <div>
                        Only members may view membership information
                    </div>
                )
                break
            case organizationModel.UserRelationToOrganization.VIEW:
                return (
                    <div>Only members may view membership information</div>
                )
                break
            case organizationModel.UserRelationToOrganization.MEMBER:
                return (
                    <div>
                        {this.renderMemberCount()}
                    </div>
                )
                break
            case organizationModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING:
                return (
                    <div>Only members may view membership information</div>
                )
                break
            case organizationModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING:
                return (
                    <div>
                        Only members may view membership information
                    </div>
                )
                break
            case organizationModel.UserRelationToOrganization.ADMIN:
                return (
                    <div>
                        {this.renderMemberCount()}
                    </div>
                )
                break
            case organizationModel.UserRelationToOrganization.OWNER:
                return (
                    <div>
                        {this.renderMemberCount()}
                    </div>
                )
                break
        }
    }

    renderAdminInfo() {
        if (!(this.props.organization.relation.type === organizationModel.UserRelationToOrganization.OWNER ||
            this.props.organization.relation.type === organizationModel.UserRelationToOrganization.ADMIN)) {
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

    render() {
        const org = this.props.organization.organization
        return (
            <div className="OrganizationBlock" key={org.id}>
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
                    <div>
                        {this.renderRelation()}
                    </div>
                    <div>
                        {this.renderRelationInfo()}
                    </div>
                    <div>
                        {this.renderAdminInfo()}
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
                    {/* {this.renderAdminInfo(org)} */}
                </div>
            </div>
        )
    }
}
