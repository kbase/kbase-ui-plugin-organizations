import * as React from 'react'
import Header from '../../Header';
import { Icon, Card, Button, Alert, Modal } from 'antd';
import './component.css'
import { Redirect } from 'react-router-dom';
import { DashboardViewModel } from '../../../types';
import * as orgModel from '../../../data/models/organization/model'
import * as requestModel from '../../../data/models/requests'
import Organization from './Organization';
import OrganizationCompact from './OrganizationCompactContainer'
import * as formatters from '../../../data/formatters'
import Narrative from '../../entities/NarrativeContainer';
import User from '../../entities/UserContainer';

enum NavigateTo {
    NONE = 0,
    BROWSER,
    NEW_ORG
}

export interface DashboardProps {
    viewModel: DashboardViewModel
}

interface DashboardState {
    navigateTo: NavigateTo
}

export class Dashboard extends React.Component<DashboardProps, DashboardState> {
    constructor(props: DashboardProps) {
        super(props)

        this.state = {
            navigateTo: NavigateTo.NONE
        }
    }

    onNavigateToBrowser() {
        this.setState({ navigateTo: NavigateTo.BROWSER })
    }

    onNavigateToNewOrg() {
        this.setState({ navigateTo: NavigateTo.NEW_ORG })
    }

    onShowInfo() {
        Modal.info({
            title: 'Dashboard',
            width: '50em',
            content: (
                <div>
                    <p>This is the dashboard...</p>
                </div>
            )
        })
    }

    renderHeader() {
        const breadcrumbs = (
            <React.Fragment>
                <span>
                    Your Orgs Dashboard
                </span>
            </React.Fragment>
        )
        const buttons = (
            <React.Fragment>
                <Button
                    shape="circle"
                    icon="info"
                    onClick={this.onShowInfo.bind(this)}>
                </Button>
            </React.Fragment>
        )
        return (
            <Header breadcrumbs={breadcrumbs} buttons={buttons} />
        )
    }

    renderOrganizations() {
        const orgs = this.props.viewModel.organizations
        if (orgs.length === 0) {
            const message = (
                <div>
                    <p>
                        You are not associated with any Organizations
                    </p>
                    <p>
                        To get started, you can create a
                        {' '}
                        <Button onClick={this.onNavigateToNewOrg.bind(this)}><Icon type="plus" />{' '}New</Button>
                        {' '}
                        Organization,
                        or
                        {' '}
                        <Button onClick={this.onNavigateToBrowser.bind(this)}>Browse All</Button>
                        {' '}
                        organizations to find one to join.
                    </p>
                </div>
            )
            return (
                <Alert type="info"
                    message={message} />
            )
        }
        return this.props.viewModel.organizations.map((org) => {
            return (
                <div key={org.organization.id}>
                    <Organization organization={org} />
                </div>
            )
        })
    }

    renderOrganizationsCard() {
        const extra = [
            <Button key="newOrgButton" onClick={this.onNavigateToNewOrg.bind(this)}><Icon type="plus" />{' '}New</Button>,
            <Button key="browseButton" onClick={this.onNavigateToBrowser.bind(this)}>Browse All</Button>
        ]
        return (
            <Card title="Your Organizations"
                headStyle={{ backgroundColor: 'gray', color: 'white' }}
                className="slimCard yourOrgsCard"
                extra={extra}>
                {this.renderOrganizations()}
            </Card>
        )
    }

    renderNotificationsCard() {
        return (
            <Card title="Notifications"
                headStyle={{ backgroundColor: 'gray', color: 'white' }}
                className="slimCard notificationsCard">
                {this.renderPendingNotifications()}
            </Card>
        )
    }

    renderRequestSentType(request: requestModel.Request) {
        switch (request.type) {
            case requestModel.RequestType.REQUEST:
                switch (request.resourceType) {
                    case requestModel.RequestResourceType.APP:
                        return 'REQUEST to associate App'
                    case requestModel.RequestResourceType.USER:
                        return 'REQUEST to join Organization'
                    case requestModel.RequestResourceType.WORKSPACE:
                        return 'REQUEST to associate Narrative'
                }
            case requestModel.RequestType.INVITATION:
                switch (request.resourceType) {
                    case requestModel.RequestResourceType.USER:
                        return 'INVITATION to join Organization'
                }
        }
        return 'unknown request'
    }

    renderRequestSentSubject(request: requestModel.Request) {
        switch (request.type) {
            case requestModel.RequestType.REQUEST:
                switch (request.resourceType) {
                    case requestModel.RequestResourceType.APP:
                        return 'SHOW APP'
                    case requestModel.RequestResourceType.USER:
                        return ''
                    case requestModel.RequestResourceType.WORKSPACE:
                        return (
                            <div>
                                <div className="miniDetail">
                                    <Narrative workspaceId={parseInt(request.narrativeId, 10)} />
                                </div>
                                <div>with organization</div>
                            </div>
                        )
                }
            case requestModel.RequestType.INVITATION:
                switch (request.resourceType) {
                    case requestModel.RequestResourceType.USER:
                        return (
                            <div>
                                <div>sent to</div>
                                <div className="miniDetail">
                                    <User userId={request.user} avatarSize={30} />
                                </div>
                                <div>to join organization</div>
                            </div>
                        )
                }
        }
        return 'unknown request'
    }

    renderRequestRequester(request: requestModel.Request) {
        return (
            <User userId={request.requester} avatarSize={30} />
        )
    }

    renderRequestReceivedType(request: requestModel.Request) {
        switch (request.type) {
            case requestModel.RequestType.REQUEST:
                switch (request.resourceType) {
                    case requestModel.RequestResourceType.APP:
                        return 'REQUEST to associate App'
                    case requestModel.RequestResourceType.USER:
                        return 'REQUEST to join Organization'
                    case requestModel.RequestResourceType.WORKSPACE:
                        return 'REQUEST to associate Narrative'
                }
            case requestModel.RequestType.INVITATION:
                switch (request.resourceType) {
                    case requestModel.RequestResourceType.USER:
                        return 'INVITATION to join Organization'
                }
        }
        return 'unknown request'
    }

    renderRequestReceivedSubject(request: requestModel.Request) {
        switch (request.type) {
            case requestModel.RequestType.REQUEST:
                switch (request.resourceType) {
                    case requestModel.RequestResourceType.APP:
                        return 'SHOW APP'
                    case requestModel.RequestResourceType.USER:
                        return ''
                    case requestModel.RequestResourceType.WORKSPACE:
                        return (
                            <div>
                                <div className="miniDetail">
                                    <Narrative workspaceId={parseInt(request.narrativeId, 10)} />
                                </div>
                                <div>with organization</div>
                            </div>
                        )
                }
            case requestModel.RequestType.INVITATION:
                switch (request.resourceType) {
                    case requestModel.RequestResourceType.USER:
                        return ''
                }
        }
        return 'unknown request'
    }

    renderPendingRequestsSentCard() {
        return (
            <Card title="Requests From You"
                headStyle={{ backgroundColor: 'gray', color: 'white' }}
                className="slimCard pendingRequestsCard">
                {this.renderPendingRequestsSent()}
            </Card>
        )
    }

    renderPendingRequestsReceivedCard() {
        return (
            <Card title="Invitations To You"
                headStyle={{ backgroundColor: 'gray', color: 'white' }}
                className="slimCard pendingInvitationsCard">
                {this.renderPendingRequestsReceived()}
            </Card>
        )
    }

    renderPendingAdminTasksCard() {
        return (
            <Card title="Organization Requests"
                headStyle={{ backgroundColor: 'gray', color: 'white' }}
                className="slimCard pendingAdminTasksCard">
                {this.renderPendingAdminRequests()}
            </Card>
        )
    }

    renderPendingNotifications() {
        return (
            <div className="message">
                not yet implemented
            </div>
        )
        // const notifications = this.props.viewModel.notifications
        // if (notifications.length === 0) {
        //     return (
        //         <div className="message">
        //             No pending notifications
        //         </div>
        //     )
        // }
        // return (
        //     <div>
        //         notifications here
        //     </div>
        // )
    }

    renderPendingRequestsSent() {
        const requests = this.props.viewModel.pendingRequests
        if (requests.length === 0) {
            return (
                <div className="message">
                    No pending requests
                </div>
            )
        }
        return this.props.viewModel.pendingRequests.map((request) => {
            return (
                <div key={request.id} className="aRequest request">
                    <div className="requestHeader">
                        <div className="requestHeaderRow">
                            <div className="requestHeaderCreatedAt">
                                {/* <span className="field-label">created</span>
                                {' '} */}
                                {Intl.DateTimeFormat('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                }).format(request.createdAt)}
                            </div>
                            <div className="requestHeaderExpireAt">
                                <span className="field-label">expires</span>
                                {' '}
                                {formatters.niceElapsed(request.expireAt)}

                            </div>
                        </div>
                    </div>
                    <div className="requestBody">
                        <div className="requestType">{this.renderRequestSentType(request)}</div>
                        <div className="requestSubject">{this.renderRequestSentSubject(request)}</div>
                        <OrganizationCompact organizationId={request.organizationId} />
                    </div>
                </div>
            )
        })
    }

    renderPendingAdminRequests() {
        const requests = this.props.viewModel.pendingAdminRequests
        if (requests.length === 0) {
            return (
                <div className="message">
                    No pending organization requests
                </div>
            )
        }

        return requests.map((request) => {
            return (
                <div key={request.id} className="aRequest invitation">
                    <div className="requestHeader">
                        <div className="requestHeaderRow">
                            <div className="requestHeaderCreatedAt">
                                {/* <span className="field-label">created</span>
                            {' '} */}
                                {Intl.DateTimeFormat('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                }).format(request.createdAt)}
                            </div>
                            <div className="requestHeaderExpireAt">
                                <span className="field-label">expires</span>
                                {' '}
                                {formatters.niceElapsed(request.expireAt)}

                            </div>
                        </div>
                    </div>
                    <div className="requestBody">
                        <div className="requestType">{this.renderRequestReceivedType(request)}</div>
                        <div className="requestSubject">{this.renderRequestReceivedSubject(request)}</div>
                        <OrganizationCompact organizationId={request.organizationId} />
                        <div>from</div>
                        <div className="requester">{this.renderRequestRequester(request)}</div>
                    </div>
                </div>
            )
        })
    }

    renderPendingRequestsReceived() {
        const requests = this.props.viewModel.pendingInvitations
        if (requests.length === 0) {
            return (
                <div className="message">
                    No pending invitations
                </div>
            )
        }
        return this.props.viewModel.pendingInvitations.map((request) => {
            return (
                <div key={request.id} className="aRequest invitation">
                    <div className="requestHeader">
                        <div className="requestHeaderRow">
                            <div className="requestHeaderCreatedAt">
                                {/* <span className="field-label">created</span>
                            {' '} */}
                                {Intl.DateTimeFormat('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                }).format(request.createdAt)}
                            </div>
                            <div className="requestHeaderExpireAt">
                                <span className="field-label">expires</span>
                                {' '}
                                {formatters.niceElapsed(request.expireAt)}

                            </div>
                        </div>
                    </div>
                    <div className="requestBody">
                        <div className="requestType">{this.renderRequestReceivedType(request)}</div>
                        <div className="requestSubject">{this.renderRequestReceivedSubject(request)}</div>
                        <OrganizationCompact organizationId={request.organizationId} />
                    </div>
                </div>
            )
        })
    }

    render() {

        switch (this.state.navigateTo) {
            case NavigateTo.BROWSER:
                return (
                    <Redirect to="/organizations" />
                )
            case NavigateTo.NEW_ORG:
                return (
                    <Redirect to="/newOrganization" />
                )
        }

        return (
            <div className="Dashboard scrollable-flex-column">
                {this.renderHeader()}
                <div className="body scrollable-flex-column">
                    <div className="col1">
                        {this.renderOrganizationsCard()}
                    </div>
                    <div className="col2">

                        {this.renderNotificationsCard()}

                        {this.renderPendingRequestsSentCard()}

                        {this.renderPendingRequestsReceivedCard()}

                        {this.renderPendingAdminTasksCard()}

                    </div>
                </div>

            </div>
        )
    }
}

export default Dashboard