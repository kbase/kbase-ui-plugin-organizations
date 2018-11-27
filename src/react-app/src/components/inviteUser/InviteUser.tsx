import * as React from 'react'

import './InviteUser.css'
import { BriefUser, Organization, User, InviteUserViewState, MemberType } from '../../types';
import { Button, AutoComplete, Input, Icon, Modal } from 'antd';
import Header from '../Header';
import { Redirect } from 'react-router-dom';
import OrganizationHeader from '../organizationHeader/container';
import { UserQuery } from '../../data/model';

import SelectUserComponent from '../selectUser/component'

export interface InviteUserProps {
    organization: Organization,
    users: Array<BriefUser>
    selectedUser: User | null,
    state: InviteUserViewState,
    onSearchUsers: (query: UserQuery) => void,
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

    constructor(props: InviteUserProps) {
        super(props)

        this.lastSearchAt = null

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

    onSearchUsers(value: string) {
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
                excludedUsers: excludedUsers
            })
        }
    }

    onSelectUser(value: string) {
        this.props.onSelectUser(value);
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

    foundUsers() {
        const users = this.props.users.map(({ username, realname }) => {
            return {
                value: username,
                text: realname + ' (' + username + ')'
            }
        })
        return users
    }

    renderHeader() {
        let orgName: string
        // if (this.props.manageGroupRequestsView && this.props.manageGroupRequestsView.view) {
        //     orgName = this.props.manageGroupRequestsView.view.organization.name
        // } else {
        //     orgName = 'loading...'
        // }
        return (
            <Header>
                <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <div style={{ flex: '0 0 auto' }}>
                        <span>
                            <Icon type="tool" />
                            {' '}
                            Inviting Users to join Org "
                            {this.props.organization.name}
                            "
                        </span>
                    </div>
                    <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Button icon="undo"
                            type="danger"
                            onClick={this.onClickCancelToViewMembers.bind(this)}>
                            Return to Org Members
                        </Button>
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

    renderUsers() {
        return this.props.users.map((user) => {
            return (
                <div>
                    {user.username}
                </div>
            )
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
        return (
            <div className="invitationForm">
                <table>
                    <tbody>
                        {/* <tr>
                            <td>
                                <span className="field-label">
                                    message
                            </span>
                            </td>
                            <td>
                                <textarea></textarea>
                            </td>
                        </tr> */}
                        <tr>
                            <td colSpan={2} style={{ textAlign: 'center' }}>
                                <Button
                                    disabled={!this.canSave()}
                                    onClick={this.onSendInvitation.bind(this)}>Send Invitation</Button>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
        )
    }

    renderInvitationStatus() {
        switch (this.props.state) {
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
            <OrganizationHeader organization={this.props.organization} />
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
            <div className="InviteUser">
                {this.renderHeader()}
                {this.renderOrgHeader()}
                <div className="row">
                    <div className="col1">
                        <h3>Select User to Invite</h3>
                        <SelectUserComponent
                            users={this.props.users}
                            selectedUser={this.props.selectedUser}
                            onSearchUsers={this.onSearchUsers.bind(this)}
                            onSelectUser={this.onSelectUser.bind(this)}
                        />
                        {this.renderInvitationForm()}
                        {this.renderInvitationStatus()}
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
            </div>
        )
    }
}

export default InviteUser