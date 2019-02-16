import * as React from 'react'

import './component.css'
import Header from '../../../../Header'
import { Icon, Button, Modal, Card, Alert } from 'antd'
import User from '../../../../entities/UserContainer'
import Narrative from '../../../../entities/NarrativeContainer'
import * as requestModel from '../../../../../data/models/requests'
import * as orgModel from '../../../../../data/models/organization/model'
import { niceElapsed } from '../../../../../lib/time'
import InboxRequest from './InboxRequestContainer'
import OutboxRequest from './OutboxRequestContainer'

export interface RequestsProps {
    inbox: Array<requestModel.Request>
    outbox: Array<requestModel.Request>
    relation: orgModel.Relation
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
                <table className="Requests-pendingRequestsTable">
                    <tbody>
                        <tr>
                            <th>from</th>
                            <td className="Requests-requester">
                                <User userId={request.requester} avatarSize={50} />
                            </td>
                        </tr>
                        <tr>
                            <th>sent</th>
                            <td className="Requests-createdAt">{Intl.DateTimeFormat('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            }).format(request.createdAt)}</td>
                        </tr>
                        <tr>
                            <th>expires</th>
                            <td className="Requests-expiresAt">{Intl.DateTimeFormat('en-US', {
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
                <table className="Requests-pendingRequestsTable">
                    <tbody>
                        <tr>
                            <th>invitation to</th>
                            <td className="Requests-requester">
                                <User userId={request.user} avatarSize={30} />
                            </td>
                        </tr>
                        <tr>
                            <th>sent</th>
                            <td className="Requests-createdAt">{Intl.DateTimeFormat('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            }).format(request.createdAt)}</td>
                        </tr>
                        <tr>
                            <th>expires</th>
                            <td className="Requests-expiresAt">{Intl.DateTimeFormat('en-US', {
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
                <table className="Requests-pendingRequestsTable">
                    <tbody>
                        <tr>
                            <th>from</th>
                            <td className="Requests-requester">
                                <User userId={request.requester} avatarSize={30} />
                            </td>
                        </tr>
                        <tr>
                            <th>narrative</th>
                            <td className="Requests-narrative">
                                {narrativeAccess}
                            </td>
                        </tr>
                        <tr>
                            <th>sent</th>
                            <td className="Requests-createdAt">{Intl.DateTimeFormat('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            }).format(request.createdAt)}</td>
                        </tr>
                        <tr>
                            <th>expires</th>
                            <td className="Requests-expiresAt">{Intl.DateTimeFormat('en-US', {
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
                <table className="Requests-pendingRequestsTable">
                    <tbody>
                        <tr>
                            <th>from</th>
                            <td className="Requests-requester">
                                <User userId={request.requester} avatarSize={50} />
                            </td>
                        </tr>
                        <tr>
                            <th>app</th>
                            <td className="Requests-requester">
                                {request.appId}
                            </td>
                        </tr>
                        <tr>
                            <th>sent</th>
                            <td className="Requests-createdAt">{Intl.DateTimeFormat('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            }).format(request.createdAt)}</td>
                        </tr>
                        <tr>
                            <th>expires</th>
                            <td className="Requests-expiresAt">{Intl.DateTimeFormat('en-US', {
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

    renderInbox() {
        let inbox
        if (this.props.inbox.length === 0) {
            inbox = (
                <Alert type="info" message="No pending requests" />
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
                <Alert type="info" message="No pending requests" />
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

    isAdmin(relation: orgModel.Relation): boolean {
        return (
            relation.type === orgModel.UserRelationToOrganization.ADMIN ||
            relation.type === orgModel.UserRelationToOrganization.OWNER
        )
    }

    render() {
        if (this.isAdmin(this.props.relation)) {
            const outboxCount = this.props.outbox.length
            const inboxCount = this.props.inbox.length

            return (
                <div className="Requests">
                    <div className="Requests-tabPaneHeader">inbox ({inboxCount})</div>
                    {this.renderInbox()}
                    <div className="Requests-tabPaneHeader">outbox ({outboxCount})</div>
                    {this.renderOutbox()}
                </div>
            )
        } else {
            const outboxCount = this.props.outbox.length

            return (
                <div className="Requests">
                    <div className="Requests-tabPaneHeader">outbox ({outboxCount})</div>
                    {this.renderOutbox()}
                </div>
            )
        }
    }
}

export default ManageGroupRequests
