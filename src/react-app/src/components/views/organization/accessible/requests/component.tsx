import * as React from 'react'

import './component.css'
import * as types from '../../../../../types'
import Header from '../../../../Header'
import { Icon, Button, Modal, Card, Alert } from 'antd'
import { Redirect } from 'react-router'
import User from '../../../../entities/UserContainer'
import OrganizationHeader from '../../../organizationHeader/loader'
import Narrative from '../../../../entities/NarrativeContainer'
import * as requestModel from '../../../../../data/models/requests'
import * as orgModel from '../../../../../data/models/organization/model'
import { NavLink } from 'react-router-dom'
import { niceElapsed } from '../../../../../lib/time'
import * as requestMode from '../../../../../data/models/requests'
import InboxRequest from './InboxRequestContainer'
import OutboxRequest from './OutboxRequestContainer'

export interface RequestsProps {
    inbox: Array<requestModel.Request>
    outbox: Array<requestModel.Request>
    // organizationId: string,
    // viewModel: types.
    // onStart: (organizationId: string) => void,
    onAcceptJoinRequest: (request: requestModel.Request) => void
    onDenyJoinRequest: (request: requestModel.Request) => void
    onCancelJoinInvitation: (request: requestModel.Request) => void
    onGetViewAccess: (request: requestModel.Request) => void
}

export interface RequestsState {
    cancelToBrowser: boolean
    cancelToViewer: boolean
}

class ManageGroupRequests extends React.Component<RequestsProps, RequestsState> {

    constructor(props: RequestsProps) {
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
    onAcceptJoinRequest(request: requestModel.Request) {
        this.props.onAcceptJoinRequest(request)
    }
    onDenyJoinRequest(request: requestModel.Request) {
        this.props.onDenyJoinRequest(request)
    }
    onCancelJoinInvitation(request: requestModel.Request) {
        this.props.onCancelJoinInvitation(request)
    }
    onGetViewAccess(request: requestModel.Request) {
        this.props.onGetViewAccess(request)
    }
    onViewProfile(username: string) {
        window.open('/#people/' + username, '_blank')
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

    // renderHeader() {
    //     let orgName: string
    //     // if (this.props.manageOrganizationRequestsView && this.props.manageOrganizationRequestsView.viewState) {
    //     //     orgName = this.props.manageOrganizationRequestsView.viewState.organization.name
    //     // } else {
    //     //     orgName = 'loading...'
    //     // }
    //     const breadcrumbs = (
    //         <React.Fragment>
    //             <span>
    //                 <NavLink to={`/viewOrganization/${this.props.viewModel.organization.id}`}>
    //                     <span style={{ fontWeight: 'bold' }}>
    //                         {this.renderOrgName(this.props.viewModel.organization.name)}
    //                     </span>
    //                 </NavLink>

    //                 <Icon type="right" style={{ verticalAlign: 'middle', marginLeft: '4px', marginRight: '4px' }} />

    //                 <Icon type="tool" />
    //                 {' '}
    //                 <span style={{ fontSize: '120%' }}>Managing Org Requests</span>
    //             </span>
    //         </React.Fragment>
    //     )
    //     const buttons = (
    //         <React.Fragment>
    //             {/* <Button icon="undo"
    //                 type="danger"
    //                 onClick={this.onClickCancelToViewer.bind(this)}>
    //                 Return to this Org
    //             </Button> */}
    //             <Button
    //                 shape="circle"
    //                 icon="info"
    //                 onClick={this.onShowInfo.bind(this)}>
    //             </Button>
    //         </React.Fragment>
    //     )
    //     return (
    //         <Header breadcrumbs={breadcrumbs} buttons={buttons} />
    //     )
    // }

    renderLoadingHeader() {
        const breadcrumbs = (
            <span>
                Loading Org Editor...
            </span>
        )

        return (
            <Header breadcrumbs={breadcrumbs} />
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


    renderRequestJoinRequest(request: requestModel.UserRequest) {
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
                onClick={() => this.onAcceptJoinRequest.call(this, request)}>
                Approve
            </Button>,
            <Button
                type="danger"
                style={{ margin: '0 5px' }}
                onClick={() => this.onDenyJoinRequest.call(this, request)}>
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
                                <User userId={request.requester} avatarSize={50} />
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
                            }).format(request.expireAt)} ({niceElapsed(request.expireAt)})</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        )
    }

    renderRequestJoinInvitation(request: requestModel.UserInvitation) {
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
                onClick={() => this.onCancelJoinInvitation.call(this, request)}>
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
                                <User userId={request.user} avatarSize={30} />
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
                            }).format(request.expireAt)} ({niceElapsed(request.expireAt)})</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        )
    }

    renderNarrativePermission(permission: orgModel.UserWorkspacePermission) {
        switch (permission) {
            case orgModel.UserWorkspacePermission.NONE:
                return 'None'
            case orgModel.UserWorkspacePermission.VIEW:
                return 'View Only'
            // return 'View and Copy'
            case orgModel.UserWorkspacePermission.EDIT:
                return 'Edit'
            // return 'View, Copy, Save, Run'
            case orgModel.UserWorkspacePermission.ADMIN:
                return 'Admin'
            // return 'View, Copy, Save, Run, Manage Sharing'
            case orgModel.UserWorkspacePermission.OWNER:
                return 'Owner'
            // return 'View, Copy, Save, Run, Manage Sharing, Own'
        }
    }

    renderRequestNarrativeRequest(request: requestModel.WorkspaceRequest) {
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
                onClick={() => this.onAcceptJoinRequest.call(this, request)}>
                Approve
            </Button>,
            <Button
                type="danger"
                style={{ margin: '0 5px' }}
                onClick={() => this.onDenyJoinRequest.call(this, request)}>
                Deny
            </Button>
        ]

        let narrativeAccess
        narrativeAccess = (
            <Narrative workspaceId={parseInt(request.narrativeId, 10)} />
        )
        // TODO: Revive me!!
        // if (request.narrativeId) {
        //     // TODO: note the '1' below -- we dont' get the object id from the groups service,
        //     // and the narrative will soon accept just the workspace id (and will look up the object id by itself)
        //     // but not yet, so we just use 1, which is INCORRECT.
        //     narrativeAccess = (
        //         <div>
        //             <div>
        //                 <a href={"/narrative/ws." + request.narrativeId + '.obj.' + '1'} target="_blank">{request.title}</a>
        //             </div>
        //             <div>
        //                 <span className="field-label">your access</span>{' '}{this.renderNarrativePermission(request.narrative.permission)}
        //             </div>
        //             <div>
        //                 <span className="field-label">public?</span>{' '}{request.isPublic ? 'yes' : 'no'}
        //             </div>

        //         </div>
        //     )
        // } else {
        //     narrativeAccess = (
        //         <span>
        //             You don't have access to this narrative
        //             {' '}
        //             <Button
        //                 onClick={() => { this.onGetViewAccess.call(this, request.id) }}>
        //                 Click for View Access
        //             </Button>
        //         </span>
        //     )
        // }

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
                                <User userId={request.requester} avatarSize={30} />
                            </td>
                        </tr>
                        <tr>
                            <th>narrative</th>
                            <td className="narrative">
                                {narrativeAccess}
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
                            }).format(request.expireAt)} ({niceElapsed(request.expireAt)})</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        )
    }

    renderRequestAppRequest(request: requestModel.AppRequest) {
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
                onClick={() => this.onAcceptJoinRequest.call(this, request)}>
                Approve
            </Button>,
            <Button
                type="danger"
                style={{ margin: '0 5px' }}
                onClick={() => this.onDenyJoinRequest.call(this, request)}>
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
                                <User userId={request.requester} avatarSize={50} />
                            </td>
                        </tr>
                        <tr>
                            <th>app</th>
                            <td className="requester">
                                {request.appId}
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
                            }).format(request.expireAt)} ({niceElapsed(request.expireAt)})</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        )
    }

    // renderRequest(request: requestModel.Request) {
    //     switch (request.type) {
    //         case types.RequestType.REQUEST:
    //             switch (request.resourceType) {
    //                 case types.RequestResourceType.USER:
    //                     return this.renderRequestJoinRequest(request as requestModel.UserRequest)
    //                 case types.RequestResourceType.WORKSPACE:
    //                     return this.renderRequestNarrativeRequest(request as requestModel.WorkspaceRequest)
    //                 case types.RequestResourceType.APP:
    //                     return this.renderRequestAppRequest(request as requestModel.AppRequest)
    //                 default:
    //                     throw new Error('Unsupported resource type: ' + request.resourceType)
    //             }
    //         case types.RequestType.INVITATION:
    //             switch (request.resourceType) {
    //                 case types.RequestResourceType.USER:
    //                     return this.renderRequestJoinInvitation(request as requestModel.UserInvitation)
    //                 case types.RequestResourceType.WORKSPACE:
    //                     throw new Error('Workspace invitations are not supported')
    //                 // return this.renderRequestNarrativeInvitation(request as types.WorkspaceRequest)
    //                 case types.RequestResourceType.APP:
    //                     throw new Error('App invitations are not supported')
    //                 // return this.renderRequestAppInvitation(request as types.AppRequest)
    //                 default:
    //                     throw new Error('Unsupported resource type: ' + request.resourceType)
    //             }
    //     }
    // }

    // renderRequests() {
    //     const requests = this.props.viewModel.requests

    //     if (requests.length === 0) {
    //         return (
    //             <Alert
    //                 type="info"
    //                 showIcon
    //                 style={{ minWidth: '5em', maxWidth: '20em', margin: '0 auto' }}
    //                 message="No pending requests for this organization" />
    //         )
    //     }
    //     return requests
    //         .map((request) => {
    //             return this.renderRequest(request)
    //         })
    // }

    // renderInvitations() {
    //     const invitations = this.props.viewModel.invitations
    //     if (invitations.length === 0) {
    //         return (
    //             <Alert
    //                 type="info"
    //                 showIcon
    //                 style={{ minWidth: '5em', maxWidth: '20em', margin: '0 auto' }}
    //                 message="No pending invitations for this organization" />
    //         )
    //     }
    //     return invitations
    //         .map((request) => {
    //             return this.renderRequest(request)
    //         })
    // }

    // renderInboxCard() {
    //     const extras: Array<JSX.Element> = []
    //     const count = this.props.inbox.length
    //     const title = (
    //         <span>
    //             <Icon type="inbox" />
    //             inbox
    //             <span className="titleCount">
    //                 ({count})
    //             </span>
    //         </span>
    //     )
    //     let inbox
    //     if (this.props.inbox.length === 0) {
    //         inbox = (
    //             <div className="message">
    //                 No pending organization requests for you
    //             </div>
    //         )
    //     } else {
    //         const inboxItems = this.props.inbox.map((request) => {
    //             return (
    //                 <div key={request.id}>
    //                     <InboxRequest
    //                         request={request} />
    //                 </div>
    //             )
    //         })
    //         inbox = (
    //             <div style={{ maxHeight: '30em', overflowY: 'auto' }}>
    //                 {inboxItems}
    //             </div>
    //         )
    //     }
    //     return (
    //         <Card className="slimCard outboxCard"
    //             style={{ marginBottom: '10px' }}
    //             headStyle={{ backgroundColor: 'gray', color: 'white' }}
    //             title={title}
    //             extra={extras}>
    //             {inbox}
    //         </Card>
    //     )

    // }

    renderInbox() {
        let inbox
        if (this.props.inbox.length === 0) {
            inbox = (
                <div className="message">
                    No pending organization requests for you
                </div>
            )
        } else {
            const requests = this.props.inbox.map((request) => {
                return (
                    <div key={request.id}>
                        <InboxRequest
                            request={request} />
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

    renderOutbox() {
        let outbox
        if (this.props.outbox.length === 0) {
            outbox = (
                <div className="message">
                    No pending organization requests from you
                </div>
            )
        } else {
            const requests = this.props.outbox.map((request) => {
                return (
                    <div key={request.id}>
                        <OutboxRequest
                            request={request} />
                    </div>
                )
            })
            outbox = (
                <div style={{ overflowY: 'auto' }}>
                    {requests}
                </div>
            )
        }
        return (
            <React.Fragment>
                {outbox}
            </React.Fragment>
        )
    }

    render() {
        const outboxCount = this.props.outbox.length

        const inboxCount = this.props.inbox.length

        return (
            <div className="Requests">
                <div className="ViewOrganization-tabPaneHeader">inbox ({inboxCount})</div>
                {this.renderInbox()}
                <div className="ViewOrganization-tabPaneHeader">outbox ({outboxCount})</div>
                {this.renderOutbox()}
            </div>
        )
    }
}

export default ManageGroupRequests
