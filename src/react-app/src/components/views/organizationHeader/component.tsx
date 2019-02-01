import * as React from 'react'
import { MemberType } from '../../../types'
import { Icon, Tooltip, Button, message, Menu, Dropdown } from 'antd'
import { Redirect } from 'react-router-dom'

import * as orgModel from '../../../data/models/organization/model'
import * as requestModel from '../../../data/models/requests'
import * as userModel from '../../../data/models/user'

import './component.css'
import OrgLogo from '../../OrgLogo';
import Owner from '../../entities/OwnerContainer';


export interface OrganizationHeaderProps {
    organization: orgModel.Organization
    pendingJoinRequest: requestModel.UserRequest | null
    pendingJoinInvitation: requestModel.UserInvitation | null
    currentUsername: userModel.Username
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

    relation: orgModel.UserOrgRelation

    constructor(props: OrganizationHeaderProps) {
        super(props)

        this.state = {
            navigateTo: NavigateTo.NONE
        }

        this.relation = this.getUserRelation()
    }

    getUserRelation(): orgModel.UserOrgRelation {
        const currentUsername = this.props.currentUsername
        const org = this.props.organization
        if (currentUsername === org.owner.username) {
            return {
                type: orgModel.UserRelationToOrganization.OWNER
            } as orgModel.OwnerRelation
        } else {
            const member = org.members.find(({ username }) => {
                return (username === currentUsername)
            })
            if (member) {
                switch (member.type) {
                    case MemberType.MEMBER:
                        return {
                            type: orgModel.UserRelationToOrganization.MEMBER
                        } as orgModel.MemberRelation
                    case MemberType.ADMIN:
                        return {
                            type: orgModel.UserRelationToOrganization.ADMIN
                        } as orgModel.AdminRelation
                    case MemberType.OWNER:
                        return {
                            type: orgModel.UserRelationToOrganization.OWNER
                        } as orgModel.OwnerRelation
                    default:
                        return {
                            type: orgModel.UserRelationToOrganization.NONE
                        } as orgModel.NoRelation
                }
            } else if (this.props.pendingJoinRequest && this.props.pendingJoinRequest.user === currentUsername) {
                return {
                    type: orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING,
                    requestId: this.props.pendingJoinRequest.id
                } as orgModel.MembershipRequestPendingRelation
            } else if (this.props.pendingJoinInvitation && this.props.pendingJoinInvitation.user === currentUsername) {
                return {
                    type: orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING,
                    requestId: this.props.pendingJoinInvitation.id
                } as orgModel.MembershipInvitationPendingRelation
            } else {
                return {
                    type: orgModel.UserRelationToOrganization.VIEW
                } as orgModel.ViewRelation
            }
        }
    }

    onJoinClick() {
        this.props.onJoinOrg()
        message.success('Join request has been submitted')
    }

    // LEFT OFF HERE... 
    // OK ... the relation should actually capture more info ... such as the request id
    // but in reality don't we always have just one of request or invitation (or none)?
    // in which case, we can just pick the appropriate one.
    // but ... it also makes sense for the relation to carry information appropriate for the
    // relation.

    onCancelJoinRequest() {
        const relation = this.relation as orgModel.MembershipRequestPendingRelation
        this.props.onCancelJoinRequest(relation.requestId)
        message.success('Submitted cancellation request')
    }

    onAcceptInvitation() {
        const relation = this.relation as orgModel.MembershipRequestPendingRelation
        this.props.onAcceptInvitation(relation.requestId)
        message.success('Invitation acceptance has been sent')
    }

    onRejectInvitation() {
        const relation = this.relation as orgModel.MembershipRequestPendingRelation
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

    onMenuClick({ key }: { key: string }) {
        switch (key) {
            case 'manageMyMembership':
                this.setState({ navigateTo: NavigateTo.MANAGE_MEMBERSHIP })
                break
            case 'viewMembers':
                this.setState({ navigateTo: NavigateTo.VIEW_MEMBERS })
                break
            case 'editOrg':
                this.setState({ navigateTo: NavigateTo.EDIT_ORGANIZATION })
                break
            case 'inviteUser':
                this.setState({ navigateTo: NavigateTo.INVITE_USER })
                break
            case 'manageRequests':
                this.setState({ navigateTo: NavigateTo.MANAGE_REQUESTS })
                break
        }
    }


    renderLogo(org: orgModel.Organization) {
        return (
            <OrgLogo logoUrl={org.logoUrl} size={64} organizationName={org.name} organizationId={org.id} />
        )
    }

    renderRelation() {
        const org = this.props.organization
        switch (this.relation.type) {
            case (orgModel.UserRelationToOrganization.NONE):
                return (
                    <span><Icon type="stop" />None</span>
                )
            case (orgModel.UserRelationToOrganization.VIEW):
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
            case (orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING):
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
            case (orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING):
                return (
                    <Tooltip
                        placement="bottomRight"
                        mouseEnterDelay={0.5}
                        title="You have been invited to join this Organization"
                    >
                        <div style={{ textAlign: 'center' }}>
                            <div>
                                <Icon type="user" style={{ color: 'blue' }} />You have been <b>invited</b> to join this Organization
                            </div>
                            <div>
                                <Button icon="check" type="default" onClick={this.onAcceptInvitation.bind(this)}>Accept</Button>
                                <Button icon="stop" type="danger" onClick={this.onRejectInvitation.bind(this)}>Reject</Button>
                            </div>
                        </div>
                    </Tooltip>
                )
            case (orgModel.UserRelationToOrganization.MEMBER):
                const menu = (
                    <Menu onClick={this.onMenuClick.bind(this)}>
                        <Menu.Item key="manageMyMembership">
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
                    </div>
                )
            case (orgModel.UserRelationToOrganization.ADMIN):
                const adminMenu = (
                    <Menu onClick={this.onMenuClick.bind(this)}>
                        <Menu.Item key="manageMyMembership">
                            Manage My Membership
                        </Menu.Item>
                        <Menu.Item key="editOrg" >
                            Edit this Org
                        </Menu.Item>
                        <Menu.Item key="inviteUser">
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
                                title="You are an Administrator for this organization"
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
                    </div>
                )
            case (orgModel.UserRelationToOrganization.OWNER):
                const ownerMenu = (
                    <Menu onClick={this.onMenuClick.bind(this)}>
                        <Menu.Item key="editOrg">
                            Edit this Org
                        </Menu.Item>
                        <Menu.Item key="inviteUser">
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
                                title="You own this organization"
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
                    </div>
                )
        }
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

    renderOrgInfo() {
        const org = this.props.organization
        return (
            <React.Fragment>
                <div className="name">
                    {org.name}
                </div>
                <div>
                    <div style={{ display: 'inline-block', width: '50%', verticalAlign: 'top' }}>
                        <div>
                            {this.renderHomeUrl(org)}
                        </div>
                        <div className="owner">
                            <Owner username={org.owner.username} avatarSize={20} />
                        </div>
                    </div>
                    <div style={{ display: 'inline-block', width: '50%', verticalAlign: 'top' }}>
                        <div>
                            <span className="field-label">established</span>
                            <span className="field-value">{Intl.DateTimeFormat('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            }).format(org.createdAt)}</span>
                        </div>
                        <div>
                            <span className="field-label">last modified</span>
                            <span className="field-value">{Intl.DateTimeFormat('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            }).format(org.modifiedAt)}</span>
                        </div>
                    </div>
                </div>


                {/* <div className="id">
                    <span className="label">permalink</span>{' '}
                    <span className="permalinkBase">https:/narrative.kbase.us#orgs/</span>{org.id}
                </div> */}


                {/* <div className="owner">
                    <span className="field-label">owner</span>
                    <a href={"/#people/" + org.owner.username} target="_blank">{org.owner.username}</a>
                    {' '}
                    ❨{org.owner.username}❩
                                </div> */}
            </React.Fragment>
        )
    }

    getRelationClass(org: orgModel.Organization) {
        switch (this.relation.type) {
            case (orgModel.UserRelationToOrganization.NONE):
                return 'relationRequest'
            case (orgModel.UserRelationToOrganization.VIEW):
                return 'relationRequest relationNonMember'
            case (orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING):
                return 'relationRequest relationRequestPending'
            case (orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING):
                return 'relationRequest relationInvitationPending'
            case (orgModel.UserRelationToOrganization.MEMBER):
                return 'relationRequest relationMember'
            case (orgModel.UserRelationToOrganization.ADMIN):
                return 'relationRequest relationAdmin'
            case (orgModel.UserRelationToOrganization.OWNER):
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
                    {this.renderLogo(this.props.organization)}
                </div>
                <div className="orgInfo">
                    {this.renderOrgInfo()}
                </div>
                <div className={"yourRelation " + this.getRelationClass(this.props.organization)}>
                    {this.renderRelation()}
                </div>

            </div>
        )
    }
}

export default OrganizationHeader