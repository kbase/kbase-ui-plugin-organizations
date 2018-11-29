import * as React from 'react'
import { Organization, UserRelationToOrganization, MembershipRequestPendingRelation } from '../../types';
import { Avatar } from '../Avatar';
import { Icon, Tooltip, Button, message, Menu, Dropdown } from 'antd';

import './style.css'
import { NavLink, Redirect } from 'react-router-dom';

export interface OrganizationHeaderProps {
    organization: Organization
    onCancelJoinRequest: (requestId: string) => void
    onAcceptInvitation: (requestId: string) => void
    onRejectInvitation: (requestId: string) => void
    onJoinOrg: () => void
}

interface OrganizationHeaderState {
    navigateTo: NavigateTo
}

enum NavigateTo {
    NONE = 0,
    MANAGE_MEMBERSHIP,
    VIEW_MEMBERS,
    MANAGE_REQUESTS,
    VIEW_ORGANIZATION,
    EDIT_ORGANIZATION,
    INVITE_USER
}

export class OrganizationHeader extends React.Component<OrganizationHeaderProps, OrganizationHeaderState> {
    constructor(props: OrganizationHeaderProps) {
        super(props)

        this.state = {
            navigateTo: NavigateTo.NONE
        }
    }

    onJoinClick() {
        this.props.onJoinOrg()
        message.success('Join request has been submitted')
    }

    onCancelJoinRequest() {
        const relation = this.props.organization.relation as MembershipRequestPendingRelation
        this.props.onCancelJoinRequest(relation.requestId)
        message.success('Submitted cancellation request')
    }

    onAcceptInvitation() {
        const relation = this.props.organization.relation as MembershipRequestPendingRelation
        this.props.onAcceptInvitation(relation.requestId)
        message.success('Invitation acceptance has been sent')
    }

    onRejectInvitation() {
        const relation = this.props.organization.relation as MembershipRequestPendingRelation
        this.props.onRejectInvitation(relation.requestId)
        message.success('Invitation rejection has been sent')
    }

    onNavigateToMembership() {
        this.setState({ navigateTo: NavigateTo.MANAGE_MEMBERSHIP })
    }

    onNavigateToViewMembers() {
        this.setState({ navigateTo: NavigateTo.VIEW_MEMBERS })
    }

    onNavigateToManageRequests() {
        this.setState({ navigateTo: NavigateTo.MANAGE_REQUESTS })
    }

    onNavigateToEditOrganization() {
        this.setState({ navigateTo: NavigateTo.EDIT_ORGANIZATION })
    }

    onNavigateToInviteUser() {
        this.setState({ navigateTo: NavigateTo.INVITE_USER })
    }

    onNavigateToViewOrganization() {
        this.setState({ navigateTo: NavigateTo.VIEW_ORGANIZATION })
    }

    renderOwnerInfo() {
        const org = this.props.organization
        return (
            <div className="ownerTable">
                <div className="avatarCol">
                    <Avatar user={org.owner.user} size={60} />
                </div>
                <div className="proprietorCol">

                    <div className="owner">
                        <a href={"#people/" + org.owner.user.username} target="_blank">{org.owner.user.realname}</a>
                        {' '}
                        ❨{org.owner.user.username}❩
                    </div>
                    <div className="profileOrganization">
                        {org.owner.user.organization}
                    </div>
                    <div className="profileOrganization">
                        {org.owner.user.city}, {org.owner.user.state}, {org.owner.user.country}
                    </div>
                </div>
            </div>
        )
    }

    getOrgAvatarUrl(org: Organization) {
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

    renderOrgAvatar(org: Organization) {
        return (
            <img style={{ width: 64, height: 64 }}
                onClick={this.onNavigateToViewOrganization.bind(this)}
                className="avatarImage"
                src={this.getOrgAvatarUrl(this.props.organization)} />
        )
    }

    renderRelation() {
        const org = this.props.organization
        switch (org.relation.type) {
            case (UserRelationToOrganization.NONE):
                return (
                    <span><Icon type="stop" />None</span>
                )
            case (UserRelationToOrganization.VIEW):
                return (
                    <div>
                        <Tooltip
                            placement="bottomRight"
                            mouseEnterDelay={0.5}
                            title="You are not a member of this org, but you may access it, you may request membership"
                        >
                            <div style={{ textAlign: 'center' }}>
                                <Icon type="eye" style={{ marginRight: '4px' }} />You are not a member of this Organization
                            </div>
                        </Tooltip>
                        <div style={{ textAlign: 'center' }}>
                            <Button
                                type="primary"
                                onClick={this.onJoinClick.bind(this)}>
                                Join this Organization
                            </Button>
                        </div>
                    </div>

                )
            case (UserRelationToOrganization.MEMBER_REQUEST_PENDING):
                return (
                    <div>
                        <Tooltip
                            placement="bottomRight"
                            mouseEnterDelay={0.5}
                            title="You have requested membership in this Organization"
                        >   <div style={{ textAlign: 'center' }}>
                                <span>
                                    <Icon type="user" style={{ color: 'orange' }} spin={true} />
                                    Your membership <b>request</b> is pending
                                {' '}
                                    <Icon type="question-circle" />
                                </span>
                            </div>
                        </Tooltip>
                        <div style={{ textAlign: 'center' }}>
                            <Button icon="delete" type="danger" onClick={this.onCancelJoinRequest.bind(this)}>Cancel Request</Button>
                        </div>
                    </div>

                )
            case (UserRelationToOrganization.MEMBER_INVITATION_PENDING):
                return (
                    <Tooltip
                        placement="bottomRight"
                        mouseEnterDelay={0.5}
                        title="You have been invited to join this Organization"
                    >
                        <div><Icon type="user" style={{ color: 'blue' }} />You have been <b>invited</b> to join this Organization</div>
                        <div style={{ textAlign: 'center' }}>
                            <Button icon="check" type="default" onClick={this.onAcceptInvitation.bind(this)}>Accept Invitation</Button>
                            <Button icon="stop" type="danger" onClick={this.onRejectInvitation.bind(this)}>Reject Invitation</Button>
                        </div>
                    </Tooltip>
                )
            case (UserRelationToOrganization.MEMBER):
                const menu = (
                    <Menu>
                        <Menu.Item key="manageMyMembership" onClick={this.onNavigateToMembership.bind(this)}>
                            Manage My Membership
                        </Menu.Item>
                    </Menu>
                )
                return (
                    <div className="relationRow">
                        <div className="relationLabel">
                            <Tooltip
                                placement="bottomRight"
                                mouseEnterDelay={0.5}
                                title="You are a member of this organization"
                            >
                                <div><Icon type="user" />You are a <b>member</b> of this Organization</div>
                            </Tooltip>
                        </div>
                        <div className="relationMenu">
                            <div>
                                <Dropdown overlay={menu} trigger={['click']}>
                                    <Button shape="circle">
                                        <Icon type="setting" theme="filled" style={{ fontSize: '120%' }} />
                                    </Button>
                                </Dropdown>
                            </div>
                        </div>
                        {/* <div style={{ textAlign: 'center' }}>
                            <Button type="default">Manage your Profile</Button>
                        </div> */}
                    </div>
                )
            case (UserRelationToOrganization.ADMIN):
                const adminMenu = (
                    <Menu>
                        <Menu.Item key="manageMyMembership" onClick={this.onNavigateToMembership.bind(this)}>
                            Manage My Membership
                        </Menu.Item>
                        <Menu.Item key="viewMembers" onClick={this.onNavigateToViewMembers.bind(this)}>
                            Members
                        </Menu.Item>
                        <Menu.Item key="manageRequests" onClick={this.onNavigateToManageRequests.bind(this)}>
                            Requests and Invitations
                        </Menu.Item>
                        <Menu.Item key="editOrg" onClick={this.onNavigateToEditOrganization.bind(this)}>
                            Edit this Org
                        </Menu.Item>
                        <Menu.Item key="editOrg" onClick={this.onNavigateToInviteUser.bind(this)}>
                            Invite User
                        </Menu.Item>
                    </Menu>
                )
                return (
                    <div className="relationRow">
                        <div className="relationLabel">
                            <Tooltip
                                placement="bottomRight"
                                mouseEnterDelay={0.5}
                                title="You are and Administrator for this group"
                            >
                                <div><Icon type="unlock" />You are a <b>administrator</b> of this Organization</div>
                            </Tooltip>
                        </div>
                        <div className="relationMenu">
                            <div>
                                <Dropdown overlay={adminMenu} trigger={['click']}>
                                    <Button shape="circle">
                                        <Icon type="setting" theme="filled" style={{ fontSize: '120%' }} />
                                    </Button>
                                </Dropdown>
                            </div>
                        </div>
                        {/* <div style={{ textAlign: 'center' }}>
                            <Button type="default">Manage your Profile</Button>
                        </div> */}
                    </div>
                )
            case (UserRelationToOrganization.OWNER):
                const ownerMenu = (
                    <Menu>
                        <Menu.Item key="viewMembers" onClick={this.onNavigateToViewMembers.bind(this)}>
                            Members
                        </Menu.Item>
                        <Menu.Item key="manageRequests" onClick={this.onNavigateToManageRequests.bind(this)}>
                            Requests and Invitations
                        </Menu.Item>
                        <Menu.Item key="editOrg" onClick={this.onNavigateToEditOrganization.bind(this)}>
                            Edit this Org
                        </Menu.Item>
                        <Menu.Item key="inviteUser" onClick={this.onNavigateToInviteUser.bind(this)}>
                            Invite User
                        </Menu.Item>
                    </Menu>
                )
                return (
                    <div className="relationRow">
                        <div className="relationLabel">
                            <Tooltip
                                placement="bottomRight"
                                mouseEnterDelay={0.5}
                                title="You own this group"
                            >
                                <div>
                                    <Icon type="crown" style={{ color: 'gold' }} />
                                    {' '}
                                    You <b>own</b> this Organization
                                    </div>
                            </Tooltip>
                        </div>
                        <div className="relationMenu">
                            <div>
                                <Dropdown overlay={ownerMenu} trigger={['click']}>
                                    <Button shape="circle">
                                        <Icon type="setting" theme="filled" style={{ fontSize: '120%' }} />
                                    </Button>
                                </Dropdown>
                            </div>
                        </div>
                        {/* <div style={{ textAlign: 'center' }}>
                        <Button type="default">Manage your Profile</Button>
                    </div> */}
                    </div>
                )
        }
    }

    renderOrgInfo() {
        const org = this.props.organization
        return (
            <div>
                <div className="name">
                    {org.name}
                </div>
                {/* <div className="id">
                    <span className="label">permalink</span>{' '}
                    <span className="permalinkBase">https://narrative.kbase.us#orgs/</span>{org.id}
                </div> */}
                <div className="owner">
                    <span className="field-label">owner</span>
                    <a href={"#people/" + org.owner.user.username} target="_blank">{org.owner.user.realname}</a>
                    {' '}
                    ❨{org.owner.user.username}❩
                                </div>
            </div>
        )
    }

    getRelationClass(org: Organization) {
        switch (org.relation.type) {
            case (UserRelationToOrganization.NONE):
                return 'relationRequest'
            case (UserRelationToOrganization.VIEW):
                return 'relationRequest relationNonMember'
            case (UserRelationToOrganization.MEMBER_REQUEST_PENDING):
                return 'relationRequest relationRequestPending'
            case (UserRelationToOrganization.MEMBER_INVITATION_PENDING):
                return 'relationRequest relationInvitationPending'
            case (UserRelationToOrganization.MEMBER):
                return 'relationRequest relationMember'
            case (UserRelationToOrganization.ADMIN):
                return 'relationRequest relationAdmin'
            case (UserRelationToOrganization.OWNER):
                return 'relationRequest relationOwner'
        }
    }

    render() {
        // apparently TS is not smart enough to know this from the conditional branch in render()!
        switch (this.state.navigateTo) {
            case NavigateTo.MANAGE_MEMBERSHIP:
                return <Redirect push to={"/membership/" + this.props.organization.id} />
            case NavigateTo.VIEW_MEMBERS:
                return <Redirect push to={"/viewMembers/" + this.props.organization.id} />
            case NavigateTo.EDIT_ORGANIZATION:
                return <Redirect push to={"/editOrganization/" + this.props.organization.id} />
            case NavigateTo.MANAGE_REQUESTS:
                return <Redirect push to={"/manageOrganizationRequests/" + this.props.organization.id} />
            case NavigateTo.INVITE_USER:
                return <Redirect push to={"/inviteUser/" + this.props.organization.id} />
            case NavigateTo.VIEW_ORGANIZATION:
                return <Redirect push to={"/viewOrganization/" + this.props.organization.id} />
            default:
            // nothing, fall through
        }

        return (
            <div className="OrganizationHeader">
                <div className="avatar">
                    {this.renderOrgAvatar(this.props.organization)}
                </div>
                <div className="orgInfo">
                    {this.renderOrgInfo()}
                </div>
                {/* <div className="ownerInfo">
                    {this.renderOwnerInfo()}
                </div> */}
                <div className={"yourRelation " + this.getRelationClass(this.props.organization)}>
                    {this.renderRelation()}
                </div>

            </div>
        )
    }
}

export default OrganizationHeader