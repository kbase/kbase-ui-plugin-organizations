import * as React from 'react'
import marked from 'marked'
import { NavLink } from 'react-router-dom'

import './ViewOrganization.css'

import { ViewOrgState, Organization, AppError, UserRelationToOrganization, MembershipRequestPendingRelation } from '../../types'
import { Button, Modal, Icon, Tooltip, Card } from 'antd'
import Header from '../Header'
import Avatar from '../Avatar'
import Member from '../Member';
import OrganizationHeader from '../organizationHeader/container'

export interface ViewOrganizationState {
    showInfo: boolean
}

export interface ViewOrganizationProps {
    state: ViewOrgState
    id: string
    organization?: Organization
    error?: AppError
    username: string
    onViewOrg: (id: string) => void
    onJoinOrg: () => void
    onCancelJoinRequest: (requestId: string) => void
    onAcceptInvitation: (requestId: string) => void
    onRejectInvitation: (requestId: string) => void
}

class ViewOrganization extends React.Component<ViewOrganizationProps, ViewOrganizationState> {
    constructor(props: ViewOrganizationProps) {
        super(props)

        this.state = {
            showInfo: false
        }

        this.props.onViewOrg(this.props.id)
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
        const relation = this.props.organization.relation as MembershipRequestPendingRelation
        this.props.onCancelJoinRequest(relation.requestId)
    }

    onAcceptInvitation() {
        if (!this.props.organization) {
            return
        }
        const relation = this.props.organization.relation as MembershipRequestPendingRelation
        this.props.onAcceptInvitation(relation.requestId)
    }

    onRejectInvitation() {
        if (!this.props.organization) {
            return
        }
        const relation = this.props.organization.relation as MembershipRequestPendingRelation
        this.props.onRejectInvitation(relation.requestId)
    }

    onShowInfo() {
        // this.setState({ showInfo: true })
        Modal.info({
            title: 'View Organization Help',
            width: '50em',
            content: (
                <div>
                    <p>This is the organizations viewer...</p>
                </div>
            )
        })
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
        if (this.props.organization!.owner.user.username === this.props.username) {
            return (
                <p style={{ textAlign: 'center' }}>
                    As the owner of this group, you may <NavLink to={`/editOrganization/${this.props.organization!.id}`}><Button icon="edit">Edit</Button></NavLink> it.
                </p>
            )
        }
    }

    renderEditButton() {
        if (this.props.organization!.owner.user.username === this.props.username) {
            return (
                <NavLink to={`/editOrganization/${this.props.organization!.id}`}><Button icon="edit">Edit</Button></NavLink>
            )
        }
    }

    renderOrg() {
        // apparently TS is not smart enough to know this from the conditional branch in render()!
        if (!this.props.organization) {
            return
        }
        return (
            <div className="org">
                {/* <div className="nameAndLogo">
                    <div className="avatar">
                        {this.renderOrgAvatar(this.props.organization)}
                    </div>
                    <div className="nameAndLink">
                        <div className="name">
                            {this.props.organization.name}
                        </div>
                        <div className="id">
                            <span className="label">permalink</span>{' '}
                            <span className="permalinkBase">https://narrative.kbase.us#orgs/</span>{this.props.organization.id}
                        </div>
                    </div>
                </div> */}
                <div className="description"
                    dangerouslySetInnerHTML={({ __html: marked(this.props.organization.description || '') })}
                />

            </div>
        )
    }

    renderOwnerInfo(org: Organization) {
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

    renderOrgHeader() {
        // apparently TS is not smart enough to know this from the conditional branch in render()!
        if (!this.props.organization) {
            return
        }
        return (
            <OrganizationHeader organization={this.props.organization} />
        )
        // return (
        //     <div className="orgHeader">
        //         <div className="avatar">
        //             {this.renderOrgAvatar(this.props.organization)}
        //         </div>
        //         <div className="orgInfo">
        //             <div className="name">
        //                 {this.props.organization.name}
        //             </div>
        //             <div className="id">
        //                 <span className="label">permalink</span>{' '}
        //                 <span className="permalinkBase">https://narrative.kbase.us#orgs/</span>{this.props.organization.id}
        //             </div>
        //         </div>
        //         <div className="ownerInfo">
        //             {this.renderOwnerInfo(this.props.organization)}
        //         </div>
        //         <div className="yourRelation">
        //             {this.renderRelation(this.props.organization)}
        //         </div>

        //     </div>
        // )
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
                src={this.getOrgAvatarUrl(org)} />
        )
    }


    renderRelation(org: Organization) {
        switch (org.relation.type) {
            case (UserRelationToOrganization.NONE):
                return (
                    <span><Icon type="stop" />None</span>
                )
            case (UserRelationToOrganization.VIEW):
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
            case (UserRelationToOrganization.MEMBER_REQUEST_PENDING):
                return (
                    <div>
                        <div><Icon type="user" style={{ color: 'orange' }} spin={true} />Your membership <b>request</b> is pending</div>
                        <div><Button icon="delete" type="danger" onClick={this.onCancelJoinRequest.bind(this)}>Cancel Request</Button></div>
                    </div>
                )
            case (UserRelationToOrganization.MEMBER_INVITATION_PENDING):
                return (
                    <div>
                        <div><Icon type="user" style={{ color: 'blue' }} />You have been <b>invited</b> to join this Organization</div>
                        <div style={{ marginTop: '10px' }}>
                            <Button icon="check" type="default" onClick={this.onAcceptInvitation.bind(this)}>Accept Invitation</Button>
                            <Button icon="stop" type="danger" onClick={this.onRejectInvitation.bind(this)}>Reject Invitation</Button>
                        </div>
                    </div>
                )
            case (UserRelationToOrganization.MEMBER):
                return (<span><Icon type="user" />Member</span>)
            case (UserRelationToOrganization.ADMIN):
                return (<span><Icon type="unlock" />Admin</span>)
            case (UserRelationToOrganization.OWNER):
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
        if (this.props.organization.relation.type === UserRelationToOrganization.OWNER ||
            this.props.organization.relation.type === UserRelationToOrganization.ADMIN ||
            this.props.organization.relation.type === UserRelationToOrganization.MEMBER) {
            return true
        }
        return false
    }

    renderMembers() {
        if (!this.props.organization) {
            return
        }
        let members;
        if (!this.isMember()) {
            return (
                <i>Sorry, group membership restricted to members only</i>
            )
        }
        if (this.props.organization.members.length === 0) {
            members = (
                <p style={{ fontStyle: 'italic', textAlign: 'center' }}>
                    This organization has no members
                </p>
            )
        } else {
            members = this.props.organization.members.map((member) => {
                return (
                    <Member member={member} avatarSize={50} key={member.user.username} />
                )
            })
        }
        return (
            <div className="table infoTable">
                <div className="row">
                    <div className="col0">
                        {members}
                    </div>
                </div>
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
                className="slimCard">
                <div>
                    <div>
                        <div className="label">owner</div>
                    </div>
                    <div className="ownerTable">
                        <div className="avatarCol">
                            <Avatar user={this.props.organization.owner.user} size={60} />
                        </div>
                        <div className="proprietorCol">
                            <div className="owner">
                                <a href={"#people/" + this.props.organization.owner.user.username} target="_blank">{this.props.organization.owner.user.realname}</a>
                                {' '}
                                ❨{this.props.organization.owner.user.username}❩
                                        </div>
                            <div className="profileOrganization">
                                {this.props.organization.owner.user.organization}
                            </div>
                            <div className="profileOrganization">
                                {this.props.organization.owner.user.city}, {this.props.organization.owner.user.state}, {this.props.organization.owner.user.country}
                            </div>
                        </div>
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

    renderAdminRequestsRow(org: Organization) {
        if (!org) {
            return
        }
        if (!org.relation) {
            return
        }
        if (!(org.relation.type === UserRelationToOrganization.ADMIN ||
            org.relation.type === UserRelationToOrganization.OWNER)) {
            return
        }
        return (
            <div className="row">
                <div className="col1">
                    <span className="label">admin</span>
                </div>
                <div className="col2">
                    <div className="relation">
                        <div>
                            <div>
                                <Icon type="exclamation-circle" theme="twoTone" twoToneColor="orange" /> group has
                    {' '}
                                <span style={{ fontWeight: 'bold' }}>{org.adminRequests.length}</span>
                                {' '}
                                pending request{org.adminRequests.length > 1 ? 's' : ''}
                            </div>
                            <div>
                                <NavLink to={"/manageOrganizationRequests/" + this.props.organization!.id}>
                                    <Button>Manage Requests</Button>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    renderAdminRequests(org: Organization) {
        return (
            <div>
                <div>
                    <Icon type="exclamation-circle" theme="twoTone" twoToneColor="orange" /> group has
                    {' '}
                    <span style={{ fontWeight: 'bold' }}>{org.adminRequests.length}</span>
                    {' '}
                    pending request{org.adminRequests.length > 1 ? 's' : ''}
                </div>
                <div>
                    <NavLink to={"/manageOrganizationRequests/" + this.props.organization!.id}>
                        <Button>Manage Requests</Button>
                    </NavLink>
                </div>
            </div>
        )
    }

    renderRelationClass(org: Organization) {
        switch (org.relation.type) {
            case (UserRelationToOrganization.NONE):
                return 'infoBox'
            case (UserRelationToOrganization.VIEW):
                return 'infoBox'
            case (UserRelationToOrganization.MEMBER_REQUEST_PENDING):
                return 'infoBox relationRequestPending'
            case (UserRelationToOrganization.MEMBER_INVITATION_PENDING):
                return 'infoBox relationInvitationPending'
            case (UserRelationToOrganization.MEMBER):
                return 'infoBox'
            case (UserRelationToOrganization.ADMIN):
                return 'infoBox'
            case (UserRelationToOrganization.OWNER):
                return 'infoBox'
        }
    }

    renderUserRelationship() {
        // apparently TS is not smart enough to know this from the conditional branch in render()!
        if (!this.props.organization) {
            return
        }
        return (
            <form className="table infoTable">
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
                {this.renderAdminRequestsRow(this.props.organization)}
            </form>
        )
    }

    renderAdminTasks() {
        if (!this.props.organization) {
            return
        }
        const org = this.props.organization
        if (!(org.relation.type === UserRelationToOrganization.ADMIN ||
            org.relation.type === UserRelationToOrganization.OWNER)) {
            return
        }
        return (
            <div className="adminTasksBox">
                <Card
                    className="slimCard adminTasksCard"
                    title={<span><Icon type="team" /> admin tasks</span>}
                >
                    {this.renderAdminRequests(this.props.organization)}
                </Card>
            </div>
        )
    }

    renderJoinButton() {
        if (!this.props.organization) {
            return
        }
        if (this.props.organization.relation.type !== UserRelationToOrganization.VIEW) {
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
        return (
            <Header>
                <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <div style={{ flex: '0 0 auto' }}>
                        <span>
                            Viewing Org "
                            {this.props.organization && this.props.organization.name}
                            "
                        </span>
                    </div>
                    <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                        {this.renderEditButton()}
                        <NavLink to={`/organizations`}><Button type="danger" icon="undo">Return to Orgs</Button></NavLink>
                        {this.renderJoinButton()}
                        <Button shape="circle" icon="info" onClick={this.onShowInfo.bind(this)}></Button>
                    </div>
                </div>
            </Header>
        )
    }

    renderLoadingHeader() {
        return (
            <Header>
                <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <div style={{ flex: '0 0 auto' }}>
                        <span>
                            Loading Org...
                        </span>
                    </div>
                </div>
            </Header>
        )
    }

    renderMemberCard() {
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
                <span style={{ color: 'rgba(150, 150, 150, 1)' }}>({this.props.organization.members.length})</span>
            )
        } else {
            memberCount = ''
        }
        return (
            <Card
                className="slimCard membersCard"
                title={<span><Icon type="team" /> members {memberCount}</span>}
                extra={extras}
            >
                {this.renderMembers()}
            </Card>
        )
    }

    renderNarratives() {
        const fakeNarratives = []
        for (let i = 0; i < 20; i += 1) {
            fakeNarratives.push({
                workspaceId: i,
                // name: 'workspace_' + i,
                title: 'Narrative Title Here ' + i,
                public: Math.random() < 0.5 ? true : false,
                perm: ['None', 'Read', 'Write', 'Admin', 'Own'][Math.floor(Math.random() * 4)]
            })
        }
        if (!this.isMember()) {
            return (
                <Card
                    className="slimCard membersCard narratives"
                    title={<span><Icon type="folder-open" /> narratives</span>}
                >
                    <p style={{ textAlign: 'center', fontStyle: 'italic' }}>
                        Sorry, Narratives are restricted to members only
                </p>
                </Card>
            )
        }
        const narrativesTable = fakeNarratives.map((narrative) => {
            return (
                <div className="narrative">
                    <div className="title">{narrative.title}</div>
                    <div><i>abstract here?</i></div>
                    <div><i>sharing info here?</i></div>
                    <div><i>owner and save info here?</i></div>
                </div>
            )
        })
        const narrativeCount = fakeNarratives.length
        return (
            <Card
                className="slimCard membersCard narratives"
                title={<span><Icon type="folder-open" /> narratives ({narrativeCount})</span>}
            >
                <div className="narrativesTable">
                    {narrativesTable}
                </div>
            </Card>
        )
        // return (
        //     <div className="narratives">
        //         <h3>Narratives</h3>
        //         <div className="narrativesTable">
        //             {narrativesTable}
        //         </div>
        //     </div>
        // )
    }

    render() {
        if (typeof this.props.organization !== 'undefined') {
            return (
                <div className="ViewOrganization">
                    {this.renderHeader()}
                    {this.renderOrgHeader()}
                    <div className="mainRow">
                        <div className="mainColumn">
                            <div className="orgRow">
                                {this.renderOrg()}
                            </div>
                            <div className="narrativesRow">
                                {this.renderNarratives()}
                            </div>
                        </div>
                        <div className="infoColumn">
                            {/* <div className={this.renderRelationClass(this.props.organization)}>
                                {this.renderAdminTasks()}
                            </div> */}
                            {this.renderAdminTasks()}
                            <div className="infoBox">
                                {this.renderInfo()}
                            </div>
                            {this.renderMemberCard()}
                            {/* <div className="infoBox">
                                {this.renderMembers()}
                            </div> */}
                        </div>
                    </div>
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