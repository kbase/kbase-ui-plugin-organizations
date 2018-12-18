import * as React from 'react'

import * as orgModel from '../data/models/organization/model'
import * as requestModel from '../data/models/requests'
import { NavLink } from 'react-router-dom';
import { Tooltip, Icon } from 'antd';

import './OrganizationBlock.css'
import OrgAvatar from './OrgAvatar';

export interface OrganizationBlockProps {
    organization: orgModel.Organization
    relation: orgModel.Relation
    adminRequests: Array<requestModel.Request>
}

interface OrganizationBlockState {
}

export default class OrganizationBlock extends React.Component<OrganizationBlockProps, OrganizationBlockState> {
    constructor(props: OrganizationBlockProps) {
        super(props)
    }

    renderOrgAvatar(org: orgModel.Organization) {
        return (
            <OrgAvatar gravatarHash={org.gravatarHash} size={64} organizationName={org.name} />
        )
    }

    renderRelation() {
        const relation = this.props.relation
        switch (relation.type) {
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
                        <span><Icon type="stop" /> You are not a member - view group to join</span>
                    </Tooltip>
                )
            case (orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING):
                return (<span><Icon type="user" style={{ color: 'orange' }} /> Your membership <b>request</b> is pending</span>)
            case (orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING):
                return (<span><Icon type="user" style={{ color: 'blue' }} /> You have been <b>invited</b> to join</span>)
            case (orgModel.UserRelationToOrganization.MEMBER):
                return (<span><Icon type="user" /> You are a <b>member</b> of this organization</span>)
            case (orgModel.UserRelationToOrganization.ADMIN):
                return (<span><Icon type="unlock" />Admin</span>)
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
        const org = this.props.organization
        return (
            <div className="memberCount">
                {org.members.length > 0 ? org.members.length : 'no'} {this.pluralize(org.members.length, 'member', 'members')}
            </div>
        )
    }

    renderRelationInfo() {
        switch (this.props.relation.type) {
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

    renderAdminInfo(org: orgModel.Organization) {
        if (!(this.props.relation.type === orgModel.UserRelationToOrganization.OWNER ||
            this.props.relation.type === orgModel.UserRelationToOrganization.ADMIN)) {
            return
        }
        let requestsPending
        if (this.props.adminRequests.length > 0) {
            requestsPending = (
                <div>
                    <Icon type="exclamation-circle" theme="twoTone" twoToneColor="orange" />
                    {' '}
                    there
                    {' '}
                    {this.props.adminRequests.length > 1 ? 'are' : 'is'}
                    {' '}
                    <b>{this.props.adminRequests.length} pending request{this.props.adminRequests.length > 1 ? 's' : ''}</b>
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
        const org = this.props.organization
        return (
            <div className="OrganizationBlock" key={org.id}>
                <div className="avatarCol">
                    <NavLink to={`/viewOrganization/${org.id}`}>
                        {this.renderOrgAvatar(org)}
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

                    <div className="relation">
                        {/* <span className="field-label">you</span> */}
                        {this.renderRelation()}
                    </div>
                    {this.renderRelationInfo()}

                    {this.renderAdminInfo(org)}
                </div>
            </div>
        )
    }
}
