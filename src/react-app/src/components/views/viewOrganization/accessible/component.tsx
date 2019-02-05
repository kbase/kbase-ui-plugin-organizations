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
import MainMenu from '../../../menu/component';
import Members from './members/reduxAdapter'

import Requests from './requests/container'
import BriefOrganization from '../../organizationHeader/BriefOrganization';

enum NavigateTo {
    NONE = 0,
    REQUEST_ADD_NARRATIVE,
    MANAGE_MEMBERSHIP,
    VIEW_MEMBERS,
    MANAGE_REQUESTS,
    VIEW_ORGANIZATION,
    EDIT_ORGANIZATION,
    INVITE_USER
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
    openRequest: orgModel.RequestStatus
    groupRequests: Array<requestModel.Request> | null
    groupInvitations: Array<requestModel.Request> | null
    requestOutbox: Array<requestModel.Request>
    requestInbox: Array<requestModel.Request>
    notifications: Array<feedsModel.OrganizationNotification>
    onViewOrg: (id: string) => void
    onJoinOrg: () => void
    onCancelJoinRequest: (requestId: requestModel.RequestID) => void
    onAcceptInvitation: (requestId: requestModel.RequestID) => void
    onRejectInvitation: (requestId: requestModel.RequestID) => void
    onRemoveNarrative: (narrative: orgModel.NarrativeResource) => void
    onGetViewAccess: (narrative: orgModel.NarrativeResource) => void
    onAcceptRequest: (requestId: requestModel.RequestID) => void
    onReadNotification: (requestId: requestModel.RequestID) => void
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
        return (
            <Members organization={this.props.organization} relation={this.props.relation} />
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
        return (
            <div className="scrollable-flex-column">
                <div className="ViewOrganization-tabPaneToolbar">
                    {this.renderMembersToolbar()}
                </div>
                {this.renderMembers()}
            </div>
        )
    }

    onAcceptRequest(request: requestModel.Request) {
        this.props.onAcceptRequest(request.id)
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
                <Icon type="ellipsis" className="IconButton-hover" />
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

    renderMembersToolbar() {
        switch (this.props.relation.type) {
            case orgModel.UserRelationToOrganization.NONE:
                return (
                    <div className="toolbar">
                    </div>
                )

            case orgModel.UserRelationToOrganization.MEMBER:
                return (
                    <div className="toolbar">
                    </div>
                )

            case orgModel.UserRelationToOrganization.ADMIN:
                return (
                    <div className="toolbar">
                        <NavLink to={"/inviteUser/" + this.props.organization.id}>
                            <Button size="small"><Icon type="mail" /> Invite a User</Button>
                        </NavLink>
                    </div>
                )

            case orgModel.UserRelationToOrganization.OWNER:
                return (
                    <div className="toolbar">
                        <NavLink to={"/inviteUser/" + this.props.organization.id}>
                            <Button size="small"><Icon type="mail" /> Invite a User</Button>
                        </NavLink>
                    </div>
                )

        }
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

        if (isMember) {
            if (isAdmin) {
                const totalRequestCount = this.props.requestInbox.length + this.props.requestOutbox.length
                const totalRequests = (
                    <span className="ViewOrganization-tabCount">
                        ({totalRequestCount || 'Ø'})
                    </span>
                )
                tabs.push((
                    <Tabs.TabPane tab={<span><Icon type="inbox" />Requests {totalRequests} </span>} key="inbox" style={{ flexDirection: 'column' }}>
                        <Requests inbox={this.props.requestInbox} outbox={this.props.requestOutbox} relation={this.props.relation} />
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
                        <Requests inbox={[]} outbox={this.props.requestOutbox} relation={this.props.relation} />
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

    renderMenuButtons() {
        return (
            <span className="ButtonSet">
                <span className="ButtonSet-button">
                    {this.renderOrgMenu()}
                </span>

                <span className="ButtonSet-button">
                    <Button shape="circle" icon="info" onClick={this.onShowInfo.bind(this)}></Button>
                </span>
            </span>
        )
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

    renderOrgMenu() {
        const org = this.props.organization
        switch (this.props.relation.type) {
            case (orgModel.UserRelationToOrganization.NONE):
                // return (
                //     <span><Icon type="stop" />None</span>
                // )
                return (
                    <span>
                        <Button
                            type="primary"
                            onClick={this.onJoinClick.bind(this)}>
                            Join this Organization
                        </Button>
                    </span>
                )
            case (orgModel.UserRelationToOrganization.VIEW):
                return (
                    <span>
                        <Button
                            type="primary"
                            onClick={this.onJoinClick.bind(this)}>
                            Join this Organization
                        </Button>
                    </span>
                )
            case (orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING):
                return (
                    <span>
                        <Tooltip
                            placement="bottom"
                            mouseEnterDelay={0.5}
                            title="You have requested to join this Org; you may cancel your join request with this button"
                        >
                            <Button icon="delete" type="danger" onClick={this.onCancelJoinRequest.bind(this)}>Cancel Join Request</Button>
                        </Tooltip>
                    </span>

                )
            case (orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING):
                return (
                    <span>
                        <span>You have been invited to this organization: </span>
                        <Button icon="check" type="default" onClick={this.onAcceptInvitation.bind(this)}>Accept</Button>
                        <Button icon="stop" type="danger" onClick={this.onRejectInvitation.bind(this)}>Reject</Button>
                    </span>
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
                    <span>
                        <Dropdown overlay={menu} trigger={['click']}>
                            <Button shape="circle">
                                <Icon type="setting" theme="filled" style={{ fontSize: '120%' }} />
                            </Button>
                        </Dropdown>
                    </span>
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
                    <span>
                        <Dropdown overlay={adminMenu} trigger={['click']}>
                            <Button shape="circle">
                                <Icon type="setting" theme="filled" style={{ fontSize: '120%' }} />
                            </Button>
                        </Dropdown>
                    </span>
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
                    <span>
                        <Dropdown overlay={ownerMenu} trigger={['click']}>
                            <Button shape="circle">
                                <Icon type="setting" theme="filled" style={{ fontSize: '120%' }} />
                            </Button>
                        </Dropdown>
                    </span>
                )
        }
    }

    renderx() {
        switch (this.state.navigateTo) {
            case NavigateTo.REQUEST_ADD_NARRATIVE:
                return (
                    <Redirect to={"/requestAddNarrative"} />
                )
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
                    <MainMenu buttons={this.renderMenuButtons()} />
                    {this.renderOrgHeader()}
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

    render() {
        switch (this.state.navigateTo) {
            case NavigateTo.REQUEST_ADD_NARRATIVE:
                return (
                    <Redirect to={"/requestAddNarrative"} />
                )
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
            case NavigateTo.NONE:
            default:
            // do nothing.
        }

        const uorg = this.props.organization as unknown
        const borg = uorg as orgModel.BriefOrganization
        return (
            <div className="ViewOrganization  scrollable-flex-column">
                <MainMenu buttons={this.renderMenuButtons()} />
                <div style={{ borderBottom: '1px silver solid' }}>
                    <BriefOrganization organization={borg} openRequestsStatus={this.props.openRequest} />
                </div>
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
                        {this.renderCombo()}
                    </div>
                </div>
            </div>

        )

        // let accessModal
        // if (this.state.requestAccess.narrative && this.props.organization) {

        //     const relation = this.props.relation
        //     const isMember = relation.type === orgModel.UserRelationToOrganization.MEMBER ||
        //         relation.type === orgModel.UserRelationToOrganization.ADMIN ||
        //         relation.type === orgModel.UserRelationToOrganization.OWNER
        // }
        // if (typeof this.props.organization !== 'undefined') {
        //     return (
        //         <div className="ViewOrganization  scrollable-flex-column">
        //             <MainMenu buttons={this.renderMenuButtons()} />
        //             {this.renderOrgHeader()}
        //             <div className="mainRow scrollable-flex-column">
        //                 <div className="mainColumn  scrollable-flex-column">
        //                     <div className="orgRow" style={{ minHeight: '0px' }}>
        //                         {this.renderOrg()}
        //                     </div>
        //                     <div className="narrativesRow scrollable-flex-column">
        //                         {this.renderNarratives()}
        //                     </div>
        //                 </div>
        //                 <div className="infoColumn">
        //                     {this.renderCombo()}
        //                 </div>
        //             </div>
        //             {accessModal}
        //         </div>
        //     )
        // }
        // return (
        //     <div className="ViewOrganization">
        //         {this.renderLoadingHeader()}
        //         Loading...
        //     </div>
        // )
    }
}

export default ViewOrganization