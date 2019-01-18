import * as React from 'react'
import * as feedsModel from '../../data/models/feeds'
import './component.css'
import User from '../entities/UserContainer';
import OrganizationCompactContainer from '../views/dashboard/OrganizationCompactContainer';
import { Button } from 'antd';
import Narrative from '../entities/NarrativeContainer';

export interface NotificationsProps {
    notifications: Array<feedsModel.OrganizationNotification>
    showOrg: boolean
    onRead: (notificationId: string) => void
}

interface NotificationsState {

}

export class Notifications extends React.Component<NotificationsProps, NotificationsState> {
    constructor(props: NotificationsProps) {
        super(props)
    }

    onReadNotification(notification: feedsModel.OrganizationNotification) {
        this.props.onRead(notification.id)
    }

    renderInvitationToOrg(notification: feedsModel.OrganizationNotification) {
        return (
            <div className="notification simpleCard" key={notification.id}>
                <div className="mainCol">
                    <div>
                        You have been invited to Join
                    </div>
                    <div>
                        <OrganizationCompactContainer organizationId={notification.organizationId} />
                    </div>
                    <div>
                        <span className="field-label">by</span>
                    </div>
                    <div>

                        {/* <User userId={notification.from} avatarSize={30} /> */}
                    </div>

                </div>
                <div className="actionCol">
                    <Button type="danger" icon="cross" size="small" onClick={() => { this.onReadNotification.call(this, notification) }} />
                </div>

            </div>
        )
    }

    renderUserAcceptedNotification(notification: feedsModel.OrganizationNotification) {
        let orgInfo
        if (this.props.showOrg) {
            orgInfo = (
                <div>
                    <OrganizationCompactContainer organizationId={notification.organizationId} />
                </div>
            )
        } else {
            orgInfo = (
                <span>
                    this organization
                </span>
            )
        }
        return (
            <div className="notification simpleCard" key={notification.id}>
                <div className="mainCol">
                    <div>
                        Your membership request has been accepted for
                    </div>
                    {orgInfo}

                </div>
                <div className="actionCol">
                    <Button type="danger" icon="cross" size="small" onClick={() => { this.onReadNotification.call(this, notification) }} />
                </div>

            </div>
        )
    }

    renderRequestToJoinToOrg(notification: feedsModel.OrganizationNotification) {
        let orgInfo
        if (this.props.showOrg) {
            orgInfo = (
                <div>
                    <OrganizationCompactContainer organizationId={notification.organizationId} />
                </div>
            )
        }
        return (
            <div className="notification simpleCard" key={notification.id}>
                <div className="mainCol">
                    <div>
                        Request to join organization
                    </div>
                    {orgInfo}
                    <div>
                        <span className="field-label">from</span>
                    </div>
                    <div>
                        <User userId={notification.from} avatarSize={30} />
                    </div>

                </div>
                <div className="actionCol">
                    <Button type="danger" icon="cross" size="small" onClick={() => { this.onReadNotification.call(this, notification) }} />
                </div>

            </div>
        )
    }

    renderNarrativeAssociationRequest(notification: feedsModel.OrganizationNotification) {
        const workspaceId = parseInt(notification.regarding[0].id, 10)
        let orgInfo
        if (this.props.showOrg) {
            orgInfo = (
                <React.Fragment>
                    <div>
                        <span className="field-label">with organization</span>
                    </div>
                    <div>
                        <OrganizationCompactContainer organizationId={notification.organizationId} />
                    </div>
                </React.Fragment>
            )
        }
        return (
            <div className="notification simpleCard" key={notification.id}>
                <div className="mainCol">
                    <div>
                        Request to associate Narrative
                    </div>
                    <div>
                        <Narrative workspaceId={workspaceId} />
                    </div>

                    {orgInfo}

                    <div>
                        <span className="field-label">from</span>
                    </div>
                    <div>
                        <User userId={notification.from} avatarSize={30} />
                    </div>

                </div>
                <div className="actionCol">
                    <Button type="danger" icon="cross" size="small" onClick={() => { this.onReadNotification.call(this, notification) }} />
                </div>

            </div>
        )
    }

    renderNarrativeAssociated(notification: feedsModel.OrganizationNotification) {
        const workspaceId = parseInt(notification.regarding[0].id, 10)
        let orgInfo
        if (this.props.showOrg) {
            orgInfo = (
                <React.Fragment>
                    <div>
                        <span className="field-label">with organization</span>
                    </div>
                    <div>
                        <OrganizationCompactContainer organizationId={notification.organizationId} />
                    </div>
                </React.Fragment>
            )
        }
        return (
            <div className="notification simpleCard" key={notification.id}>
                <div className="mainCol">
                    <div>
                        New Narrative associated
                    </div>
                    <div>
                        <Narrative workspaceId={workspaceId} />
                    </div>

                    {orgInfo}
                </div>
                <div className="actionCol">
                    <Button type="danger" icon="cross" size="small" onClick={() => { this.onReadNotification.call(this, notification) }} />
                </div>

            </div>
        )
    }

    renderNarrativeAccepted(notification: feedsModel.OrganizationNotification) {
        const workspaceId = parseInt(notification.regarding[0].id, 10)
        let orgInfo
        if (this.props.showOrg) {
            orgInfo = (
                <React.Fragment>
                    <div>
                        <span className="field-label">into organization</span>
                    </div>
                    <div>
                        <OrganizationCompactContainer organizationId={notification.organizationId} />
                    </div>
                </React.Fragment>
            )
        }
        return (
            <div className="notification simpleCard" key={notification.id}>
                <div className="mainCol">
                    <div>
                        Your Narrative
                    </div>
                    <div>
                        <Narrative workspaceId={workspaceId} />
                    </div>
                    <div>
                        was accepted
                    </div>
                    {orgInfo}
                </div>
                <div className="actionCol">
                    <Button type="danger" icon="cross" size="small" onClick={() => { this.onReadNotification.call(this, notification) }} />
                </div>

            </div>
        )
    }

    renderNotification(notification: feedsModel.OrganizationNotification) {
        switch (notification.type) {
            case (feedsModel.OrganizationNotificationType.JOIN_INVITATION):
                return this.renderInvitationToOrg(notification)
            case (feedsModel.OrganizationNotificationType.JOIN_REQUEST):
                return this.renderRequestToJoinToOrg(notification)
            case (feedsModel.OrganizationNotificationType.UNKNOWN):
                return 'UNKNOWN'
            case (feedsModel.OrganizationNotificationType.NARRATIVE_ASSOCIATION_REQUEST):
                return this.renderNarrativeAssociationRequest(notification)
            case (feedsModel.OrganizationNotificationType.NARRATIVE_ASSOCIATED):
                return this.renderNarrativeAssociated(notification)
            case (feedsModel.OrganizationNotificationType.NARRATIVE_ACCEPTED):
                return this.renderNarrativeAccepted(notification)
            case (feedsModel.OrganizationNotificationType.APP_ASSOCIATION_REQUEST):
                return 'Request to associate App'
            case (feedsModel.OrganizationNotificationType.USER_ACCEPTED):
                return this.renderUserAcceptedNotification(notification)
            default:
                return 'UNKNOWN NOTIFICATION TYPE'
        }
    }

    renderNotifications() {
        return this.props.notifications.map((notification) => {
            return this.renderNotification(notification)
        })
    }

    renderHeader() {
        return (
            <span>
                You have
                {' '}
                {this.props.notifications.length}
                {' '}
                unread organization notification
                {this.props.notifications.length === 1 ? '' : 's'}
            </span>
        )
    }

    renderMain() {
        if (this.props.notifications.length === 0) {
            return (
                <div className="message">
                    No unread notifications
                </div>
            )
        }
        return (
            <React.Fragment>
                <div className="Notifications-Header">
                    {this.renderHeader()}
                </div>
                <div className="Notifications-Body">
                    {this.renderNotifications()}
                </div>
            </React.Fragment>
        )
    }

    render() {
        return (
            <div className="Notifications">
                {this.renderMain()}
            </div>
        )
    }
}

export default Notifications