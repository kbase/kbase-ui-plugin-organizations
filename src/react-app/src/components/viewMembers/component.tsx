import * as React from 'react'

import './component.css'

import { Member, Organization, UserRelationToOrganization, MemberType } from '../../types'
import Header from '../Header'
import { Redirect } from 'react-router'
import { Button, Icon, Modal, Row, Col, Menu, Dropdown } from 'antd';
import MemberComponent from '../Member';
import MemberRowComponent from './MemberRow'
import { NavLink } from 'react-router-dom';
import OrganizationHeader from '../organizationHeader/container';

export interface ViewMembersProps {
    organization: Organization,
    onViewMembersUnload: () => void,
    onPromoteMemberToAdmin: (memberUsername: string) => void,
    onDemoteAdminToMember: (adminUsername: string) => void,
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
        if (this.props.organization.relation.type === UserRelationToOrganization.OWNER ||
            this.props.organization.relation.type === UserRelationToOrganization.ADMIN ||
            this.props.organization.relation.type === UserRelationToOrganization.MEMBER) {
            return true
        }
        return false
    }

    renderHeader() {
        return (
            <Header>
                <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <div style={{ flex: '0 0 auto' }}>
                        <span>
                            <Icon type="tool" />
                            {' '}
                            Viewing Members for Org "
                            {this.props.organization.name}
                            "
                        </span>
                    </div>
                    <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Button icon="undo"
                            type="danger"
                            onClick={this.onClickCancelToViewer.bind(this)}>
                            Return to this Org
                        </Button>
                        <Button icon="undo"
                            type="danger"
                            onClick={this.onClickCancelToBrowser.bind(this)}>
                            Return to Orgs Browser
                        </Button>
                        <Button
                            shape="circle"
                            icon="info"
                            onClick={this.onShowInfo.bind(this)}>
                        </Button>
                    </div>
                </div>
            </Header>
        )
    }

    renderMembersToolbar() {
        switch (this.props.organization.relation.type) {
            case UserRelationToOrganization.NONE:
                return (
                    <div className="toolbar">
                        <Button><Icon type="plus" />Join</Button>
                    </div>
                )

            case UserRelationToOrganization.MEMBER:
                return (
                    <div className="toolbar">
                    </div>
                )

            case UserRelationToOrganization.ADMIN:
                return (
                    <div className="toolbar">
                        <NavLink to={"/inviteUser/" + this.props.organization.id}><Button><Icon type="mail" /> Invite a User</Button></NavLink>
                    </div>
                )

            case UserRelationToOrganization.OWNER:
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
                    Sorry, group membership restricted to members only
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
                <React.Fragment key={member.user.username}>
                    <MemberRowComponent
                        member={member}
                        organization={this.props.organization}
                        onPromoteMemberToAdmin={this.props.onPromoteMemberToAdmin}
                        onDemoteAdminToMember={this.props.onDemoteAdminToMember}
                        onRemoveMember={this.props.onRemoveMember}
                    />
                </React.Fragment>
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
    renderAdminsToolbar() {
        return (
            <div className="toolbar">

            </div>
        )
    }
    renderAdminButtons(admin: Member) {
        if (!(this.props.organization.relation.type === UserRelationToOrganization.OWNER ||
            this.props.organization.relation.type === UserRelationToOrganization.ADMIN)) {
            return
        }
        return (
            <div>
                <div><Button type="danger" style={{ width: '100%' }}><Icon type="delete" />Remove from Org</Button></div>
                <div><Button style={{ width: '100%' }} onClick={() => { this.onDemoteAdminToMember.call(this, admin.user.username) }}><Icon type="user" />Demote to Member</Button></div>
            </div>
        )
    }
    renderAdmins() {
        const admins = this.props.organization.members.filter((member) => (member.type === MemberType.ADMIN))
        let adminList
        if (admins.length === 0) {
            adminList = (
                <p style={{ fontStyle: 'italic', textAlign: 'center' }}>
                    This organization has no admins
                </p>
            )
        } else {
            adminList = admins.map((member) => {
                return (
                    <div key={member.user.username} style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'row' }}>
                        <div style={{ flex: '1 1 0px' }}>
                            <MemberComponent member={member} avatarSize={50} key={member.user.username} />
                        </div>
                        <div style={{ flex: '0 0 10em' }}>
                            {this.renderAdminButtons(member)}
                        </div>
                    </div>

                )
            })
        }
        return (
            <div className="table infoTable">
                <div className="row">
                    <div className="col0" style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                        {adminList}
                    </div>
                </div>
            </div>
        )
    }

    renderOrganizationHeader() {
        return (
            <OrganizationHeader organization={this.props.organization} />
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
                        <h2>Admins</h2>
                        {this.renderAdminsToolbar()}
                        {this.renderAdmins()}
                    </div>
                </div>

            </div>
        )
    }
}

export default ViewMembers