import * as React from 'react'
import { Marked } from 'marked-ts'
import { NavLink, Redirect } from 'react-router-dom'

import './component.css'

import { } from '../../../../types'
import { Button, Modal, Icon, Tooltip, Card, Dropdown, Menu, Alert, Tabs } from 'antd'
import Header from '../../../Header'
import Member from '../../../entities/MemberContainer'
import OrganizationHeader from '../../organizationHeader/loader'
import * as orgModel from '../../../../data/models/organization/model'
import * as requestModel from '../../../../data/models/requests'
import * as feedsModel from '../../../../data/models/feeds'
import OrganizationNarrative from '../../../OrganizationNarrative'
import InboxRequest from '../../dashboard/InboxRequestContainer'
import OutboxRequest from '../../dashboard/OutboxRequestContainer'
import Notifications from '../../../notifications/component'

enum NavigateTo {
    NONE = 0,
    REQUEST_ADD_NARRATIVE
}

export interface ViewOrganizationState {
    showInfo: boolean
    navigateTo: NavigateTo
    requestAccess: {
        narrative: orgModel.NarrativeResource | null
    }
}

export interface ViewOrganizationProps {
    organization: orgModel.Organization
    relation: orgModel.Relation
    groupRequests: Array<requestModel.Request> | null
    groupInvitations: Array<requestModel.Request> | null
    requestOutbox: Array<requestModel.Request>
    requestInbox: Array<requestModel.Request>
    notifications: Array<feedsModel.OrganizationNotification>
    onViewOrg: (id: string) => void
    onJoinOrg: () => void
    onCancelJoinRequest: (requestId: string) => void
    onAcceptInvitation: (requestId: string) => void
    onRejectInvitation: (requestId: string) => void
    onRemoveNarrative: (narrative: orgModel.NarrativeResource) => void
    onGetViewAccess: (narrative: orgModel.NarrativeResource) => void
    onAcceptRequest: (request: requestModel.Request) => void
    onReadNotification: (requestId: string) => void
}

class ViewOrganization extends React.Component<ViewOrganizationProps, ViewOrganizationState> {
    constructor(props: ViewOrganizationProps) {
        super(props)

        this.state = {
            showInfo: false,
            navigateTo: NavigateTo.NONE,
            requestAccess: {
                narrative: null
            }
        }
    }

    onViewMembers() {
    }

    onJoinClick() {
        this.props.onJoinOrg()
    }

    onCancelJoinRequest() {
        if (!this.props.organization) {
            return
        }
        const relation = this.props.relation as orgModel.MembershipRequestPendingRelation
        this.props.onCancelJoinRequest(relation.requestId)
    }

    onAcceptInvitation() {
        if (!this.props.organization) {
            return
        }
        const relation = this.props.relation as orgModel.MembershipRequestPendingRelation
        this.props.onAcceptInvitation(relation.requestId)
    }

    onRejectInvitation() {
        if (!this.props.organization) {
            return
        }
        const relation = this.props.relation as orgModel.MembershipRequestPendingRelation
        this.props.onRejectInvitation(relation.requestId)
    }

    onRequestAddNarrative() {
        this.setState({ navigateTo: NavigateTo.REQUEST_ADD_NARRATIVE })
    }

    onRemoveNarrative(narrative: orgModel.NarrativeResource) {
        this.props.onRemoveNarrative(narrative)
    }

    onNarrativeMenu(key: string, narrative: orgModel.NarrativeResource) {
        switch (key) {
            case 'removeNarrative':
                this.props.onRemoveNarrative(narrative)
                break
        }
    }

    onShowInfo() {
        // this.setState({ showInfo: true })
        Modal.info({
            title: 'View Organization Help',
            width: '50em',
            content: (
                <div>
                    Organization help here...
                </div>
            )
        })
    }

    onRequestShare(narrative: orgModel.NarrativeResource) {
        // Drawer.
        // Drawer.open({
        //     title: 'Request Access to Narrative',
        //     content: 'Are you sure?'
        // })
        this.setState({ requestAccess: { narrative: narrative } })
        // alert('not yet implemented')
    }

    onCloseRequestAccess() {
        this.setState({ requestAccess: { narrative: null } })
    }

    buildFooter() {
        return (
            <div>
                {this.renderEditRow()}
                {/* <p style={{ textAlign: 'center' }}>
                    You may also  <NavLink to={`/organizations`}><Button type="danger" icon="undo">Return to Orgs</Button></NavLink> to the organizations browser.
                </p> */}
            </div>
        )
    }

    renderEditRow() {
        if (this.props.relation.type === orgModel.UserRelationToOrganization.ADMIN ||
            this.props.relation.type === orgModel.UserRelationToOrganization.OWNER) {
            return (
                <p style={{ textAlign: 'center' }}>
                    As the owner of this group, you may <NavLink to={`/editOrganization/${this.props.organization!.id}`}><Button icon="edit">Edit</Button></NavLink> it.
                </p>
            )
        }
    }

    renderEditButton() {
        if (this.props.relation.type === orgModel.UserRelationToOrganization.ADMIN ||
            this.props.relation.type === orgModel.UserRelationToOrganization.OWNER) {
            return (
                <NavLink to={`/editOrganization/${this.props.organization!.id}`}><Button icon="edit">Edit This Organization</Button></NavLink>
            )
        }
    }

    renderOrg() {
        // apparently TS is not smart enough to know this from the conditional branch in render()!
        if (!this.props.organization) {
            return
        }
        return (
            <div className="ViewOrganization-org-description-org scrollable-flex-column">
                <div className="ViewOrganization-org-description"
                    dangerouslySetInnerHTML={({ __html: Marked.parse(this.props.organization.description || '') })}
                />
            </div>
        )
    }

    // TODO: this should be a component, so we can pick up all the good stuff, which is now commented out...
    renderOwnerInfo(org: orgModel.Organization) {
        return (
            <div className="ownerTable">
                {/* <div className="avatarCol">
                    <Avatar user={org.owner.user} size={60} />
                </div> */}
                <div className="proprietorCol">

                    <div className="owner">
                        <a href={"/#people/" + org.owner.username} target="_blank">{org.owner.username}</a>
                        {' '}
                        ❨{org.owner.username}❩
                                </div>
                    {/* <div className="profileOrganization">
                        {org.owner.user.organization}
                    </div>
                    <div className="profileOrganization">
                        {org.owner.user.city}, {org.owner.user.state}, {org.owner.user.country}
                    </div> */}
                </div>
            </div>
        )
    }

    renderOrgHeader() {
        // apparently TS is not smart enough to know this from the conditional branch in render()!
        if (!this.props.organization) {
            return
        }
        return (
            <OrganizationHeader organizationId={this.props.organization.id} />
        )
    }

    renderRelation(relation: orgModel.Relation) {
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
                        <div><Icon type="eye" style={{ marginRight: '4px' }} />You are not a member of this Organization</div>
                        <div style={{ marginTop: '10px' }}>
                            <Button
                                onClick={this.onJoinClick.bind(this)}>
                                Join this Organization
                            </Button>
                        </div>
                    </Tooltip>
                )
            case (orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING):
                return (
                    <div>
                        <div><Icon type="user" style={{ color: 'orange' }} spin={true} />Your membership <b>request</b> is pending</div>
                        <div><Button icon="delete" type="danger" onClick={this.onCancelJoinRequest.bind(this)}>Cancel Request</Button></div>
                    </div>
                )
            case (orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING):
                return (
                    <div>
                        <div><Icon type="user" style={{ color: 'blue' }} />You have been <b>invited</b> to join this Organization</div>
                        <div style={{ marginTop: '10px' }}>
                            <Button icon="check" type="default" onClick={this.onAcceptInvitation.bind(this)}>Accept Invitation</Button>
                            <Button icon="stop" type="danger" onClick={this.onRejectInvitation.bind(this)}>Reject Invitation</Button>
                        </div>
                    </div>
                )
            case (orgModel.UserRelationToOrganization.MEMBER):
                return (<span><Icon type="user" />Member</span>)
            case (orgModel.UserRelationToOrganization.ADMIN):
                return (<span><Icon type="unlock" />Admin</span>)
            case (orgModel.UserRelationToOrganization.OWNER):
                return (
                    <Tooltip
                        placement="bottomRight"
                        mouseEnterDelay={0.5}
                        title="You own this org"
                    >
                        <span><Icon type="unlock" theme="filled" style={{ marginRight: '4px' }} />You own this organization</span>
                    </Tooltip>
                )
        }
    }

    isMember(): boolean {
        if (!this.props.organization) {
            return false
        }
        if (this.props.relation.type === orgModel.UserRelationToOrganization.OWNER ||
            this.props.relation.type === orgModel.UserRelationToOrganization.ADMIN ||
            this.props.relation.type === orgModel.UserRelationToOrganization.MEMBER) {
            return true
        }
        return false
    }

    renderMembers() {
        if (!this.isMember()) {
            return (
                <p className="message">
                    Organization membership restricted to members only
                </p>
            )
        }
        let members: JSX.Element | Array<JSX.Element>
        const message = (
            <div style={{ fontStyle: 'italic', textAlign: 'center' }}>
                No members.
            </div>
        )
        if (this.props.organization.members.length === 0) {
            members = (
                <Alert type="info" message={message} />
            )
        } else {
            members = this.props.organization.members.map((member) => {
                return (
                    <div className="row" key={member.username}>
                        <div className="col0">
                            <Member member={member} avatarSize={50} />
                        </div>
                    </div>
                )
            })
        }
        return (
            <div className="infoTable">
                {members}
            </div>
        )
    }

    renderInfo() {
        // apparently TS is not smart enough to know this from the conditional branch in render()!
        if (!this.props.organization) {
            return
        }
        return (
            <Card
                title={<span><Icon type="info-circle"></Icon> info</span>}
                headStyle={{ backgroundColor: 'gray', color: 'white' }}
                className="slimCard">
                <div>
                    <div>
                        <div className="label">owner</div>
                    </div>
                    <div className="ownerTable">
                        <Member member={this.props.organization.owner} avatarSize={50} />
                        {/* TODO: fix avatar component */}
                        {/* <div className="avatarCol">
                            <Avatar user={this.props.organization.owner.username} size={60} />
                        </div>
                        <div className="proprietorCol">
                            <div className="owner">
                                <a href={"/#people/" + this.props.organization.owner.user.username} target="_blank">{this.props.organization.owner.user.realname}</a>
                                {' '}
                                ❨{this.props.organization.owner.user.username}❩
                                        </div>
                            <div className="profileOrganization">
                                {this.props.organization.owner.user.organization}
                            </div>
                            <div className="profileOrganization">
                                {this.props.organization.owner.user.city}, {this.props.organization.owner.user.state}, {this.props.organization.owner.user.country}
                            </div>
                        </div> */}
                    </div>
                    <div className='infoTable'>
                        <div className="row">
                            <div className="col1">
                                <span className="label">established</span>
                            </div>
                            <div className="col2">
                                <div className="createdAt">
                                    {Intl.DateTimeFormat('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    }).format(this.props.organization.createdAt)}
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col1">
                                <span className="label">last updated</span>
                            </div>
                            <div className="col2">
                                <div className="modifiedAt">
                                    {Intl.DateTimeFormat('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    }).format(this.props.organization.modifiedAt)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        )
    }

    renderGroupRequestsRow() {
        const relation = this.props.relation
        const requests = this.props.groupRequests
        const invitations = this.props.groupInvitations

        if (!(relation.type === orgModel.UserRelationToOrganization.ADMIN ||
            relation.type === orgModel.UserRelationToOrganization.OWNER)) {
            return
        }
        // TODO: bad. should not get here in this case...
        if (requests === null || invitations === null) {
            return
        }
        let inner
        if (requests.length) {
            inner = (
                <div>
                    group has no pending requests
                </div>
            )
        } else {
            inner = (
                <div>
                    <div>
                        <Icon type="exclamation-circle" theme="twoTone" twoToneColor="orange" /> group has
                        {' '}
                        <span style={{ fontWeight: 'bold' }}>{requests.length}</span>
                        {' '}
                        pending request{requests.length > 1 ? 's' : ''}
                        {' '}
                        and
                        {' '}
                        <span style={{ fontWeight: 'bold' }}>{invitations.length}</span>
                        {' '}
                        pending request{invitations.length > 1 ? 's' : ''}

                    </div>
                    <div>
                        <NavLink to={"/manageOrganizationRequests/" + this.props.organization.id}>
                            <Button>Manage Requests</Button>
                        </NavLink>
                    </div>
                </div>
            )
        }
        return (
            <div className="row">
                <div className="col1">
                    <span className="label">admin</span>
                </div>
                <div className="col2">
                    <div className="relation">
                        {inner}
                    </div>
                </div>
            </div>

        )
    }

    renderGroupRequests(requests: Array<requestModel.Request>, invitations: Array<requestModel.Request>) {
        if (!requests.length) {
            return (
                <div className="message">
                    No pending group requests
                </div>
            )
        } else {
            return (
                <div>
                    <div>
                        <Icon type="exclamation-circle" theme="twoTone" twoToneColor="orange" /> There
                        {' '}
                        {requests.length > 1 ? 'are' : 'is'}
                        {' '}
                        <span style={{ fontWeight: 'bold' }}>{requests.length}</span>
                        {' '}
                        pending request{requests.length > 1 ? 's' : ''}
                        {' '}
                        and
                        {' '}
                        <span style={{ fontWeight: 'bold' }}>{invitations.length}</span>
                        {' '}
                        pending invitation{invitations.length > 1 ? 's' : ''}
                    </div>
                    <div>
                        <NavLink to={"/manageOrganizationRequests/" + this.props.organization!.id}>
                            <Button>Manage Requests</Button>
                        </NavLink>
                    </div>
                </div>
            )
        }
        // return (
        //     <div className="row">
        //         <div className="col1">
        //             <span className="label">admin</span>
        //         </div>
        //         <div className="col2">
        //             <div className="relation">
        //                 {inner}
        //             </div>
        //         </div>
        //     </div>

        // )

        // return (
        //     <div>
        //         <div>
        //             <Icon type="exclamation-circle" theme="twoTone" twoToneColor="orange" /> group has
        //             {' '}
        //             <span style={{ fontWeight: 'bold' }}>{org.adminRequests.length}</span>
        //             {' '}
        //             pending request{org.adminRequests.length > 1 ? 's' : ''}
        //         </div>
        //         <div>
        //             <NavLink to={"/manageOrganizationRequests/" + this.props.organization!.id}>
        //                 <Button>Manage Requests</Button>
        //             </NavLink>
        //         </div>
        //     </div>
        // )
    }

    renderRelationClass(relation: orgModel.Relation) {
        switch (relation.type) {
            case (orgModel.UserRelationToOrganization.NONE):
                return 'infoBox'
            case (orgModel.UserRelationToOrganization.VIEW):
                return 'infoBox'
            case (orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING):
                return 'infoBox relationRequestPending'
            case (orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING):
                return 'infoBox relationInvitationPending'
            case (orgModel.UserRelationToOrganization.MEMBER):
                return 'infoBox'
            case (orgModel.UserRelationToOrganization.ADMIN):
                return 'infoBox'
            case (orgModel.UserRelationToOrganization.OWNER):
                return 'infoBox'
        }
    }

    renderUserRelationship() {
        // apparently TS is not smart enough to know this from the conditional branch in render()!
        return (
            <form className="infoTable">
                {/* <div className="row">
                    <div className="col1">
                        <span className="label">your relation</span>
                    </div>
                    <div className="col2">
                        <div className='relation'>
                            {this.renderRelation(this.props.organization)}
                        </div>
                    </div>
                </div> */}
                {this.renderGroupRequestsRow()}
            </form>
        )
    }

    renderAdminTasks() {
        const relation = this.props.relation
        if (!(relation.type === orgModel.UserRelationToOrganization.ADMIN ||
            relation.type === orgModel.UserRelationToOrganization.OWNER)) {
            return
        }
        // TODO: ditto -- silly to test both conditions (this is only to make TS happy btw)
        const { groupRequests, groupInvitations } = this.props
        if (groupInvitations === null || groupRequests === null) {
            return
        }
        const count = groupRequests.length + groupInvitations.length
        const title = (
            <span><Icon type="unlock" />
                {' '}
                group requests
                {' '}
                <span className="titleCount">({count})</span>
            </span>
        )
        return (
            <div className="adminTasksBox">
                <Card
                    className="slimCard adminTasksCard"
                    headStyle={{ backgroundColor: 'gray', color: 'white' }}
                    title={title} >
                    {this.renderGroupRequests(groupRequests, groupInvitations)}
                </Card>
            </div>
        )
    }

    renderJoinButton() {
        if (!this.props.organization) {
            return
        }
        if (this.props.relation.type !== orgModel.UserRelationToOrganization.VIEW) {
            return
        }
        return (
            <Button
                onClick={this.onJoinClick.bind(this)}
            >
                Join this Organization
                </Button>
        )
    }

    renderHeader() {
        const breadcrumbs = (
            <div style={{ flex: '0 0 auto' }}>
                {/* <span>
                    Viewing Org "
                    {this.props.organization && this.props.organization.name}
                    "
                </span> */}
                {/* <span>
                    {this.props.organization && this.props.organization.name}
                </span> */}
            </div>
        )
        const buttons = (
            <React.Fragment>
                {this.renderEditButton()}
                {this.renderJoinButton()}
                <Button shape="circle" icon="info" onClick={this.onShowInfo.bind(this)}></Button>
            </React.Fragment>
        )
        return (
            <Header breadcrumbs={breadcrumbs} buttons={buttons} />
        )
    }

    renderLoadingHeader() {
        const breadcrumbs = (
            <span>
                Loading Org...
            </span>
        )
        return (
            <Header breadcrumbs={breadcrumbs} />
        )
    }

    renderMembersCard() {
        const extras = [
            (
                <NavLink
                    key="viewMembers"
                    to={`/viewMembers/${this.props.organization!.id}`}>
                    <Button
                        onClick={this.onViewMembers.bind(this)}
                        icon="team"></Button>
                </NavLink>
            )
        ]
        if (!this.props.organization) {
            return
        }
        // if (this.props.organization.relation.type === UserRelationToOrganization.OWNER ||
        //     this.props.organization.relation.type === UserRelationToOrganization.ADMIN) {
        //     extras.push((
        //         <Button icon="setting"></Button>
        //     ))
        // }
        let memberCount
        if (this.isMember()) {
            memberCount = (
                <span className="titleCount">({this.props.organization.members.length})</span>
            )
        } else {
            memberCount = ''
        }
        const title = (
            <span>
                <Icon type="team" />
                members
                {memberCount}
            </span>
        )
        return (
            <Card
                className="slimCard membersCard"
                headStyle={{ backgroundColor: 'gray', color: 'white' }}
                title={title}
                extra={extras}
            >
                {this.renderMembers()}
            </Card>
        )
    }

    renderMembersTab() {
        const extras = [
            (
                <NavLink
                    key="viewMembers"
                    to={`/viewMembers/${this.props.organization!.id}`}>
                    <Button
                        onClick={this.onViewMembers.bind(this)}
                        size="small"
                        icon="team"></Button>
                </NavLink>
            )
        ]

        return (
            <div className="scrollable-flex-column">
                <div className="ViewOrganization-tabPaneToolbar">
                    {extras}
                </div>
                {this.renderMembers()}
            </div>
        )
    }

    onReadNotification(notificationId: string) {
        this.props.onReadNotification(notificationId);
    }

    renderNotificationsCard() {
        const count = (
            <span className="titleCount">(0)</span>
        )
        const title = (
            <span>
                <Icon type="notification" />
                notifications
            </span>
        )
        let notifications
        if (this.props.notifications.length === 0) {
            notifications = (
                <div className="message">No unread notifications</div>
            )
        } else {
            notifications = (
                <Notifications
                    notifications={this.props.notifications}
                    showOrg={false}
                    onRead={this.onReadNotification.bind(this)} />
            )
        }
        return (
            <Card className="slimCard"
                style={{ marginBottom: '10px' }}
                headStyle={{ backgroundColor: 'gray', color: 'white' }}
                title={title}>
                {notifications}
            </Card>
        )
    }


    renderNotificationsTab() {
        const count = (
            <span className="titleCount">(0)</span>
        )
        const title = (
            <span>
                <Icon type="notification" />
                notifications
            </span>
        )
        let notifications
        if (this.props.notifications.length === 0) {
            notifications = (
                <div className="message">No unread notifications</div>
            )
        } else {
            notifications = (
                <Notifications
                    notifications={this.props.notifications}
                    showOrg={false}
                    onRead={this.onReadNotification.bind(this)} />
            )
        }
        return (
            <React.Fragment>
                {notifications}
            </React.Fragment>
        )
    }

    renderFeedTab() {
        const count = (
            <span className="titleCount">(0)</span>
        )
        const title = (
            <span>
                <Icon type="notification" />
                notifications
            </span>
        )
        let notifications
        if (this.props.notifications.length === 0) {
            notifications = (
                <div className="message">No unread notifications</div>
            )
        } else {
            notifications = (
                <Notifications
                    notifications={this.props.notifications}
                    showOrg={false}
                    onRead={this.onReadNotification.bind(this)} />
            )
        }
        const extras = [
            (
                <Button
                    key="feeds"
                    size="small"
                    href="/#feeds"
                    target=" _blank">
                    <Icon type="notification" />{' '}View All Your KBase Feeds
                </Button>
            )
        ]
        return (
            <React.Fragment>
                <div className="ViewOrganization-tabPaneToolbar">
                    {extras}
                </div>
                <div className="ViewOrganization-tabPaneHeader">updates</div>
                <p className="message">** org updates not yet available **</p>
                <div className="ViewOrganization-tabPaneHeader">notifications</div>
                {notifications}

            </React.Fragment>
        )
    }

    onAcceptRequest(request: requestModel.Request) {
        this.props.onAcceptRequest(request)
    }

    renderInboxCard() {
        // only show the inbox for admin and owner.
        if (!(this.props.relation.type === orgModel.UserRelationToOrganization.ADMIN ||
            this.props.relation.type === orgModel.UserRelationToOrganization.OWNER)) {
            return
        }

        const extras: Array<JSX.Element> = []
        const count = this.props.requestInbox.length
        const title = (
            <span>
                <Icon type="inbox" />
                inbox
                <span className="titleCount">
                    ({count})
                </span>
            </span>
        )
        let inbox
        if (this.props.requestInbox.length === 0) {
            inbox = (
                <div className="message">
                    No pending organization requests for you
                </div>
            )
        } else {
            const inboxItems = this.props.requestInbox.map((request) => {
                return (
                    <div key={request.id}>
                        <InboxRequest
                            request={request}
                            showOrg={false}
                            onAcceptInboxRequest={this.onAcceptRequest.bind(this)} />
                    </div>
                )
            })
            inbox = (
                <div style={{ maxHeight: '30em', overflowY: 'auto' }}>
                    {inboxItems}
                </div>
            )
        }
        return (
            <Card className="slimCard outboxCard"
                style={{ marginBottom: '10px' }}
                headStyle={{ backgroundColor: 'gray', color: 'white' }}
                title={title}
                extra={extras}>
                {inbox}
            </Card>
        )

    }

    renderInboxTabHeader() {
        const extras = [
            (
                <NavLink
                    key="manageRequests"
                    to={`/manageOrganizationRequests/${this.props.organization!.id}`}>
                    <Button
                        onClick={this.onViewMembers.bind(this)}
                        size="small"
                        icon="inbox">Manage Requests</Button>
                </NavLink>
            )
        ]
        return (
            <div className="ViewOrganization-tabPaneToolbar">
                {extras}
            </div>
        )
    }


    renderInboxTab() {
        // only show the inbox for admin and owner.
        if (!(this.props.relation.type === orgModel.UserRelationToOrganization.ADMIN ||
            this.props.relation.type === orgModel.UserRelationToOrganization.OWNER)) {
            return
        }

        const extras = [
            (
                <NavLink
                    key="manageRequests"
                    to={`/manageOrganizationRequests/${this.props.organization!.id}`}>
                    <Button
                        onClick={this.onViewMembers.bind(this)}
                        size="small"
                        icon="inbox">Manage Requests</Button>
                </NavLink>
            )
        ]

        let inbox
        if (this.props.requestInbox.length === 0) {
            inbox = (
                <div className="message">
                    No pending organization requests for you
                </div>
            )
        } else {
            const requests = this.props.requestInbox.map((request) => {
                return (
                    <div key={request.id}>
                        <InboxRequest
                            request={request}
                            showOrg={false}
                            onAcceptInboxRequest={this.onAcceptRequest.bind(this)} />
                    </div>
                )
            })
            inbox = (
                <div style={{ overflowY: 'auto' }}>
                    {requests}
                </div>
            )
        }
        return (
            <React.Fragment>
                {inbox}
            </React.Fragment>
        )
    }

    renderOutboxCard() {
        // if (this.props.relation.type !== orgModel.UserRelationToOrganization.MEMBER) {
        //     return
        // }
        const extras: Array<JSX.Element> = []
        const count = this.props.requestOutbox.length
        const title = (
            <span>
                <Icon type="export" />
                outbox
                <span className="titleCount">
                    ({count})
                </span>
            </span>
        )
        let outbox
        if (this.props.requestOutbox.length === 0) {
            outbox = (
                <div className="message">
                    No pending organization requests from you
                </div>
            )
        } else {
            const outboxItems = this.props.requestOutbox.map((request) => {
                return (
                    <React.Fragment key={request.id}>
                        <OutboxRequest request={request} showOrg={false} />
                    </React.Fragment>
                )
            })
            outbox = (
                <div style={{ maxHeight: '30em', overflowY: 'auto' }}>
                    {outboxItems}
                </div>
            )
        }
        return (
            <Card className="slimCard outboxCard"
                style={{ marginBottom: '10px' }}
                headStyle={{ backgroundColor: 'gray', color: 'white' }}
                title={title}
                extra={extras}>
                {outbox}
            </Card>
        )

    }

    renderOutboxTabHeader() {
        return (
            <div className="ViewOrganization-tabPaneToolbar">
                {' '}
            </div>
        )
    }

    renderOutboxTab() {
        let outbox
        if (this.props.requestOutbox.length === 0) {
            outbox = (
                <div className="message">
                    No pending organization requests from you
                </div>
            )
        } else {
            const outboxItems = this.props.requestOutbox.map((request) => {
                return (
                    <React.Fragment key={request.id}>
                        <OutboxRequest request={request} showOrg={false} />
                    </React.Fragment>
                )
            })
            outbox = (
                <div style={{ overflowY: 'auto' }}>
                    {outboxItems}
                </div>
            )
        }
        return (
            <React.Fragment>
                <div className="ViewOrganization-tabPageToolbar">

                </div>
                {outbox}
            </React.Fragment>
        )
    }

    renderNarrativeMenu(narrative: orgModel.NarrativeResource) {
        const relation = this.props.relation
        const isAdmin = (relation.type === orgModel.UserRelationToOrganization.OWNER ||
            relation.type === orgModel.UserRelationToOrganization.ADMIN)
        let menu
        switch (relation.type) {
            case (orgModel.UserRelationToOrganization.NONE):
                // should never occur
                break;
            case (orgModel.UserRelationToOrganization.VIEW):
            case (orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING):
            case (orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING):
            case (orgModel.UserRelationToOrganization.MEMBER):
                break;
            case (orgModel.UserRelationToOrganization.ADMIN):
            case (orgModel.UserRelationToOrganization.OWNER):
                menu = (
                    <Menu onClick={({ key }) => { this.onNarrativeMenu(key, narrative) }}>
                        <Menu.Item key="removeNarrative">
                            <Icon type="delete" /> Remove Narrative from Organization
                        </Menu.Item>
                    </Menu>
                )
        }
        if (!menu) {
            return
        }
        return (
            <Dropdown overlay={menu} trigger={['click']}>
                <Button shape="circle">
                    <Icon type="setting" theme="filled" style={{ fontSize: '120%' }} />
                </Button>
            </Dropdown>
        )
    }

    renderNarratives() {
        if (!this.isMember()) {
            return (
                <Card
                    className="slimCard  narratives"
                    headStyle={{ backgroundColor: 'gray', color: 'white' }}
                    title={<span><Icon type="folder-open" /> narratives</span>}
                >
                    <p style={{ textAlign: 'center', fontStyle: 'italic' }}>
                        Narratives are restricted to members only
                </p>
                </Card>
            )
        }
        const extras = [
            (
                <NavLink
                    key="requestAddNarrative"
                    to={`/requestAddNarrative/${this.props.organization!.id}`}>
                    <Button
                        onClick={this.onRequestAddNarrative.bind(this)}>
                        <Icon type="plus" /> Add a Narrative
                    </Button>
                </NavLink>
            )
        ]

        if (this.props.organization.narratives.length === 0) {
            const message = (
                <div className="message">
                    No Narratives are yet associated with this Organization
                </div>
            )
            return (
                <Card
                    className="slimCard  narratives"
                    headStyle={{ backgroundColor: 'gray', color: 'white' }}
                    title={<span><Icon type="folder-open" /> narratives (Ø)</span>}
                    extra={extras}
                >
                    <Alert type="info" message={message} />
                </Card>
            )

        }

        const narrativesTable = this.props.organization.narratives.map((narrative) => {
            // create buttons or not, depending on being an admin

            return (
                <div className="narrative simpleCard" key={String(narrative.workspaceId)}>
                    <div className="dataCol">
                        <OrganizationNarrative
                            narrative={narrative}
                            onGetViewAccess={this.props.onGetViewAccess} />
                    </div>
                    <div className="buttonCol">
                        {this.renderNarrativeMenu(narrative)}
                    </div>
                </div>
            )
        })

        const narrativeCount = this.props.organization.narratives.length
        const title = (
            <span>
                <Icon type="folder-open" />
                narratives
                {' '}
                <span className="titleCount">({narrativeCount})</span>
            </span>
        )
        return (
            <Card
                className="slimCard narratives narrativesCard scrollable-flex-column"
                headStyle={{ backgroundColor: 'gray', color: 'white' }}
                title={title}
                extra={extras}
            >
                <div className="narrativesTable">
                    {narrativesTable}
                </div>
            </Card>
        )
    }

    renderCombo() {
        const isAdmin = (this.props.relation.type === orgModel.UserRelationToOrganization.ADMIN ||
            this.props.relation.type === orgModel.UserRelationToOrganization.OWNER)

        const isMember = this.props.organization.isMember

        if (!isMember) {
            return (
                <p style={{ fontStyle: 'italic' }}>
                    The membership list is only available to members.
                </p>
            )
        }

        const tabs = []

        let memberCount
        if (this.props.organization.memberCount - 1) {
            memberCount = String(this.props.organization.memberCount - 1)
        } else {
            memberCount = 'Ø'
        }
        tabs.push((
            <Tabs.TabPane
                tab={<span><Icon type="team" />Members <span className="ViewOrganization-tabCount">({memberCount})</span></span>}
                key="members"
                style={{ flexDirection: 'column' }}>
                {this.renderMembersTab()}
            </Tabs.TabPane>
        ))

        // tabs.push((
        //     <Tabs.TabPane tab={<span><Icon type="notification" />Feed</span>} key="feed" style={{ flexDirection: 'column' }}>
        //         {this.renderNotificationsTab()}
        //     </Tabs.TabPane>
        // ))


        // tabs.push((
        //     <Tabs.TabPane tab={<span><Icon type="notification" />Feed</span>} key="news" style={{ flexDirection: 'column' }}>
        //         {this.renderFeedTab()}
        //     </Tabs.TabPane>
        // ))

        if (isMember) {
            if (isAdmin) {
                tabs.push((
                    <Tabs.TabPane tab={<span><Icon type="inbox" />Requests</span>} key="inbox" style={{ flexDirection: 'column' }}>
                        {this.renderInboxTabHeader()}
                        <div className="ViewOrganization-tabPaneHeader">inbox</div>
                        {this.renderInboxTab()}
                    </Tabs.TabPane>
                ))
            } else {
                const outboxSize = this.props.requestOutbox.length
                let titleCount
                if (outboxSize) {
                    titleCount = String(outboxSize)
                } else {
                    titleCount = 'Ø'
                }
                tabs.push((
                    <Tabs.TabPane tab={<span><Icon type="inbox" />Requests <span className="ViewOrganization-tabCount">({titleCount})</span></span>} key="outbox" style={{ flexDirection: 'column' }}>
                        {this.renderOutboxTabHeader()}
                        <div className="ViewOrganization-tabPaneHeader">outbox</div>
                        {this.renderOutboxTab()}
                    </Tabs.TabPane>
                ))
            }
        }



        return (
            <Tabs
                defaultActiveKey="news"
                className="ViewOrganization-tabs"
                animated={false}
                size="small"
                tabPosition="top"
            >
                {tabs}
            </Tabs>
        )
    }

    render() {
        switch (this.state.navigateTo) {
            case NavigateTo.REQUEST_ADD_NARRATIVE:
                return (
                    <Redirect to={"/requestAddNarrative"} />
                )
            case NavigateTo.NONE:
            default:
            // do nothing.
        }
        let accessModal
        if (this.state.requestAccess.narrative && this.props.organization) {
            // TODO: replace with our own implementation...n
            // accessModal = (
            //     <Drawer title="Request Access to Narrative"
            //         placement="right"
            //         closable={true}
            //         visible={true}
            //         onClose={() => { this.onCloseRequestAccess.call(this) }}
            //     >
            //         Requesting access...
            //     </Drawer>
            // )
            const relation = this.props.relation
            const isMember = relation.type === orgModel.UserRelationToOrganization.MEMBER ||
                relation.type === orgModel.UserRelationToOrganization.ADMIN ||
                relation.type === orgModel.UserRelationToOrganization.OWNER

            // another type narrowing hack 
            // TODO: restore this ... requestaccess component needs a container to load the username 
            // from the store
            // if (isMember) {
            //     accessModal = (
            //         <RequestAccess
            //             narrative={this.state.requestAccess.narrative}
            //             organization={this.props.organization}
            //             // member={member}
            //             onClose={() => { this.onCloseRequestAccess.call(this) }} />
            //     )
            // }
        }
        if (typeof this.props.organization !== 'undefined') {
            return (
                <div className="ViewOrganization  scrollable-flex-column">
                    {this.renderOrgHeader()}
                    {this.renderHeader()}

                    <div className="mainRow scrollable-flex-column">
                        <div className="mainColumn  scrollable-flex-column">
                            <div className="orgRow" style={{ minHeight: '0px' }}>
                                {this.renderOrg()}
                            </div>
                            <div className="narrativesRow scrollable-flex-column">
                                {this.renderNarratives()}
                            </div>
                        </div>
                        <div className="infoColumn">
                            {/* <div className={this.renderRelationClass(this.props.organization)}>
                                {this.renderAdminTasks()}
                            </div> */}
                            {/* {this.renderAdminTasks()} */}
                            {/* <div className="infoBox">
                                    {this.renderInfo()}
                                </div> */}
                            {this.renderCombo()}
                        </div>
                    </div>
                    {accessModal}
                </div>
            )
        }
        return (
            <div className="ViewOrganization">
                {this.renderLoadingHeader()}
                Loading...
            </div>
        )
    }
}

export default ViewOrganization