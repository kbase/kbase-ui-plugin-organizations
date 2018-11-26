import * as React from 'react'

import './InviteUser.css'
import { BriefUser, Organization, User } from '../../types';
import { Button, AutoComplete, Input, Icon, Modal } from 'antd';
import Header from '../Header';
import { Redirect } from 'react-router-dom';

export interface InviteUserProps {
    organization: Organization,
    users: Array<BriefUser>
    selectedUser: User | null,
    onSearchUsers: (query: string) => void,
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

    onSearchUsers(value: string) {
        if (value.length < 3) {
            this.setState({ autocompleteMessage: 'Search begins after 3 or more characters' })
            return
        }
        this.setState({ autocompleteMessage: '' })
        if (this.lastSearchAt === null ||
            (new Date().getTime() - this.lastSearchAt.getTime() > InviteUser.searchDebounce)) {
            this.lastSearchAt = new Date()
            this.props.onSearchUsers(value)
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
        console.log('now getting users...')
        const users = this.props.users.map(({ username, realname }) => {
            return {
                value: username,
                text: realname + ' (' + username + ')'
            }
        })
        console.log('got them')
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

    renderUserSelection() {
        const dataSource = this.foundUsers()
        return (
            <div>
                <div className="userSelection">
                    <AutoComplete
                        onSearch={this.onSearchUsers.bind(this)}
                        onSelect={this.onSelectUser.bind(this)}
                        dataSource={dataSource}
                        className="userAutocomplete" >
                        <Input suffix={<Icon type="search" />} />
                    </AutoComplete>
                    <div className="autocompleteMessage">
                        {this.state.autocompleteMessage}
                    </div>
                </div>
            </div>
        )
    }

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
                    <div className="username">
                        <span className="field-label">
                            username
                        </span>
                        <span>
                            {this.props.selectedUser.username}
                        </span>
                    </div>
                    <div className="realname">
                        <span className="field-label">
                            realname
                        </span>
                        <span>
                            {this.props.selectedUser.realname}
                        </span>
                    </div>
                </div>
            )
        }
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
                        <tr>
                            <td>
                                <span className="field-label">
                                    message
                            </span>
                            </td>
                            <td>
                                <textarea></textarea>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2} style={{ textAlign: 'center' }}>
                                <Button onClick={this.onSendInvitation.bind(this)}>Send Invitation</Button>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
        )
    }

    renderInvitationStatus() {
        return (
            <div>
                nothing to show yet
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
            <div className="InviteUser">
                {this.renderHeader()}
                <div className="row">
                    <div className="col1">
                        <h3>Organization</h3>
                        {this.renderOrgInfo()}
                    </div>
                </div>
                <div className="row">
                    <div className="col1 firstCol">
                        <h3>Select User to Invite</h3>
                        {this.renderUserSelection()}
                    </div>
                    <div className="col1 lastCol">
                        <h3>Selected User</h3>
                        {this.renderSelectedUser()}
                    </div>
                </div>
                <div className="row">
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
                </div>
                {/* {this.renderUsers()} */}
            </div>
        )
    }
}

export default InviteUser