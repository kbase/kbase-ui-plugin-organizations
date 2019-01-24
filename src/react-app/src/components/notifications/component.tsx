import * as React from 'react'
import * as feedsModel from '../../data/models/feeds'
import './component.css'
import UserInline from './UserInlineContainer';
import OrganizationInline from './OrganizationInlineContainer';
import { Button } from 'antd';
import NarrativeInline from '../entities/narrativeInline/reduxAdapter';
import { niceElapsed } from '../../lib/time';

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
            <div className="notification" key={notification.id}>
                <div className="mainCol">
                    <div>
                        You have been invited to join <OrganizationInline organizationId={notification.organizationId} />
                    </div>
                </div>
            </div>
        )
    }

    renderUserAcceptedNotification(notification: feedsModel.OrganizationNotification) {
        let orgInfo
        if (this.props.showOrg) {
            orgInfo = (
                <OrganizationInline organizationId={notification.organizationId} />
            )
        } else {
            orgInfo = (
                <span>
                    this organization
                </span>
            )
        }
        return (
            <div className="notification" key={notification.id}>
                <div className="mainCol">
                    <div>
                        Your membership request has been accepted for {orgInfo}
                    </div>
                </div>
            </div>
        )
    }

    renderRequestToJoinToOrg(notification: feedsModel.OrganizationNotification) {
        let orgInfo
        if (this.props.showOrg) {
            orgInfo = (
                <span>
                    {' '}<OrganizationInline organizationId={notification.organizationId} />{' '}
                </span>
            )
        }
        return (
            <div className="notification" key={notification.id}>
                <div className="mainCol">
                    <div>
                        Request to join your organization
                        {orgInfo}
                        {' '}
                        from
                        {' '}<UserInline userId={notification.from} avatarSize={20} />
                    </div>
                </div>
            </div>
        )
    }

    renderNarrativeAssociationRequest(notification: feedsModel.OrganizationNotification) {
        const workspaceId = parseInt(notification.regarding[0].id, 10)
        let orgInfo
        if (this.props.showOrg) {
            orgInfo = (
                <span>{' '}with organization{' '}<OrganizationInline organizationId={notification.organizationId} />{' '}</span>
            )
        }
        return (
            <div className="notification" key={notification.id}>
                <div className="mainCol">
                    <div>
                        Request to associate Narrative
                        {' '}
                        <NarrativeInline workspaceId={workspaceId} />
                        {orgInfo}
                        {' '}
                        from
                        {' '}
                        <UserInline userId={notification.from} avatarSize={20} />
                    </div>
                </div>
            </div>
        )
    }

    renderNarrativeAssociated(notification: feedsModel.OrganizationNotification) {
        const workspaceId = parseInt(notification.regarding[0].id, 10)
        let orgInfo
        if (this.props.showOrg) {
            orgInfo = (
                <span>{' '}with organization{' '}<OrganizationInline organizationId={notification.organizationId} />{' '}</span>
            )
        }
        return (
            <div className="notification" key={notification.id}>
                <div className="mainCol">
                    <div>
                        New Narrative
                        {' '}
                        <NarrativeInline workspaceId={workspaceId} />
                        {' '}
                        associated
                        {orgInfo}
                    </div>
                </div>
            </div>
        )
    }

    renderNarrativeAccepted(notification: feedsModel.OrganizationNotification) {
        const workspaceId = parseInt(notification.regarding[0].id, 10)
        let orgInfo
        if (this.props.showOrg) {
            orgInfo = (
                <span>{' '}into organization{' '}<OrganizationInline organizationId={notification.organizationId} /></span>
            )
        }
        return (
            <div className="notification" key={notification.id}>
                <div className="mainCol">
                    <div>
                        Your Narrative
                        {' '}<NarrativeInline workspaceId={workspaceId} />{' '}
                        was accepted{orgInfo}
                    </div>
                </div>
            </div>
        )
    }

    renderNotificationHeader(notification: feedsModel.OrganizationNotification) {
        return (
            <div className="Notifications-notificationHeader">
                <div className="Notifications-notificationHeaderDate">
                    {Intl.DateTimeFormat('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    }).format(notification.createdAt)}
                </div>
                <div className="Notifications-notificationHeaderTimeAgo">
                    {niceElapsed(notification.createdAt)}
                </div>
                <div className="Notifications-notificationHeaderReadButton">
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
            return (
                <div className="kbCard" key={notification.id}>
                    <div className="kbCard-header">
                        {this.renderNotificationHeader(notification)}
                    </div>
                    <div className="kbCard-body">
                        {this.renderNotification(notification)}
                    </div>
                </div>
            )
        })
    }

    renderHeader() {
        return (
            <span>
                You have
                {' '}
                {this.props.notifications.length}
                {' '}
                unread notification
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
                <div className="Notifications-header">
                    {this.renderHeader()}
                </div>
                <div className="Notifications-body scrollable-flex-column">
                    <div className="Notifications-innerBody">
                        {this.renderNotifications()}
                    </div>
                </div>
            </React.Fragment>
        )
    }

    render() {
        return (
            <div className="Notifications scrollable-flex-column">
                {this.renderMain()}
            </div>
        )
    }
}

export default Notifications