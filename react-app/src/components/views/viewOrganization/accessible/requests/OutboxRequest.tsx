import { Component, Fragment } from 'react';

import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import * as requestModel from '../../../../../data/models/requests';
import { niceElapsed } from '../../../../../lib/time';
import Narrative from '../../../../entities/NarrativeContainer';
import User from '../../../../entities/UserContainer';
import './OutboxRequest.css';

export interface RequestProps {
    request: requestModel.Request;
    onCancelOutboxRequest: (request: requestModel.Request) => void;
}

interface RequestState {

}

export default class Request extends Component<RequestProps, RequestState> {
    // renderRequestSentType(request: requestModel.Request) {
    //     switch (request.type) {
    //         case requestModel.RequestType.REQUEST:
    //             switch (request.resourceType) {
    //                 case requestModel.RequestResourceType.APP:
    //                     return 'REQUEST to associate App'
    //                 case requestModel.RequestResourceType.USER:
    //                     return 'REQUEST to join Organization'
    //                 case requestModel.RequestResourceType.WORKSPACE:
    //                     return 'REQUEST to associate Narrative'
    //             }
    //         case requestModel.RequestType.INVITATION:
    //             switch (request.resourceType) {
    //                 case requestModel.RequestResourceType.USER:
    //                     return 'INVITATION to join Organization'
    //             }
    //     }
    //     return 'unknown request'
    // }

    onCancelRequest() {
        this.props.onCancelOutboxRequest(this.props.request);
    }

    onAcceptInvitation() {
        alert('Hold your socks, not yet implemented');
    }

    onRejectInvitation() {
        alert('Hold your socks, not yet implemented');
    }


    onAcceptRequest() {
        alert('Hold your socks, not yet implemented');
    }

    onRejectRequest() {
        alert('Hold your socks, not yet implemented');
    }



    renderRequestSentSubject(request: requestModel.Request) {
        switch (request.type) {
            case requestModel.RequestType.REQUEST:
                switch (request.resourceType) {
                    case requestModel.RequestResourceType.APP:
                        return 'SHOW APP';
                    case requestModel.RequestResourceType.USER:
                        return '';
                    case requestModel.RequestResourceType.WORKSPACE:
                        return (
                            <div>
                                <div className="miniDetail">
                                    <Narrative workspaceId={parseInt(request.narrativeId, 10)} />
                                </div>
                            </div>
                        );
                }
                break;
            case requestModel.RequestType.INVITATION:
                switch (request.resourceType) {
                    case requestModel.RequestResourceType.USER:
                        return (
                            <div>
                                <div className="miniDetail">
                                    <User userId={request.user} avatarSize={30} />
                                </div>
                            </div>
                        );
                }
        }
        return 'unknown request';
    }

    renderRequestRequester(request: requestModel.Request) {
        return (
            <User userId={request.requester} avatarSize={30} />
        );
    }

    renderRequestReceivedType(request: requestModel.Request) {
        switch (request.type) {
            case requestModel.RequestType.REQUEST:
                switch (request.resourceType) {
                    case requestModel.RequestResourceType.APP:
                        return 'REQUEST to associate App';
                    case requestModel.RequestResourceType.USER:
                        return 'REQUEST to join Organization';
                    case requestModel.RequestResourceType.WORKSPACE:
                        return 'REQUEST to associate Narrative';
                }
                break;
            case requestModel.RequestType.INVITATION:
                switch (request.resourceType) {
                    case requestModel.RequestResourceType.USER:
                        return 'INVITATION to join Organization';
                }
        }
        return 'unknown request';
    }

    renderRequestReceivedSubject(request: requestModel.Request) {
        switch (request.type) {
            case requestModel.RequestType.REQUEST:
                switch (request.resourceType) {
                    case requestModel.RequestResourceType.APP:
                        return 'SHOW APP';
                    case requestModel.RequestResourceType.USER:
                        return '';
                    case requestModel.RequestResourceType.WORKSPACE:
                        return (
                            <div>
                                <div className="miniDetail">
                                    <Narrative workspaceId={parseInt(request.narrativeId, 10)} />
                                </div>
                                <div className="cardSectionHeader">with organization</div>
                            </div>
                        );
                }
                break;
            case requestModel.RequestType.INVITATION:
                switch (request.resourceType) {
                    case requestModel.RequestResourceType.USER:
                        return (
                            <User userId={request.user} avatarSize={30} />
                        );
                }
        }
        return 'unknown request';
    }

    renderJoinRequest(request: requestModel.UserRequest) {
        return (
            <Fragment>
                <div className="cardSectionHeader">
                    REQUEST to join Organization
                </div>

                {this.renderRequestOptions(request)}
            </Fragment>
        );
    }

    renderWorkspaceRequest(request: requestModel.WorkspaceRequest) {
        return (
            <Fragment>
                <div className="cardSectionHeader">
                    REQUEST to associate Narrative
                </div>

                <div className="miniDetail">
                    <Narrative workspaceId={parseInt(request.narrativeId, 10)} />
                </div>

                {this.renderRequestOptions(request)}
            </Fragment>
        );
    }

    renderAppRequest(request: requestModel.AppRequest) {
        return (
            <Fragment>
                <div className="cardSectionHeader">
                    REQUEST to associate App
                </div>

                <div className="miniDetail">
                    Apps not supported yet
                    {/* <Narrative workspaceId={parseInt(request.narrativeId, 10)} /> */}
                </div>

                {this.renderRequestOptions(request)}
            </Fragment>
        );
    }

    renderRequestOptions(request: requestModel.Request) {
        // First, did the current user make or receive the request
        return (
            <div style={{ textAlign: 'center' }}>
                <Button.Group style={{ marginTop: '4px' }}>
                    <Button
                        danger
                        onClick={this.onCancelRequest.bind(this)}>
                        <CloseOutlined />Cancel Request
                        </Button>
                </Button.Group>
            </div>
        );

    }

    renderUserInvitation(request: requestModel.UserInvitation) {
        return (
            <Fragment>
                <div className="cardSectionHeader">
                    INVITATION to join organization
                </div>

                <div className="cardSectionHeader">
                    sent to
                </div>

                <div className="miniDetail">
                    {this.renderRequestReceivedSubject(request)}
                </div>

                {this.renderRequestOptions(request)}
            </Fragment>
        );
    }

    renderBody() {
        const request = this.props.request;
        switch (request.type) {
            case requestModel.RequestType.REQUEST:
                switch (request.resourceType) {
                    case requestModel.RequestResourceType.USER:
                        return this.renderJoinRequest(request);
                    case requestModel.RequestResourceType.WORKSPACE:
                        return this.renderWorkspaceRequest(request);
                    case requestModel.RequestResourceType.APP:
                        return this.renderAppRequest(request);
                }
                break;
            case requestModel.RequestType.INVITATION:
                switch (request.resourceType) {
                    case requestModel.RequestResourceType.USER:
                        return this.renderUserInvitation(request);
                    case requestModel.RequestResourceType.WORKSPACE:
                        return (
                            <Fragment>
                                <div>Hmm, not supported</div>
                            </Fragment>
                        );
                    case requestModel.RequestResourceType.APP:
                        return (
                            <Fragment>
                                <div>Hmm, not supported</div>
                            </Fragment>
                        );
                }
        }
    }

    render() {
        const request = this.props.request;
        return (
            <div key={request.id} className="OutboxRequest kbCard">
                <div className="kbCard-header">
                    <div className="OutboxRequest-requestHeaderRow">
                        <div className="OutboxRequest-requestHeaderCreatedAt">
                            {/* <span className="field-label">created</span>
                                {' '} */}
                            {Intl.DateTimeFormat('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            }).format(request.createdAt)}
                        </div>
                        <div className="OutboxRequest-requestHeaderExpireAt">
                            <span className="field-label">expires</span>
                            {' '}
                            {niceElapsed(request.expireAt)}
                        </div>
                    </div>
                </div>
                <div className="kbCard-body">
                    {this.renderBody()}
                </div>
            </div>
        );
    }
}