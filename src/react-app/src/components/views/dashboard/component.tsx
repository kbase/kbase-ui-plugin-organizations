import * as React from 'react'
import Header from '../../Header';
import { Icon, Card, Button, Alert, Modal } from 'antd';
import './component.css'
import { Redirect } from 'react-router-dom';
import { DashboardViewModel, ComponentLoadingState } from '../../../types';
import * as orgModel from '../../../data/models/organization/model'
import * as requestModel from '../../../data/models/requests'
import Organization from './Organization';
import User from '../../entities/UserContainer';
import Notifications from '../../notifications/storeAdapter'
import InboxRequest from './InboxRequestContainer'
import OutboxRequest from './OutboxRequestContainer'
import * as userModel from '../../../data/models/user'

enum NavigateTo {
    NONE = 0,
    BROWSER,
    NEW_ORG
}

export interface DashboardProps {
    viewModel: DashboardViewModel
    currentUser: userModel.Username
    onRefresh: () => void
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

    onRefresh() {
        this.props.onRefresh()
    }

    onShowInfo() {
        Modal.info({
            title: 'Dashboard',
            width: '50em',
            content: (
                <div>
                    <div className="helpTitle">Welcome to KBase Organizations!</div>
                    <p>
                        This is your Organizations Dashboard. It is your quick stop to see what
                        happening with all of your Organizations, or to get involved with new ones.
                    </p>
                    <div className="helpSectionTitle">Your Organizations</div>
                    <p>
                        ... to do ...
                    </p>

                    <div className="helpSectionTitle">Notifications</div>
                    <p>
                        All unready messages you have from any organization will visible in this section.
                        Each notification may be closed (read) by clicking the red "x" in the upper right
                        corner.
                    </p>
                    <p>
                        For access to all your notifications, and more control over them, visit your <a href="/#feeds">feeds</a>.
                    </p>
                    <div className="helpSectionTitle">Inbox</div>
                    <p>
                        ... to do ...
                    </p>
                    <div className="helpSectionTitle">Outbox</div>
                    <p>
                        ... to do ...
                    </p>
                    <div className="helpSectionTitle">Organization Inbox</div>
                    <p>
                        ... to do ...
                    </p>
                    <div className="helpSectionTitle">+ New</div>
                    <p>
                        ... to do ...
                    </p>
                    <div className="helpSectionTitle">Browse All</div>
                    <p>
                        ... to do ...
                    </p>
                    <div className="helpSectionTitle">Refresh</div>
                    <p>
                        ... to do ...
                    </p>

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

    renderRefreshButton() {
        switch (this.props.viewModel.refreshState) {
            case ComponentLoadingState.LOADING:
                return (
                    <Button key="refresh"><Icon type="sync" spin />{' '}Refreshing...</Button>
                )
            default:
                return (
                    <Button key="refresh" onClick={this.onRefresh.bind(this)}><Icon type="reload" />{' '}Refresh</Button>
                )
        }

    }

    renderOrganizationsCard() {
        const extra = (
            <div>
                <Button key="newOrgButton" onClick={this.onNavigateToNewOrg.bind(this)}><Icon type="plus" />{' '}New</Button>
                {' '}
                <Button key="browseButton" onClick={this.onNavigateToBrowser.bind(this)}>Browse All</Button>
                {' '}
                {this.renderRefreshButton()}
            </div>
        )
        return (
            <Card title="Your Organizations"
                headStyle={{ backgroundColor: 'gray', color: 'white' }}
                bodyStyle={{ minHeight: '0', flex: '1 1 0px', display: 'flex', flexDirection: 'column' }}
                className="slimCard yourOrgsCard scrollable-flex-column"
                extra={extra}>
                <div className="scrollable-flex-column" style={{ overflow: 'auto' }}>
                    {this.renderOrganizations()}
                </div>
            </Card>
        )
    }

    renderPendingNotifications() {
        return (
            <Notifications />
        )
    }

    renderNotificationsCard() {
        const count = 2
        const title = (
            <span>
                Notifications ({count})
            </span>
        )
        return (
            <Card title={title}
                headStyle={{ backgroundColor: 'gray', color: 'white' }}
                bodyStyle={{ maxHeight: '30em', display: 'flex', flexDirection: 'column' }}
                className="slimCard notificationsCard">
                {this.renderPendingNotifications()}
            </Card>
        )
    }
    renderRequestRequester(request: requestModel.Request) {
        return (
            <User userId={request.requester} avatarSize={30} />
        )
    }

    renderPendingRequestsSentCard() {
        return (
            <Card title="Outbox"
                headStyle={{ backgroundColor: 'gray', color: 'white' }}
                className="slimCard pendingRequestsCard">
                {this.renderPendingRequestsSent()}
            </Card>
        )
    }

    renderPendingRequestsReceivedCard() {
        return (
            <Card title="Inbox"
                headStyle={{ backgroundColor: 'gray', color: 'white' }}
                className="slimCard pendingInvitationsCard">
                {this.renderPendingRequestsReceived()}
            </Card>
        )
    }

    isAdmin() {
        return (this.props.viewModel.organizations.some(({ relation }) => {
            return (relation.type === orgModel.UserRelationToOrganization.OWNER ||
                relation.type === orgModel.UserRelationToOrganization.ADMIN)
        }))
    }

    renderPendingAdminTasksCard() {
        if (!this.isAdmin()) {
            return
        }
        return (
            <Card title="Organization Inbox"
                headStyle={{ backgroundColor: 'gray', color: 'white' }}
                className="slimCard pendingAdminTasksCard">
                {this.renderPendingAdminRequests()}
            </Card>
        )
    }



    renderPendingRequestsSent() {
        const requests = this.props.viewModel.requestOutbox
        if (requests.length === 0) {
            return (
                <div className="message">
                    No pending requests
                </div>
            )
        }
        return this.props.viewModel.requestOutbox.map((request, index) => {
            return (
                <div key={index}>
                    <OutboxRequest request={request} showOrg={true} />
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

        return requests.map((request, index) => {
            return (
                <React.Fragment key={index}>
                    <InboxRequest request={request} showOrg={true} />
                </React.Fragment>
            )
        })
    }

    renderPendingRequestsReceived() {
        const requests = this.props.viewModel.requestInbox
        if (requests.length === 0) {
            return (
                <div className="message">
                    No pending invitations
                </div>
            )
        }
        return this.props.viewModel.requestInbox.map((request) => {
            return (
                <React.Fragment key={request.id}>
                    <InboxRequest request={request} showOrg={true} />
                </React.Fragment>
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
                    <div className="col1 scrollable-flex-column">
                        {this.renderOrganizationsCard()}
                    </div>
                    <div className="col2 scrollable-flex-column">

                        {this.renderNotificationsCard()}

                        {this.renderPendingRequestsReceivedCard()}

                        {this.renderPendingRequestsSentCard()}

                        {this.renderPendingAdminTasksCard()}
                    </div>
                </div>

            </div>
        )
    }
}

export default Dashboard