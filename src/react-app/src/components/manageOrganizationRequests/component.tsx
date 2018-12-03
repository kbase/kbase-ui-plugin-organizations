import * as React from 'react'

import './component.css'
import * as types from '../../types';
import Header from '../Header';
import { Icon, Button, Modal, Card, Alert } from 'antd';
import { Redirect } from 'react-router';
import User from '../User';
import OrganizationHeader from '../organizationHeader/container';

export interface ManageGroupRequestsProps {
    // organizationId: string,
    viewState: types.ManageOrganizationRequestsValue
    // onStart: (organizationId: string) => void,
    onAcceptJoinRequest: (requestId: string) => void,
    onDenyJoinRequest: (requestId: string) => void,
    onCancelJoinInvitation: (requestId: string) => void
}

export interface ManageGroupRequestsState {
    cancelToBrowser: boolean
    cancelToViewer: boolean
}

class ManageGroupRequests extends React.Component<ManageGroupRequestsProps, ManageGroupRequestsState> {

    constructor(props: ManageGroupRequestsProps) {
        super(props)

        this.state = {
            cancelToBrowser: false,
            cancelToViewer: false
        }

        // this.props.onStart(this.props.organizationId)
    }

    onClickCancelToBrowser() {
        this.setState({ cancelToBrowser: true })
    }

    onClickCancelToViewer() {
        this.setState({ cancelToViewer: true })
    }
    onAcceptJoinRequest(requestId: string) {
        this.props.onAcceptJoinRequest(requestId)
    }
    onDenyJoinRequest(requestId: string) {
        this.props.onDenyJoinRequest(requestId)
    }
    onCancelJoinInvitation(requestId: string) {
        this.props.onCancelJoinInvitation(requestId)
    }
    onViewProfile(username: string) {
        window.open('#people/' + username, '_blank')
    }
    onShowInfo() {
        Modal.info({
            title: 'Manage Requests Help',
            width: '50em',
            content: (
                <div>
                    <p>This is the manage requests tool...</p>
                </div>
            )
        })
    }
    renderHeader() {
        let orgName: string
        // if (this.props.manageOrganizationRequestsView && this.props.manageOrganizationRequestsView.viewState) {
        //     orgName = this.props.manageOrganizationRequestsView.viewState.organization.name
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
                            <span style={{ fontSize: '120%' }}>Managing Requests</span> for Org "
                            {this.props.viewState.organization.name}
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

    renderLoadingHeader() {
        return (
            <Header>
                <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <div style={{ flex: '0 0 auto' }}>
                        <span>
                            Loading Org Editor...
                        </span>
                    </div>
                </div>
            </Header>
        )
    }

    // renderRequestType(type: types.RequestType) {

    //     switch (type) {
    //         case types.RequestType.JOIN_GROUP_REQUEST:
    //             return 'Join Group Request'
    //         case types.RequestType.JOIN_GROUP_INVITE:
    //             return 'Join Group Invitation'
    //         case types.RequestType.ADD_WORKSPACE_REQUEST:
    //             return 'Add Workspace Request'
    //         case types.RequestType.ADD_WORKSPACE_INVITE:
    //             return 'Add Workspace Invitation'
    //     }
    // }

    niceElapsed(someDate: Date) {
        const nowDate = new Date()

        const elapsed = Math.round((nowDate.getTime() - someDate.getTime()) / 1000);
        const elapsedAbs = Math.abs(elapsed);

        let measure, measureAbs, unit;
        const maxDays = 90
        if (elapsedAbs < 60 * 60 * 24 * maxDays) {
            if (elapsedAbs === 0) {
                return 'now';
            } else if (elapsedAbs < 60) {
                measure = elapsed;
                measureAbs = elapsedAbs;
                unit = 'second';
            } else if (elapsedAbs < 60 * 60) {
                measure = Math.round(elapsed / 60);
                measureAbs = Math.round(elapsedAbs / 60);
                unit = 'minute';
            } else if (elapsedAbs < 60 * 60 * 24) {
                measure = Math.round(elapsed / 3600);
                measureAbs = Math.round(elapsedAbs / 3600);
                unit = 'hour';
            } else {
                measure = Math.round(elapsed / (3600 * 24));
                measureAbs = Math.round(elapsedAbs / (3600 * 24));
                unit = 'day';
            }

            if (measureAbs > 1) {
                unit += 's';
            }

            let prefix = null;
            let suffix = null;
            if (measure < 0) {
                prefix = 'in';
            } else if (measure > 0) {
                suffix = 'ago';
            }

            return (prefix ? prefix + ' ' : '') + measureAbs + ' ' + unit + (suffix ? ' ' + suffix : '');
        } else {
            // otherwise show the actual date, with or without the year.
            if (nowDate.getFullYear() === nowDate.getFullYear()) {
                return Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric'
                }).format(someDate)
                // return shortMonths[date.getMonth()] + ' ' + date.getDate();
            } else {
                return Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                }).format(someDate)
                // return shortMonths[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
            }
        }
    }

    renderRequestJoinRequest(request: types.UserRequest) {
        const title = (
            <span>
                <Icon type="user" />
                <Icon type="arrow-right" />
                <Icon type="team" />
                {' '}
                Request to Join Group
            </span>
        )
        const actions = [
            <Button
                type="primary"
                style={{ margin: '0 5px' }}
                onClick={() => this.onAcceptJoinRequest.call(this, request.id)}>
                Approve
            </Button>,
            <Button
                type="danger"
                style={{ margin: '0 5px' }}
                onClick={() => this.onDenyJoinRequest.call(this, request.id)}>
                Deny
            </Button>
        ]

        return (
            <Card key={request.id}
                title={title}
                hoverable={true}
                actions={actions}
                headStyle={{ backgroundColor: 'rgba(200, 200, 200,0.3' }}
                style={{ marginBottom: '10px' }}>
                <table className="pendingRequestsTable">
                    <tbody>
                        <tr>
                            <th>from</th>
                            <td className="requester">
                                <User user={request.requester} avatarSize={50} />
                            </td>
                        </tr>
                        <tr>
                            <th>sent</th>
                            <td className="createdAt">{Intl.DateTimeFormat('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            }).format(request.createdAt)}</td>
                        </tr>
                        <tr>
                            <th>expires</th>
                            <td className="expiresAt">{Intl.DateTimeFormat('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            }).format(request.expireAt)} ({this.niceElapsed(request.expireAt)})</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        )
    }

    renderRequestJoinInvitation(request: types.UserInvitation) {
        const title = (
            <span>
                <Icon type="team" />
                <Icon type="mail" />
                <Icon type="arrow-right" />
                <Icon type="user" />


                {' '}
                Invitation to Join Group
            </span>
        )
        const actions = [
            <Button
                type="danger"
                style={{ margin: '0 5px' }}
                onClick={() => this.onCancelJoinInvitation.call(this, request.id)}>
                Cancel
            </Button>
        ]

        return (
            <Card key={request.id}
                title={title}
                hoverable={true}
                actions={actions}
                headStyle={{ backgroundColor: 'rgba(200, 200, 200,0.3' }}
                style={{ marginBottom: '10px' }}>
                <table className="pendingRequestsTable">
                    <tbody>
                        <tr>
                            <th>invitation to</th>
                            <td className="requester">
                                <User user={request.user} avatarSize={50} />
                            </td>
                        </tr>
                        <tr>
                            <th>sent</th>
                            <td className="createdAt">{Intl.DateTimeFormat('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            }).format(request.createdAt)}</td>
                        </tr>
                        <tr>
                            <th>expires</th>
                            <td className="expiresAt">{Intl.DateTimeFormat('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            }).format(request.expireAt)} ({this.niceElapsed(request.expireAt)})</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        )
    }

    renderRequestNarrativeRequest(request: types.WorkspaceRequest) {
        const title = (
            <span>
                <Icon type="file" />
                <Icon type="arrow-right" />
                <Icon type="team" />
                {' '}
                Request to Add Narrative
            </span>
        )
        const actions = [
            <Button
                type="primary"
                style={{ margin: '0 5px' }}
                onClick={() => this.onAcceptJoinRequest.call(this, request.id)}>
                Approve
            </Button>,
            <Button
                type="danger"
                style={{ margin: '0 5px' }}
                onClick={() => this.onDenyJoinRequest.call(this, request.id)}>
                Deny
            </Button>
        ]

        return (
            <Card key={request.id}
                title={title}
                hoverable={true}
                actions={actions}
                headStyle={{ backgroundColor: 'rgba(200, 200, 200,0.3' }}
                style={{ marginBottom: '10px' }}>
                <table className="pendingRequestsTable">
                    <tbody>
                        <tr>
                            <th>from</th>
                            <td className="requester">
                                <User user={request.requester} avatarSize={50} />
                            </td>
                        </tr>
                        <tr>
                            <th>narrative</th>
                            <td className="narrative">
                                {request.workspace}
                            </td>
                        </tr>
                        <tr>
                            <th>sent</th>
                            <td className="createdAt">{Intl.DateTimeFormat('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            }).format(request.createdAt)}</td>
                        </tr>
                        <tr>
                            <th>expires</th>
                            <td className="expiresAt">{Intl.DateTimeFormat('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            }).format(request.expireAt)} ({this.niceElapsed(request.expireAt)})</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        )
    }

    renderRequestAppRequest(request: types.AppRequest) {
        const title = (
            <span>
                <Icon type="appstore" />
                <Icon type="arrow-right" />
                <Icon type="team" />
                {' '}
                Request to Add App
            </span>
        )
        const actions = [
            <Button
                type="primary"
                style={{ margin: '0 5px' }}
                onClick={() => this.onAcceptJoinRequest.call(this, request.id)}>
                Approve
            </Button>,
            <Button
                type="danger"
                style={{ margin: '0 5px' }}
                onClick={() => this.onDenyJoinRequest.call(this, request.id)}>
                Deny
            </Button>
        ]

        return (
            <Card key={request.id}
                title={title}
                hoverable={true}
                actions={actions}
                headStyle={{ backgroundColor: 'rgba(200, 200, 200,0.3' }}
                style={{ marginBottom: '10px' }}>
                <table className="pendingRequestsTable">
                    <tbody>
                        <tr>
                            <th>from</th>
                            <td className="requester">
                                <User user={request.requester} avatarSize={50} />
                            </td>
                        </tr>
                        <tr>
                            <th>app</th>
                            <td className="requester">
                                {request.app}
                            </td>
                        </tr>
                        <tr>
                            <th>sent</th>
                            <td className="createdAt">{Intl.DateTimeFormat('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            }).format(request.createdAt)}</td>
                        </tr>
                        <tr>
                            <th>expires</th>
                            <td className="expiresAt">{Intl.DateTimeFormat('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            }).format(request.expireAt)} ({this.niceElapsed(request.expireAt)})</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        )
    }

    renderRequest(request: types.GroupRequest) {
        switch (request.type) {
            case types.RequestType.REQUEST:
                switch (request.resourceType) {
                    case types.RequestResourceType.USER:
                        return this.renderRequestJoinRequest(request as types.UserRequest)
                    case types.RequestResourceType.WORKSPACE:
                        return this.renderRequestNarrativeRequest(request as types.WorkspaceRequest)
                    case types.RequestResourceType.APP:
                        return this.renderRequestAppRequest(request as types.AppRequest)
                    default:
                        throw new Error('Unsupported resource type: ' + request.resourceType)
                }
            case types.RequestType.INVITATION:
                switch (request.resourceType) {
                    case types.RequestResourceType.USER:
                        return this.renderRequestJoinInvitation(request as types.UserInvitation)
                    case types.RequestResourceType.WORKSPACE:
                        throw new Error('Workspace invitations are not supported')
                    // return this.renderRequestNarrativeInvitation(request as types.WorkspaceRequest)
                    case types.RequestResourceType.APP:
                        throw new Error('App invitations are not supported')
                    // return this.renderRequestAppInvitation(request as types.AppRequest)
                    default:
                        throw new Error('Unsupported resource type: ' + request.resourceType)
                }
        }
    }

    renderRequests() {
        const requests = this.props.viewState.requests
            .filter((request) => {
                return (request.type === types.RequestType.REQUEST)
            })


        if (requests.length === 0) {
            return (
                <Alert
                    type="info"
                    showIcon
                    style={{ minWidth: '5em', maxWidth: '20em', margin: '0 auto' }}
                    message="No pending requests for this organization" />
            )
        }
        return requests
            .map((request) => {
                return this.renderRequest(request)
            })
    }

    renderInvitations() {
        const invitations = this.props.viewState.requests
            .filter((request) => {
                return (request.type === types.RequestType.INVITATION)
            });

        if (invitations.length === 0) {
            return (
                <Alert
                    type="info"
                    showIcon
                    style={{ minWidth: '5em', maxWidth: '20em', margin: '0 auto' }}
                    message="No pending invitations for this organization" />
            )
        }
        return invitations
            .map((request) => {
                return this.renderRequest(request)
            })
    }

    render() {

        if (this.state.cancelToBrowser) {
            return <Redirect push to="/organizations" />
        }

        if (this.state.cancelToViewer) {
            return <Redirect push to={"/viewOrganization/" + this.props.viewState.organization.id} />
        }

        const invitationCount = this.props.viewState.requests
            .filter((request) => {
                return (request.type === types.RequestType.INVITATION)
            }).length;

        const requestCount = this.props.viewState.requests
            .filter((request) => {
                return (request.type === types.RequestType.REQUEST)
            }).length;

        return (
            <div className="ManageGroupRequests">
                {this.renderHeader()}
                <OrganizationHeader organization={this.props.viewState.organization} />
                <div className="row">
                    <div className="pendingCol">
                        <h2>Requests ({requestCount})</h2>
                        <div className="pendingRequests">
                            {this.renderRequests()}
                        </div>
                    </div>
                    <div className="historyCol">
                        <h2>Invitations ({invitationCount})</h2>
                        {this.renderInvitations()}
                    </div>
                </div>
            </div>
        )
    }
}

export default ManageGroupRequests