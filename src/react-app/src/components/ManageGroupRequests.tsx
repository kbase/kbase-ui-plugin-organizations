import * as React from 'react'

import './ManageGroupRequests.css'
import * as types from '../types';
import Header from './Header';
import { Icon, Button, Modal, Card } from 'antd';
import { Redirect } from 'react-router';
import User from './User';

export interface ManageGroupRequestsProps {
    organizationId: string,
    manageGroupRequestsView: types.ManageGroupRequestsView | null,
    onStart: (organizationId: string) => void,
    onAcceptJoinRequest: (requestId: string) => void,
    onDenyJoinRequest: (requestId: string) => void
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

        console.log('props', props)
        this.props.onStart(this.props.organizationId)
    }

    onClickCancelToBrowser() {
        this.setState({ cancelToBrowser: true })
    }

    onClickCancelToViewer() {
        this.setState({ cancelToViewer: true })
    }
    onAcceptJoinRequest(requestId: string) {
        if (!(this.props.manageGroupRequestsView && this.props.manageGroupRequestsView.view)) {
            return
        }
        this.props.onAcceptJoinRequest(requestId)
    }
    onDenyJoinRequest(requestId: string) {
        if (!(this.props.manageGroupRequestsView && this.props.manageGroupRequestsView.view)) {
            return
        }
        this.props.onDenyJoinRequest(requestId)
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
        if (this.props.manageGroupRequestsView && this.props.manageGroupRequestsView.view) {
            orgName = this.props.manageGroupRequestsView.view.organization.name
        } else {
            orgName = 'loading...'
        }
        return (
            <Header>
                <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <div style={{ flex: '0 0 auto' }}>
                        <span>
                            <Icon type="tool" />
                            {' '}
                            Managing Requests for Org "
                            {orgName}
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

    renderRequestType(type: types.RequestType) {
        switch (type) {
            case types.RequestType.JOIN_GROUP_REQUEST:
                return 'Join Group Request'
            case types.RequestType.JOIN_GROUP_INVITE:
                return 'Join Group Invitation'
            case types.RequestType.ADD_WORKSPACE_REQUEST:
                return 'Add Workspace Request'
            case types.RequestType.ADD_WORKSPACE_INVITE:
                return 'Add Workspace Invitation'
        }
    }

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

    renderRequestJoinRequest(request: types.GroupRequest) {
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
            // <Button
            //     style={{ margin: '0 5px' }}
            //     onClick={() => this.onViewProfile.call(this, request.requester.username)}>
            //     View Requester's User Profile
            // </Button>
        ]

        return (
            <Card key={request.id}
                title={title}
                hoverable={true}
                actions={actions}
                headStyle={{ backgroundColor: 'rgba(200, 200, 200,0.3' }}
                style={{ marginBottom: '10px' }}>
                <table className="pendingRequestsTable">
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
                </table>
            </Card>
        )
    }

    renderInviteJoinRequest(request: types.GroupRequest) {
        return (
            <div>Not yet implemented</div>
        )
    }

    renderRequestNarrativeRequest(request: types.GroupRequest) {
        return (
            <div>Not yet implemented</div>
        )
    }

    renderInviteNarrativeRequest(request: types.GroupRequest) {
        return (
            <div>Not yet implemented</div>
        )
    }

    renderRequest(request: types.GroupRequest) {
        switch (request.type) {
            case types.RequestType.JOIN_GROUP_REQUEST:
                return this.renderRequestJoinRequest(request)
            case types.RequestType.JOIN_GROUP_INVITE:
                return this.renderInviteJoinRequest(request)
            case types.RequestType.ADD_WORKSPACE_REQUEST:
                return this.renderRequestNarrativeRequest(request)
            case types.RequestType.ADD_WORKSPACE_INVITE:
                return this.renderInviteNarrativeRequest(request)
        }
    }

    // renderRequestxx(request: types.GroupRequest) {
    //     const title = (
    //         <span>
    //             <Icon type="user" />
    //             <Icon type="arrow-right" />
    //             <Icon type="team" />
    //             {' '}
    //             Request to Join Group
    //         </span>
    //     )
    //     return (
    //         <Card key={request.id}
    //             title={title}
    //             hoverable={true}
    //             style={{ marginBottom: '10px' }}>
    //             {this.renderRequestSpecificType(request)}
    //         </Card>
    //     )
    // }

    // renderRequestx(request: types.GroupRequest) {
    //     return (
    //         <div key={request.id} className="groupRequest">
    //             <div className="requestType">{this.renderRequestType(request.type)}</div>
    //             {/* <div className="field">
    //                 <span className="field-label">type</span>
    //                 <span className="requestType">{this.renderRequestType(request.type)}</span>
    //             </div> */}
    //             {/* <div className="field">
    //                 <span className="field-label">id</span>
    //                 <span>{request.id}</span>
    //             </div> */}
    //             {this.renderRequestSpecificType(request)}
    //         </div>
    //     )
    // }

    renderRequests() {
        if (!(this.props.manageGroupRequestsView && this.props.manageGroupRequestsView.view)) {
            return
        }
        if (this.props.manageGroupRequestsView.view.requests.length === 0) {
            return (
                <p style={{ textAlign: 'center', padding: '10px' }}>
                    No pending requests for this organization
                </p>
            )
        }
        return this.props.manageGroupRequestsView.view.requests.map((request) => {
            return this.renderRequest(request)
        })
    }

    render() {

        if (this.state.cancelToBrowser) {
            return <Redirect push to="/organizations" />
        }

        if (this.state.cancelToViewer) {
            return <Redirect push to={"/viewOrganization/" + this.props.organizationId} />
        }

        return (
            <div className="ManageGroupRequests">
                {this.renderHeader()}
                <div className="row">
                    <div className="pendingCol">
                        <h2>Current Pending Requests</h2>
                        <div className="pendingRequests">
                            {this.renderRequests()}
                        </div>
                    </div>
                    <div className="historyCol">
                        <h2>Request History</h2>
                        <p>[to be done]</p>
                        <p>This will show a browesable, searchable, filterable list
                            of "closed" (canceled, accepted, denied) requests. Default shows
                            all in descending date (modified) order
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}

export default ManageGroupRequests