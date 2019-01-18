import * as React from 'react'

import './component.css'

import Header from '../../Header'
import { Redirect } from 'react-router'
import { Button, Icon, Modal } from 'antd';
import MemberRowComponent from './MemberRow'
import { NavLink } from 'react-router-dom';
import OrganizationHeader from '../organizationHeader/loader';
import * as orgModel from '../../../data/models/organization/model'

export interface ViewMembersProps {
    organization: orgModel.Organization
    relation: orgModel.Relation
    onViewMembersUnload: () => void
    onPromoteMemberToAdmin: (memberUsername: string) => void
    onDemoteAdminToMember: (adminUsername: string) => void
    onRemoveMember: (memberUsername: string) => void
}

interface ViewMembersState {
    cancelToBrowser: boolean
    cancelToViewer: boolean
}

class ViewMembers extends React.Component<ViewMembersProps, ViewMembersState> {
    constructor(props: ViewMembersProps) {
        super(props)

        this.state = {
            cancelToBrowser: false,
            cancelToViewer: false
        }
    }

    onClickCancelToBrowser() {
        this.setState({ cancelToBrowser: true })
    }

    onClickCancelToViewer() {
        this.setState({ cancelToViewer: true })
    }

    onPromoteMemberToAdmin(memberUsername: string) {
        this.props.onPromoteMemberToAdmin(memberUsername)
    }

    onDemoteAdminToMember(adminUsername: string) {
        this.props.onDemoteAdminToMember(adminUsername)
    }

    onShowInfo() {
        Modal.info({
            title: 'View Members Help',
            width: '50em',
            content: (
                <div>
                    <p>This is the view members tool...</p>
                </div>
            )
        })
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

    isAdmin(): boolean {
        if (!this.props.organization) {
            return false
        }
        if (this.props.relation.type === orgModel.UserRelationToOrganization.OWNER ||
            this.props.relation.type === orgModel.UserRelationToOrganization.ADMIN) {
            return true
        }
        return false
    }

    renderOrgName(name: string) {
        const maxLength = 25
        if (name.length < 25) {
            return name
        }
        return (
            <span>
                {name.slice(0, 25)}
                …
            </span>
        )
    }

    renderHeader() {
        const breadcrumbs = (
            <React.Fragment>
                <span>
                    <NavLink to={`/viewOrganization/${this.props.organization.id}`}>
                        <span style={{ fontWeight: 'bold' }}>
                            {this.renderOrgName(this.props.organization.name)}
                        </span>
                    </NavLink>

                    <Icon type="right" style={{ verticalAlign: 'middle', marginLeft: '4px', marginRight: '4px' }} />

                    <Icon type="team" />
                    {' '}
                    <span style={{ fontSize: '120%' }}>Viewing Org Members</span>
                </span>
            </React.Fragment>
        )
        const buttons = (
            <React.Fragment>
                {/* <Button icon="undo"
                    type="danger"
                    onClick={this.onClickCancelToViewer.bind(this)}>
                    Return to this Org
                </Button> */}
                <Button
                    shape="circle"
                    icon="info"
                    onClick={this.onShowInfo.bind(this)}>
                </Button>
            </React.Fragment>
        )
        return (
            <Header breadcrumbs={breadcrumbs} buttons={buttons} />
        )
    }

    renderMembersToolbar() {
        switch (this.props.relation.type) {
            case orgModel.UserRelationToOrganization.NONE:
                return (
                    <div className="toolbar">
                        <Button><Icon type="plus" />Join</Button>
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
                        <NavLink to={"/inviteUser/" + this.props.organization.id}><Button><Icon type="mail" /> Invite a User</Button></NavLink>
                    </div>
                )

            case orgModel.UserRelationToOrganization.OWNER:
                return (
                    <div className="toolbar">
                        <NavLink to={"/inviteUser/" + this.props.organization.id}><Button><Icon type="mail" /> Invite a User</Button></NavLink>
                    </div>
                )

        }
    }

    // renderMemberButtons(member: UserBase) {
    //     if (!(this.props.organization.relation.type === UserRelationToOrganization.OWNER ||
    //         this.props.organization.relation.type === UserRelationToOrganization.ADMIN)) {
    //         return
    //     }
    //     return (
    //         <div>
    //             <div><Button type="danger" style={{ width: '100%' }}><Icon type="delete" />Remove from Org</Button></div>
    //             <div><Button style={{ width: '100%' }} onClick={() => { this.onPromoteMemberToAdmin.call(this, member.username) }}><Icon type="unlock" />Promote to Admin</Button></div>
    //         </div>
    //     )
    // }

    renderMembers() {
        let members
        if (!this.isMember()) {
            return (
                <p className="message">
                    Sorry, organization membership restricted to members only
                </p>
            )
        }
        if (this.props.organization.members.length === 0) {
            members = (
                <p className="message">
                    This organization has no members
                </p>
            )
        } else {
            members = this.props.organization.members.map((member) => (
                <div key={member.username} className="simpleCard">
                    <MemberRowComponent
                        member={member}
                        relation={this.props.relation}
                        organization={this.props.organization}
                        onPromoteMemberToAdmin={this.props.onPromoteMemberToAdmin}
                        onDemoteAdminToMember={this.props.onDemoteAdminToMember}
                        onRemoveMember={this.props.onRemoveMember}
                    />
                </div>
            ))
        }
        return (
            <div className="table infoTable">
                <div className="row">
                    <div className="col0" style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                        {members}
                    </div>
                </div>
            </div>
        )
    }

    // renderPendingMembers() {

    //     if (!this.isAdmin()) {
    //         return (
    //             <Alert type="info" showIcon message="Sorry, pending organization membership restricted to admin members only" />
    //         )
    //     }
    //     const pendingRequests = this.props.organization.adminRequests.filter((request) => {
    //         return (request.resourceType === RequestResourceType.USER)
    //     })
    //     if (pendingRequests.length === 0) {
    //         return (
    //             <Alert type="info" message="No pending member requests or invitations" />
    //         )
    //     }
    //     return pendingRequests.map((request) => {
    //         return (
    //             <div key={request.id}>
    //                 <Request request={request} />
    //             </div>
    //         )
    //     })
    // }

    renderAdminsToolbar() {
        return (
            <div className="toolbar">

            </div>
        )
    }
    // renderAdminButtons(admin: Member) {
    //     if (!(this.props.relation.type === orgModel.UserRelationToOrganization.OWNER ||
    //         this.props.relation.type === orgModel.UserRelationToOrganization.ADMIN)) {
    //         return
    //     }
    //     return (
    //         <div>
    //             <div><Button type="danger" style={{ width: '100%' }}><Icon type="delete" />Remove from Org</Button></div>
    //             <div><Button style={{ width: '100%' }} onClick={() => { this.onDemoteAdminToMember.call(this, admin.user.username) }}><Icon type="user" />Demote to Member</Button></div>
    //         </div>
    //     )
    // }
    // renderAdmins() {
    //     const admins = this.props.organization.members.filter((member) => (member.type === MemberType.ADMIN))
    //     let adminList
    //     if (admins.length === 0) {
    //         adminList = (
    //             <p style={{ fontStyle: 'italic', textAlign: 'center' }}>
    //                 This organization has no admins
    //             </p>
    //         )
    //     } else {
    //         adminList = admins.map((member) => {
    //             return (
    //                 <div key={member.username} style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'row' }}>
    //                     <div style={{ flex: '1 1 0px' }}>
    //                         <MemberComponent member={member} avatarSize={50} key={member.username} />
    //                     </div>
    //                     <div style={{ flex: '0 0 10em' }}>
    //                         {this.renderAdminButtons(member)}
    //                     </div>
    //                 </div>

    //             )
    //         })
    //     }
    //     return (
    //         <div className="table infoTable">
    //             <div className="row">
    //                 <div className="col0" style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
    //                     {adminList}
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // }

    renderOrganizationHeader() {
        return (
            <OrganizationHeader organizationId={this.props.organization.id} />
        )
    }

    componentWillUnmount() {
        this.props.onViewMembersUnload()
    }

    render() {

        if (this.state.cancelToBrowser) {
            return <Redirect push to="/organizations" />
        }

        if (this.state.cancelToViewer) {
            return <Redirect push to={"/viewOrganization/" + this.props.organization.id} />
        }

        return (
            <div className="ViewMembers">
                {this.renderHeader()}
                {this.renderOrganizationHeader()}
                <div className="body">
                    <div className="membersCol">
                        <h2>Members</h2>
                        {this.renderMembersToolbar()}
                        {this.renderMembers()}
                    </div>
                    <div className="otherCol">
                        <h2>Pending Members</h2>
                        {this.renderAdminsToolbar()}

                        <p>
                            This space to provide a list of user requests and invitations. This will allow this view
                            to provide all user management tools in one place.
                        </p>
                        <p>
                            In progress... currently renders the requests but does not provide actions (buttons).
                        </p>
                        {/* {this.renderPendingMembers()} */}

                    </div>
                </div>

            </div>
        )
    }
}

export default ViewMembers