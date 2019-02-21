import * as React from 'react'
import { RequestType, RequestResourceType } from '../../types';
import { Card, Icon } from 'antd';
import User from '../entities/UserContainer';
import './component.css'
import { niceElapsed } from '../../lib/time'

import * as orgModel from '../../data/models/organization/model'
import * as requestModel from '../../data/models/requests'

export interface RequestProps {
    request: requestModel.Request
}

export interface RequestState {

}

export class Request extends React.Component<RequestProps, RequestState> {
    constructor(props: RequestProps) {
        super(props)
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
            // <Button
            //     type="primary"
            //     style={{ margin: '0 5px' }}
            //     onClick={() => this.onAcceptJoinRequest.call(this, request.id)}>
            //     Approve
            // </Button>,
            // <Button
            //     type="danger"
            //     style={{ margin: '0 5px' }}
            //     onClick={() => this.onDenyJoinRequest.call(this, request.id)}>
            //     Deny
            // </Button>
        ] as Array<JSX.Element>

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
            // <Button
            //     type="danger"
            //     style={{ margin: '0 5px' }}
            //     onClick={() => this.onCancelJoinInvitation.call(this, request.id)}>
            //     Cancel
            // </Button>
        ] as Array<JSX.Element>

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
                                <User userId={request.user} avatarSize={50} />
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

    renderRequestNarrativeRequest(request: requestModel.WorkspaceRequest) {
        const title = (
            <span>
                <Icon type="file" />
                <Icon type="arrow-right" />
                <Icon type="team" />
                {' '}
                Request to Associate Narrative
            </span>
        )
        const actions = [
            // <Button
            //     type="primary"
            //     style={{ margin: '0 5px' }}
            //     onClick={() => this.onAcceptJoinRequest.call(this, request.id)}>
            //     Approve
            // </Button>,
            // <Button
            //     type="danger"
            //     style={{ margin: '0 5px' }}
            //     onClick={() => this.onDenyJoinRequest.call(this, request.id)}>
            //     Deny
            // </Button>
        ] as Array<JSX.Element>

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
                            <th>narrative</th>
                            <td className="narrative">
                                {request.narrativeId}
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
            // <Button
            //     type="primary"
            //     style={{ margin: '0 5px' }}
            //     onClick={() => this.onAcceptJoinRequest.call(this, request.id)}>
            //     Approve
            // </Button>,
            // <Button
            //     type="danger"
            //     style={{ margin: '0 5px' }}
            //     onClick={() => this.onDenyJoinRequest.call(this, request.id)}>
            //     Deny
            // </Button>
        ] as Array<JSX.Element>

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

    renderRequest() {
        const request = this.props.request
        switch (request.type) {
            case RequestType.REQUEST:
                switch (request.resourceType) {
                    case RequestResourceType.USER:
                        return this.renderRequestJoinRequest(request as requestModel.UserRequest)
                    case RequestResourceType.WORKSPACE:
                        return this.renderRequestNarrativeRequest(request as requestModel.WorkspaceRequest)
                    case RequestResourceType.APP:
                        return this.renderRequestAppRequest(request as requestModel.AppRequest)
                    default:
                        throw new Error('Unsupported resource type: ' + request.resourceType)
                }
            case RequestType.INVITATION:
                switch (request.resourceType) {
                    case RequestResourceType.USER:
                        return this.renderRequestJoinInvitation(request as requestModel.UserInvitation)
                    case RequestResourceType.WORKSPACE:
                        throw new Error('Workspace invitations are not supported')
                    // return this.renderRequestNarrativeInvitation(request as WorkspaceRequest)
                    case RequestResourceType.APP:
                        throw new Error('App invitations are not supported')
                    // return this.renderRequestAppInvitation(request as AppRequest)
                    default:
                        throw new Error('Unsupported resource type: ' + request.resourceType)
                }
        }
    }

    render() {
        return (
            <div className="Request">
                {this.renderRequest()}
            </div>
        )
    }
}