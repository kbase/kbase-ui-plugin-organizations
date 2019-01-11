import * as React from 'react'
import * as feedsModel from '../../data/models/feeds'
import './component.css'
import User from '../entities/UserContainer';
import OrganizationCompactContainer from '../views/dashboard/OrganizationCompactContainer';
import { Button } from 'antd';
import Narrative from '../entities/NarrativeContainer';

export interface NotificationsProps {
    notifications: Array<feedsModel.OrganizationNotification>
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

    renderType(type: feedsModel.OrganizationNotificationType) {
        switch (type) {
            case (feedsModel.OrganizationNotificationType.JOIN_INVITATION):
                return 'You have been invited to Join'
            case (feedsModel.OrganizationNotificationType.JOIN_REQUEST):
                return 'Request to Join'
            case (feedsModel.OrganizationNotificationType.UNKNOWN):
                return 'UNKNOWN'
            case (feedsModel.OrganizationNotificationType.NARRATIVE_ASSOCIATION_REQUEST):
                return 'Request to associate Narrative'
            case (feedsModel.OrganizationNotificationType.APP_ASSOCIATION_REQUEST):
                return 'Request to associate App'
            default:
                return 'UNKNOWN NOTIFICATION TYPE'
        }
    }
    renderInvitationToOrg(notification: feedsModel.OrganizationNotification) {
        return (
            <div className="notification" key={notification.id}>
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
                        <User userId={notification.from} avatarSize={30} />
                    </div>

                </div>
                <div className="actionCol">
                    <Button type="danger" icon="cross" size="small" onClick={() => { this.onReadNotification.call(this, notification) }} />
                </div>

            </div>
        )
    }

    renderRequestToJoinToOrg(notification: feedsModel.OrganizationNotification) {
        return (
            <div className="notification" key={notification.id}>
                <div className="mainCol">
                    <div>
                        Request to Join
                    </div>
                    <div>
                        <OrganizationCompactContainer organizationId={notification.organizationId} />
                    </div>
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
        const workspaceId = parseInt(notification.regarding[0], 10)
        return (
            <div className="notification" key={notification.id}>
                <div className="mainCol">
                    <div>
                        Request to associate Narrative
                    </div>
                    <div>
                        <Narrative workspaceId={workspaceId} />
                    </div>
                    <div>
                        <span className="field-label">with</span>
                    </div>
                    <div>
                        <OrganizationCompactContainer organizationId={notification.organizationId} />
                    </div>
                    <div>
                        <span className="field-label">by</span>
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
            case (feedsModel.OrganizationNotificationType.APP_ASSOCIATION_REQUEST):
                return 'Request to associate App'
            default:
                return 'UNKNOWN NOTIFICATION TYPE'
        }
    }

    renderNotificationx(notification: feedsModel.OrganizationNotification) {
        return (
            <div className="notification" key={notification.id}>
                <div className="mainCol">
                    <div>
                        {this.renderType(notification.type)}
                    </div>
                    <div>
                        <User userId={notification.from} avatarSize={30} />
                    </div>
                    <div>
                        <OrganizationCompactContainer organizationId={notification.organizationId} />
                    </div>
                </div>
                <div className="actionCol">
                    <Button type="danger" icon="cross" size="small" onClick={() => { this.onReadNotification.call(this, notification) }} />
                </div>

            </div>
        )
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