import * as React from 'react'

import './component.css'
import { User, InviteUserViewState, OrganizationUser } from '../../../types';
import { Button, Icon, Modal, Alert } from 'antd';
import Header from '../../Header';
import { Redirect, NavLink } from 'react-router-dom';
import OrganizationHeader from '../organizationHeader/loader';
import UserComponent from '../../User'
import * as orgModel from '../../../data/models/organization/model'
import * as userModel from '../../../data/models/user'
import MainMenu from '../../menu/component';

export interface InviteUserProps {
    organization: orgModel.Organization,
    selectedUser: {
        user: User,
        relation: orgModel.UserRelationToOrganization
    } | null
    editState: InviteUserViewState,
    users: Array<OrganizationUser> | null
    onSearchUsers: (query: userModel.UserQuery) => void,
    onSelectUser: (username: string) => void,
    onSendInvitation: () => void
}

interface InviteUserState {
    cancelToViewMembers: boolean
    cancelToBrowser: boolean
    cancelToViewer: boolean
    autocompleteMessage: string
}

class InviteUser extends React.Component<InviteUserProps, InviteUserState> {

    lastSearchAt: Date | null

    static searchDebounce: number = 200

    searchInput: React.RefObject<HTMLInputElement>
    searchButton: React.RefObject<Button>

    constructor(props: InviteUserProps) {
        super(props)

        this.lastSearchAt = null
        this.searchInput = React.createRef()
        this.searchButton = React.createRef()

        this.state = {
            cancelToViewMembers: false,
            cancelToBrowser: false,
            cancelToViewer: false,
            autocompleteMessage: ''
        }
    }

    onClickCancelToViewMembers() {
        this.setState({ cancelToViewMembers: true })
    }

    onClickCancelToBrowser() {
        this.setState({ cancelToBrowser: true })
    }

    onClickCancelToViewer() {
        this.setState({ cancelToViewer: true })
    }

    onSendInvitation() {
        this.props.onSendInvitation()
    }

    canSave() {
        if (this.props.selectedUser) {
            return true
        }
        return false
    }

    onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        let currentSearchInputValue;
        if (this.searchInput.current) {
            currentSearchInputValue = this.searchInput.current.value
        } else {
            currentSearchInputValue = ''
        }
        this.doSearchUsers(currentSearchInputValue)
    }

    onSearchInputChange() {
        let currentSearchInputValue;
        if (this.searchInput.current) {
            currentSearchInputValue = this.searchInput.current.value
        } else {
            currentSearchInputValue = ''
        }
        // this.doSearchUsers(currentSearchInputValue)
    }

    doSearchUsers(value: string) {
        // if (value.length < 3) {
        //     this.setState({ autocompleteMessage: 'Search begins after 3 or more characters' })
        //     return
        // }
        // this.setState({ autocompleteMessage: '' })
        // build up list of users already owning, members of, or with membership pending.
        const excludedUsers: Array<string> = []

        if (this.lastSearchAt === null ||
            (new Date().getTime() - this.lastSearchAt.getTime() > InviteUser.searchDebounce)) {
            this.lastSearchAt = new Date()
            this.props.onSearchUsers({
                query: value,
                excludedUsers: []
            })
        }
    }

    onSelectUser(user: OrganizationUser) {
        this.props.onSelectUser(user.username);
    }

    onShowInfo() {
        Modal.info({
            title: 'Invite User Help',
            width: '50em',
            content: (
                <div>
                    <p>This is the invite user tool...</p>
                </div>
            )
        })
    }

    // foundUsers() {
    //     const users = this.props.users.map(({ username, realname }) => {
    //         return {
    //             value: username,
    //             text: realname + ' (' + username + ')'
    //         }
    //     })
    //     return users
    // }

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
        let orgName: string
        // if (this.props.manageGroupRequestsView && this.props.manageGroupRequestsView.view) {
        //     orgName = this.props.manageGroupRequestsView.view.organization.name
        // } else {
        //     orgName = 'loading...'
        // }
        const breadcrumbs = (
            <React.Fragment>
                <span>
                    <NavLink to={`/viewOrganization/${this.props.organization.id}`}>
                        <span style={{ fontWeight: 'bold' }}>
                            {this.renderOrgName(this.props.organization.name)}
                        </span>
                    </NavLink>

                    <Icon type="right" style={{ verticalAlign: 'middle', marginLeft: '4px', marginRight: '4px' }} />

                    <Icon type="tool" />
                    {' '}
                    <span style={{ fontSize: '120%' }}>Invite a User to Join Org</span>
                </span>
            </React.Fragment>
        )
        const buttons = (
            <React.Fragment>
                {/* <Button icon="undo"
                    type="danger"
                    onClick={this.onClickCancelToViewMembers.bind(this)}>
                    Return to Org Members
            </Button>
                <Button icon="undo"
                    type="danger"
                    onClick={this.onClickCancelToViewer.bind(this)}>
                    Return to this Org
            </Button> */}


                {/* <Button
                    shape="circle"
                    icon="info"
                    onClick={this.onShowInfo.bind(this)}>
                </Button> */}
            </React.Fragment>

        )
        return (
            <Header breadcrumbs={breadcrumbs} buttons={buttons} />
        )
    }

    renderUsers() {
        if (!this.props.users) {
            const message = 'Search for users by name or username to display a list of available users in this space.'
            return (
                <Alert type="info" message={message} showIcon />
            )
        }
        if (this.props.users.length === 0) {
            return (
                <Alert type="warning" message="No users found" showIcon />
            )
        }
        return this.props.users.map((user) => {
            if (user.relation === orgModel.UserRelationToOrganization.NONE) {
                return (
                    <div
                        className="user notInOrganization "
                        key={user.username}
                        onClick={() => { this.onSelectUser.call(this, user) }}>
                        <div className="name "
                        >
                            {user.realname} ({user.username})
                        </div>
                    </div>
                )
            } else {
                return (
                    <div
                        className="user inOrganization"
                        key={user.username}
                        onClick={() => { this.onSelectUser.call(this, user) }}>
                        <div className="name "
                        >
                            {user.realname} ({user.username})
                        </div>
                    </div>
                )
            }
        })
    }

    renderOrgInfo() {
        return (
            <div className="orgInfo">
                <div className="name">
                    <span className="field-label">name</span>
                    <span>{this.props.organization.name}</span>
                </div>
                <div className="description">
                    <span className="field-label">description</span>
                    <span>{this.props.organization.description}</span>
                </div>
            </div>
        )
    }



    renderInvitationForm() {
        let button
        let message
        if (this.props.selectedUser) {
            if (this.props.selectedUser.relation === orgModel.UserRelationToOrganization.VIEW) {
                button = (
                    <Button
                        type="primary"
                        onClick={this.onSendInvitation.bind(this)}>Send Invitation</Button>
                )
            } else {
                button = (
                    <Button
                        disabled
                        type="primary"
                    >Send Invitation</Button>
                )
                // message = 'User is a member of this organization'
                message = (
                    <div>
                        User may not be invited because:<br />
                        {this.renderRelation(this.props.selectedUser.relation)}
                    </div>
                )
                message = (
                    <Alert
                        type="warning"
                        message={message}
                        showIcon
                    />
                )
            }
        } else {
            button = (
                <Button
                    disabled
                    type="primary"
                >Send Invitation</Button>
            )
            message = 'Please select a user'
        }
        return (
            <div className="invitationForm">
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    {button}
                </div>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    {message}
                </div>
            </div>
        )
    }

    renderInvitationStatus() {
        switch (this.props.editState) {
            case InviteUserViewState.NONE:
                return (
                    <div>NONE</div>
                )
            case InviteUserViewState.EDITING:
                return (
                    <div>EDITING</div>
                )
            case InviteUserViewState.SENDABLE:
                return (
                    <div>SENDABLE</div>
                )
            case InviteUserViewState.SENDING:
                return (
                    <div>SENDING</div>
                )
            case InviteUserViewState.SUCCESS:
                return (
                    <div>SENT SUCCESSFULLY</div>
                )
            case InviteUserViewState.ERROR:
                return (
                    <div>ERROR SENDING</div>
                )
            default:
                return (
                    <div>Bad State</div>
                )
        }

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

    renderRelation(relation: orgModel.UserRelationToOrganization) {
        switch (relation) {
            case (orgModel.UserRelationToOrganization.NONE):
                return (
                    <span><Icon type="stop" />None</span>
                )
            case (orgModel.UserRelationToOrganization.VIEW):
                return (
                    <span><Icon type="stop" /> Not a member</span>
                )
            case (orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING):
                return (<span><Icon type="user" style={{ color: 'orange' }} /> User's membership <b>request</b> is pending</span>)
            case (orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING):
                return (<span><Icon type="user" style={{ color: 'blue' }} /> User has been <b>invited</b> to join</span>)
            case (orgModel.UserRelationToOrganization.MEMBER):
                return (<span><Icon type="user" /> User is a <b>member</b> of this organization</span>)
            case (orgModel.UserRelationToOrganization.ADMIN):
                return (<span><Icon type="unlock" />User is an <b>admin</b> of this organization</span>)
            case (orgModel.UserRelationToOrganization.OWNER):
                return (

                    <span><Icon type="crown" /> User is the <b>owner</b> of this Organization</span>
                )
        }
    }

    // renderRelationText(relation: UserRelationToOrganization) {
    //     switch (relation) {
    //         case (UserRelationToOrganization.NONE):
    //             return (
    //                 <span><Icon type="stop" />None</span>
    //             )
    //         case (UserRelationToOrganization.VIEW):
    //             return (
    //                 <span><Icon type="stop" /> Not a member</span>
    //             )
    //         case (UserRelationToOrganization.MEMBER_REQUEST_PENDING):
    //             return (<span><Icon type="user" style={{ color: 'orange' }} /> User's membership <b>request</b> is pending</span>)
    //         case (UserRelationToOrganization.MEMBER_INVITATION_PENDING):
    //             return (<span><Icon type="user" style={{ color: 'blue' }} /> User has been <b>invited</b> to join</span>)
    //         case (UserRelationToOrganization.MEMBER):
    //             return (<span><Icon type="user" /> User is a <b>member</b> of this organization</span>)
    //         case (UserRelationToOrganization.ADMIN):
    //             return (<span><Icon type="unlock" />User is an <b>admin</b> of this organization</span>)
    //         case (UserRelationToOrganization.OWNER):
    //             return (
    //                 <span><Icon type="crown" /> User is the <b>owner</b> of this Organization</span>
    //             )
    //     }
    // }

    renderSelectedUser() {

        if (this.props.selectedUser === null) {
            return (
                <div className="selectedUser">
                    <p className="noSelection">
                        No user yet selected
                    </p>
                </div>
            )
        } else {
            return (
                <div className="selectedUser">
                    <UserComponent user={this.props.selectedUser.user} />
                    {this.renderRelation(this.props.selectedUser.relation)}
                </div>
            )
        }
    }

    renderFooter() {
        return (
            <div className="footer">
            </div>
        )
    }

    renderSearchButton() {
        return (<Icon type="search" />)
    }

    renderMenuButtons() {
        return (
            <div className="ButtonSet">
                <div className="ButtonSet-button">
                    <Button icon="rollback"
                        type="danger"
                        onClick={this.onClickCancelToViewer.bind(this)}>
                        Back to Org
                    </Button>
                </div>
                {/* <div className="ButtonSet-button">
                    <Button
                        shape="circle"
                        icon="info"
                        onClick={this.onShowInfo.bind(this)}>
                    </Button>
                </div> */}
            </div>
        )
    }

    render() {

        if (this.state.cancelToViewMembers) {
            return <Redirect push to={"/viewMembers/" + this.props.organization.id} />
        }

        if (this.state.cancelToBrowser) {
            return <Redirect push to="/organizations" />
        }

        if (this.state.cancelToViewer) {
            return <Redirect push to={"/viewOrganization/" + this.props.organization.id} />
        }

        return (
            <div className="InviteUser scrollable-flex-column">
                <MainMenu buttons={this.renderMenuButtons()} />
                {/* {this.renderHeader()} */}
                {this.renderOrgHeader()}
                <div className="row scrollable-flex-column">
                    <div className="col1 firstCol users scrollable-flex-column">
                        <h3>Select User to Invite</h3>
                        <form id="searchForm" className="searchBar"
                            onSubmit={this.onSubmit.bind(this)}>
                            <input
                                ref={this.searchInput}
                                autoFocus
                                onChange={this.onSearchInputChange.bind(this)}
                                placeholder="Search for a user"
                            />
                            <Button
                                className="searchButton"
                                form="searchForm"
                                key="submit"
                                htmlType="submit"
                            >
                                {this.renderSearchButton()}
                            </Button>
                        </form>
                        <div className="usersTable">
                            {this.renderUsers()}
                        </div>
                        {/* <SelectUserComponent
                            users={this.props.users}
                            selectedUser={this.props.selectedUser}
                            onSearchUsers={this.onSearchUsers.bind(this)}
                            onSelectUser={this.onSelectUser.bind(this)}
                        />
                        {this.renderInvitationForm()}
                        {this.renderInvitationStatus()} */}
                    </div>
                    <div className="col1 lastCol">
                        <h3>Selected User</h3>
                        {this.renderSelectedUser()}
                        {this.renderInvitationForm()}
                    </div>
                </div>
                {/* <div className="row">
                    <div className="col1">
                        <h3>Send Invitation</h3>
                        {this.renderInvitationForm()}
                    </div>
                </div>
                <div className="row">
                    <div className="col1">
                        <h3>Status</h3>
                        {this.renderInvitationStatus()}
                    </div>
                </div> */}
                {/* {this.renderUsers()} */}
                {this.renderFooter()}
            </div>
        )

        // return (
        //     <div className="InviteUser">
        //         {this.renderHeader()}
        //         {this.renderOrgHeader()}
        //         <div className="row">
        //             <div className="col1">
        //                 <h3>Select User to Invite</h3>
        //                 <SelectUserComponent
        //                     users={this.props.users}
        //                     selectedUser={this.props.selectedUser}
        //                     onSearchUsers={this.onSearchUsers.bind(this)}
        //                     onSelectUser={this.onSelectUser.bind(this)}
        //                 />
        //                 {this.renderInvitationForm()}
        //                 {this.renderInvitationStatus()}
        //             </div>
        //         </div>
        //         {/* <div className="row">
        //             <div className="col1">
        //                 <h3>Send Invitation</h3>
        //                 {this.renderInvitationForm()}
        //             </div>
        //         </div>
        //         <div className="row">
        //             <div className="col1">
        //                 <h3>Status</h3>
        //                 {this.renderInvitationStatus()}
        //             </div>
        //         </div> */}
        //         {/* {this.renderUsers()} */}
        //     </div>
        // )
    }
}

export default InviteUser