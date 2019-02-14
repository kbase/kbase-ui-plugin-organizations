import * as React from 'react'
import { Marked } from 'marked-ts'
import { NavLink, Redirect } from 'react-router-dom'

import './component.css'

import { ViewOrgViewModel } from '../../../../types'
import { Button, Modal, Icon, Tooltip, Card, Dropdown, Menu, Alert, Tabs, Input, Select } from 'antd'
import Header from '../../../Header'
import Member from '../../../entities/MemberContainer'
import OrganizationHeader from '../../organizationHeader/loader'
import * as orgModel from '../../../../data/models/organization/model'
import * as requestModel from '../../../../data/models/requests'

import MainMenu from '../../../menu/component'
import Members from './members/reduxAdapter'

import Requests from './requests/container'
import BriefOrganization from '../../organizationHeader/BriefOrganization'
import RelatedOrganizations from './relatedOrgs/reduxAdapter'
import ManageRelatedOrganizations from './manageRelatedOrganizations/loader'
import InviteUser from './inviteUser/loader'
import Narratives from './narratives/component'

enum NavigateTo {
    NONE = 0,
    REQUEST_ADD_NARRATIVE,
    MANAGE_MEMBERSHIP,
    VIEW_MEMBERS,
    MANAGE_REQUESTS,
    VIEW_ORGANIZATION,
    EDIT_ORGANIZATION,
    INVITE_USER,
    BROWSER
}

enum AccordionState {
    UP = 0,
    DOWN
}

enum SubViews {
    NORMAL = 0,
    MANAGE_RELATED_ORGS,
    INVITE_USER
}

export interface ViewOrganizationState {
    showInfo: boolean
    navigateTo: NavigateTo
    requestAccess: {
        narrative: orgModel.NarrativeResource | null
    }
    accordionState: AccordionState
    subView: SubViews
}

export interface ViewOrganizationProps {
    viewModel: ViewOrgViewModel
    onViewOrg: (id: string) => void
    onReloadOrg: (id: string) => void
    onJoinOrg: () => void
    onCancelJoinRequest: (requestId: requestModel.RequestID) => void
    onAcceptInvitation: (requestId: requestModel.RequestID) => void
    onRejectInvitation: (requestId: requestModel.RequestID) => void
    onRemoveNarrative: (narrative: orgModel.NarrativeResource) => void
    onGetViewAccess: (narrative: orgModel.NarrativeResource) => void
    onAcceptRequest: (requestId: requestModel.RequestID) => void
    onSortNarratives: (sortBy: string) => void
    onSearchNarratives: (searchBy: string) => void
}

class ViewOrganization extends React.Component<ViewOrganizationProps, ViewOrganizationState> {
    constructor(props: ViewOrganizationProps) {
        super(props)

        this.state = {
            showInfo: false,
            navigateTo: NavigateTo.NONE,
            requestAccess: {
                narrative: null
            },
            accordionState: AccordionState.UP,
            subView: SubViews.NORMAL
        }
    }

    onManageRelatedOrgs() {
        this.setState({ subView: SubViews.MANAGE_RELATED_ORGS })
    }

    onInviteUser() {
        this.setState({ subView: SubViews.INVITE_USER })
    }

    onViewMembers() {
    }

    onJoinClick() {
        this.props.onJoinOrg()
    }

    onCancelJoinRequest() {
        const relation = this.props.viewModel.relation as orgModel.MembershipRequestPendingRelation
        this.props.onCancelJoinRequest(relation.requestId)
    }

    onAcceptInvitation() {
        if (!this.props.viewModel.organization) {
            return
        }
        const relation = this.props.viewModel.relation as orgModel.MembershipRequestPendingRelation
        this.props.onAcceptInvitation(relation.requestId)
    }

    onRejectInvitation() {
        if (!this.props.viewModel.organization) {
            return
        }
        const relation = this.props.viewModel.relation as orgModel.MembershipRequestPendingRelation
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
        if (this.props.viewModel.relation.type === orgModel.UserRelationToOrganization.ADMIN ||
            this.props.viewModel.relation.type === orgModel.UserRelationToOrganization.OWNER) {
            return (
                <p style={{ textAlign: 'center' }}>
                    As the owner of this group, you may <NavLink to={`/editOrganization/${this.props.viewModel.organization!.id}`}><Button icon="edit">Edit</Button></NavLink> it.
                </p>
            )
        }
    }

    renderEditButton() {
        if (this.props.viewModel.relation.type === orgModel.UserRelationToOrganization.ADMIN ||
            this.props.viewModel.relation.type === orgModel.UserRelationToOrganization.OWNER) {
            return (
                <NavLink to={`/editOrganization/${this.props.viewModel.organization!.id}`}><Button icon="edit">Edit This Organization</Button></NavLink>
            )
        }
    }

    renderOrg() {
        // apparently TS is not smart enough to know this from the conditional branch in render()!
        if (!this.props.viewModel.organization) {
            return
        }
        return (
            <div className="ViewOrganization-org-description-org scrollable-flex-column">
                <div className="ViewOrganization-org-description"
                    dangerouslySetInnerHTML={({ __html: Marked.parse(this.props.viewModel.organization.description || '') })}
                />
            </div>
        )
    }

    // TODO: this should be a component, so we can pick up all the good stuff, which is now commented out...
    renderOwnerInfo(org: orgModel.Organization) {
        return (
            <div className="ownerTable">
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
        if (!this.props.viewModel.organization) {
            return
        }
        return (
            <OrganizationHeader organizationId={this.props.viewModel.organization.id} />
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
                        title="You are not a member of this org; you may request membership"
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
        if (!this.props.viewModel.organization) {
            return false
        }
        if (this.props.viewModel.relation.type === orgModel.UserRelationToOrganization.OWNER ||
            this.props.viewModel.relation.type === orgModel.UserRelationToOrganization.ADMIN ||
            this.props.viewModel.relation.type === orgModel.UserRelationToOrganization.MEMBER) {
            return true
        }
        return false
    }

    renderMembers() {
        if (!this.isMember()) {
            return (
                <Alert message="Membership is only available to members" type="info" />
            )
        }
        return (
            <Members
                organization={this.props.viewModel.organization}
                relation={this.props.viewModel.relation}
                onReloadOrg={this.props.onReloadOrg} />
        )

    }

    renderInfo() {
        // apparently TS is not smart enough to know this from the conditional branch in render()!
        if (!this.props.viewModel.organization) {
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
                    <div className="ViewOrganization-ownerTable">
                        <Member member={this.props.viewModel.organization.owner} avatarSize={50} />
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
                    <div className='ViewOrganization-infoTable'>
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
                                    }).format(this.props.viewModel.organization.createdAt)}
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
                                    }).format(this.props.viewModel.organization.modifiedAt)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        )
    }

    renderGroupRequestsRow() {
        const relation = this.props.viewModel.relation
        const requests = this.props.viewModel.groupRequests
        const invitations = this.props.viewModel.groupInvitations

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
                        <NavLink to={"/manageOrganizationRequests/" + this.props.viewModel.organization.id}>
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
                        <NavLink to={"/manageOrganizationRequests/" + this.props.viewModel.organization!.id}>
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
        const relation = this.props.viewModel.relation
        if (!(relation.type === orgModel.UserRelationToOrganization.ADMIN ||
            relation.type === orgModel.UserRelationToOrganization.OWNER)) {
            return
        }
        // TODO: ditto -- silly to test both conditions (this is only to make TS happy btw)
        const { groupRequests, groupInvitations } = this.props.viewModel
        if (groupInvitations === null || groupRequests === null) {
            return
        }
        const count = groupRequests.length + groupInvitations.length
        const title = (
            <span><Icon type="unlock" />
                {' '}
                group requests
                {' '}
                <span className="ViewOrganization-titleCount">({count})</span>
            </span>
        )
        return (
            <div className="ViewOrganization-adminTasksBox">
                <Card
                    className="slimCard ViewOrganization-adminTasksCard"
                    headStyle={{ backgroundColor: 'gray', color: 'white' }}
                    title={title} >
                    {this.renderGroupRequests(groupRequests, groupInvitations)}
                </Card>
            </div>
        )
    }

    renderJoinButton() {
        if (!this.props.viewModel.organization) {
            return
        }
        if (this.props.viewModel.relation.type !== orgModel.UserRelationToOrganization.VIEW) {
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

    renderMembersTab() {
        return (
            <div className="ViewOrganization-membersCol scrollable-flex-column">
                {this.renderMembersToolbar()}

                {this.renderMembers()}
            </div>
        )
    }

    onAcceptRequest(request: requestModel.Request) {
        this.props.onAcceptRequest(request.id)
    }


    renderMembersToolbar() {
        switch (this.props.viewModel.relation.type) {
            case orgModel.UserRelationToOrganization.NONE:
                return
            case orgModel.UserRelationToOrganization.MEMBER:
                return
            case orgModel.UserRelationToOrganization.ADMIN:
                return (
                    <div className="ViewOrganization-tabPaneToolbar">
                        <Button size="small" onClick={this.onInviteUser.bind(this)}><Icon type="mail" /> Invite a User</Button>
                    </div>
                )
            case orgModel.UserRelationToOrganization.OWNER:
                return (
                    <div className="ViewOrganization-tabPaneToolbar">
                        <Button size="small" onClick={this.onInviteUser.bind(this)}><Icon type="mail" /> Invite a User</Button>
                    </div>
                )
        }
    }

    renderCombo() {
        const isAdmin = (this.props.viewModel.relation.type === orgModel.UserRelationToOrganization.ADMIN ||
            this.props.viewModel.relation.type === orgModel.UserRelationToOrganization.OWNER)

        const isMember = this.props.viewModel.organization.isMember

        // if (!isMember) {
        //     return (
        //         <p style={{ fontStyle: 'italic' }}>
        //             The membership list is only available to members.
        //         </p>
        //     )
        // }

        const tabs = []

        let memberCount
        if (this.props.viewModel.organization.memberCount - 1) {
            memberCount = String(this.props.viewModel.organization.memberCount - 1)
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
                const totalRequestCount = this.props.viewModel.requestInbox.length + this.props.viewModel.requestOutbox.length
                const totalRequests = (
                    <span className="ViewOrganization-tabCount">
                        ({totalRequestCount || 'Ø'})
                    </span>
                )
                tabs.push((
                    <Tabs.TabPane tab={<span><Icon type="inbox" />Requests {totalRequests} </span>} key="inbox" style={{ flexDirection: 'column' }}>
                        <Requests inbox={this.props.viewModel.requestInbox} outbox={this.props.viewModel.requestOutbox} relation={this.props.viewModel.relation} />
                    </Tabs.TabPane>
                ))
            } else {
                const outboxSize = this.props.viewModel.requestOutbox.length
                let titleCount
                if (outboxSize) {
                    titleCount = String(outboxSize)
                } else {
                    titleCount = 'Ø'
                }
                tabs.push((
                    <Tabs.TabPane tab={<span><Icon type="inbox" />Requests <span className="ViewOrganization-tabCount">({titleCount})</span></span>} key="outbox" style={{ flexDirection: 'column' }}>
                        <Requests inbox={[]} outbox={this.props.viewModel.requestOutbox} relation={this.props.viewModel.relation} />
                    </Tabs.TabPane>
                ))
            }
        }

        const relatedOrgCount = this.props.viewModel.organization.relatedOrganizations.length
        const relatedOrgTab = (
            <span>
                <Icon type="team" />
                Related Orgs <span className="ViewOrganization-tabCount">({relatedOrgCount})</span>
            </span>
        )
        tabs.push((
            <Tabs.TabPane tab={relatedOrgTab} key="relatedorgs" style={{ flexDirection: 'column' }}>
                <RelatedOrganizations
                    relatedOrganizations={this.props.viewModel.organization.relatedOrganizations}
                    organization={this.props.viewModel.organization}
                    onManageRelatedOrgs={() => { this.onManageRelatedOrgs() }} />
            </Tabs.TabPane>
        ))

        return (
            <Tabs
                defaultActiveKey="members"
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
                    <Button type="danger" onClick={this.onNavigateToBrowser.bind(this)} >
                        <Icon type="rollback" />{' '}Done
                    </Button>
                </span>
                <span className="ButtonSet-button">
                    {this.renderOrgMenu()}
                </span>

                {/* <span className="ButtonSet-button">
                    <Button shape="circle" icon="info" onClick={this.onShowInfo.bind(this)}></Button>
                </span> */}
            </span>
        )
    }

    onNavigateToBrowser() {
        this.setState({ navigateTo: NavigateTo.BROWSER })
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
                this.setState({ subView: SubViews.INVITE_USER })
                break
            case 'manageRequests':
                this.setState({ navigateTo: NavigateTo.MANAGE_REQUESTS })
                break
            case 'addNarrative':
                this.setState({ navigateTo: NavigateTo.REQUEST_ADD_NARRATIVE })
                break
            case 'manageRelatedOrgs':
                this.setState({ subView: SubViews.MANAGE_RELATED_ORGS })
                break
        }
    }

    renderOrgMenu() {
        const org = this.props.viewModel.organization
        switch (this.props.viewModel.relation.type) {
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
                    <div className="ViewOrganization-invitationPendingCard">
                        <span>You have been invited to this organization: </span>
                        <Button icon="check" type="default" size="small" onClick={this.onAcceptInvitation.bind(this)}>Accept</Button>
                        <Button icon="stop" type="danger" size="small" onClick={this.onRejectInvitation.bind(this)}>Reject</Button>
                    </div>
                )
            case (orgModel.UserRelationToOrganization.MEMBER):
                const menu = (
                    <Menu onClick={this.onMenuClick.bind(this)}>
                        <Menu.Item key="manageMyMembership">
                            <Icon type="user" />{' '}Manage My Membership
                        </Menu.Item>
                        <Menu.Item key="addNarrative">
                            <Icon type="file" />{' '}Add Narrative
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
                            <Icon type="user" />{' '}Manage My Membership
                        </Menu.Item>
                        <Menu.Item key="editOrg" >
                            <Icon type="edit" />{' '}Edit this Org
                        </Menu.Item>
                        <Menu.Item key="inviteUser">
                            <Icon type="mail" />{' '}Invite User
                        </Menu.Item>
                        <Menu.Item key="manageRelatedOrgs">
                            <Icon type="team" />{' '}Manage Related Orgs
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
                        <Menu.Item key="manageMyMembership">
                            <Icon type="user" />{' '}Manage My Membership
                        </Menu.Item>
                        <Menu.Item key="editOrg">
                            <Icon type="edit" />{' '}Edit this Org
                        </Menu.Item>
                        <Menu.Item key="inviteUser">
                            <Icon type="mail" />{' '}Invite User
                        </Menu.Item>
                        <Menu.Item key="addNarrative">
                            <Icon type="file" />{' '}Add Narrative
                        </Menu.Item>
                        <Menu.Item key="manageRelatedOrgs">
                            <Icon type="team" />{' '}Manage Related Orgs
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


    toggleAccordion() {
        this.setState({
            accordionState: this.state.accordionState === AccordionState.UP ? AccordionState.DOWN : AccordionState.UP
        })
    }

    renderAccordionControl() {
        let iconType
        if (this.state.accordionState === AccordionState.UP) {
            iconType = 'caret-down'
        } else {
            iconType = 'caret-up'
        }
        return (
            <div className="ViewOrganization-accordion" onClick={this.toggleAccordion.bind(this)}>
                <div className="ViewOrganization-accordionCol1">
                    <div className="ViewOrganization-accordionRow1">
                    </div>
                    <div className="ViewOrganization-accordionRow2">
                    </div>
                    <div className="ViewOrganization-accordionRow3">
                    </div>
                </div>
                <div className="ViewOrganization-accordionCol2">
                    <div className="ViewOrganization-accordionRow1">
                    </div>
                    <div className="ViewOrganization-accordionRow2">
                        <Icon type={iconType} />
                    </div>
                    <div className="ViewOrganization-accordionRow3">
                    </div>
                    {/* <div className="ViewOrganization-accordionIcon">
                        <Icon type={iconType} />
                    </div> */}
                </div>
                <div className="ViewOrganization-accordionCol3">
                    <div className="ViewOrganization-accordionRow1">
                    </div>
                    <div className="ViewOrganization-accordionRow2">
                    </div>
                    <div className="ViewOrganization-accordionRow3">
                    </div>
                </div>


            </div>
        )
    }

    renderNormalView() {
        let orgRowClass
        let narrativesRowClass
        if (this.state.accordionState === AccordionState.UP) {
            orgRowClass = "ViewOrganization-orgRow ViewOrganization-accordionClosed"
            narrativesRowClass = "ViewOrganization-narrativesRow ViewOrganization-accordionOpen"
        } else {
            orgRowClass = "ViewOrganization-orgRow ViewOrganization-accordionOpen"
            narrativesRowClass = "ViewOrganization-narrativesRow ViewOrganization-accordionClosed"
        }
        orgRowClass += " scrollable-flex-column"
        narrativesRowClass += " scrollable-flex-column"
        return (
            <div className="ViewOrganization-mainRow scrollable-flex-column">
                <div className="ViewOrganization-mainColumn  scrollable-flex-column">
                    <div className={orgRowClass} style={{ minHeight: '0px' }}>
                        {this.renderOrg()}
                    </div>
                    <div className="ViewOrganization-accordionRow">
                        {this.renderAccordionControl()}
                    </div>
                    <div className={narrativesRowClass}>
                        {/* TODO: move these actions into a redux adapter for narratives 
                    */}
                        <Narratives
                            organization={this.props.viewModel.organization}
                            narratives={this.props.viewModel.narratives}
                            relation={this.props.viewModel.relation}
                            sortNarrativesBy={this.props.viewModel.sortNarrativesBy}
                            searchNarrativesBy={this.props.viewModel.searchNarrativesBy}
                            onSortNarratives={this.props.onSortNarratives}
                            onSearchNarratives={this.props.onSearchNarratives}
                            onRemoveNarrative={this.props.onRemoveNarrative}
                            onGetViewAccess={this.props.onGetViewAccess}
                            onRequestAddNarrative={this.onRequestAddNarrative.bind(this)}
                        />
                    </div>
                </div>
                <div className="ViewOrganization-infoColumn">
                    {this.renderCombo()}
                </div>
            </div>
        )
    }

    renderManageRelatedOrgsView() {
        const onFinish = () => {
            this.setState({
                subView: SubViews.NORMAL
            })
        }
        return (
            <ManageRelatedOrganizations
                // organization={this.props.viewModel.organization}
                // relatedOrganizations={[]}
                // relation={this.props.viewModel.relation}
                onFinish={onFinish} />
        )
    }

    renderInviteUsersView() {
        const onFinish = () => {
            this.setState({
                subView: SubViews.NORMAL
            })
        }
        return (
            <InviteUser onFinish={onFinish} organizationId={this.props.viewModel.organization.id} />
        )
    }

    getSubView() {
        switch (this.state.subView) {

            case SubViews.MANAGE_RELATED_ORGS:
                return this.renderManageRelatedOrgsView()
            case SubViews.INVITE_USER:
                return this.renderInviteUsersView()
            case SubViews.NORMAL:
            default:
                return this.renderNormalView()
        }
    }

    render() {
        switch (this.state.navigateTo) {
            case NavigateTo.REQUEST_ADD_NARRATIVE:
                return <Redirect to={"/requestAddNarrative/" + this.props.viewModel.organization.id} />
            case NavigateTo.MANAGE_MEMBERSHIP:
                return <Redirect push to={"/membership/" + this.props.viewModel.organization.id} />
            case NavigateTo.VIEW_MEMBERS:
                return <Redirect push to={"/viewMembers/" + this.props.viewModel.organization.id} />
            case NavigateTo.EDIT_ORGANIZATION:
                return <Redirect push to={"/editOrganization/" + this.props.viewModel.organization.id} />
            case NavigateTo.MANAGE_REQUESTS:
                return <Redirect push to={"/manageOrganizationRequests/" + this.props.viewModel.organization.id} />
            // case NavigateTo.INVITE_USER:
            //     return <Redirect push to={"/inviteUser/" + this.props.viewModel.organization.id} />
            case NavigateTo.VIEW_ORGANIZATION:
                return <Redirect push to={"/viewOrganization/" + this.props.viewModel.organization.id} />
            case NavigateTo.BROWSER:
                return <Redirect push to={"/organizations"} />
            case NavigateTo.NONE:
            default:
            // do nothing.
        }

        const uorg = this.props.viewModel.organization as unknown
        const borg = uorg as orgModel.BriefOrganization

        return (
            <div className="ViewOrganization  scrollable-flex-column">
                <MainMenu buttons={this.renderMenuButtons()} />
                <div style={{ borderBottom: '1px silver solid' }}>
                    <BriefOrganization organization={borg} openRequestsStatus={this.props.viewModel.openRequest} />
                </div>
                {this.getSubView()}
            </div>

        )
    }
}

export default ViewOrganization