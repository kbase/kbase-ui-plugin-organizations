import * as React from 'react'
import * as feedsModel from '../../data/models/feeds'

export interface NotificationsProps {
    notifications: Array<feedsModel.Notification>
}

interface NotificationsState {

}

export class Notifications extends React.Component<NotificationsProps, NotificationsState> {
    constructor(props: NotificationsProps) {
        super(props)
    }

    renderNotification(notification: feedsModel.Notification) {
        return (
            <div className="notification">
                <div>
                    {notification.actor}
                </div>
                <div>
                    {notification.verb}
                </div>
                <div>
                    {notification.source}
                </div>
            </div>
        )
    }

    renderNotifications() {
        if (this.props.notifications.length === 0) {
            return (
                <div className="message">
                    No unread notifications
                </div>
            )
        }
        return this.props.notifications.map((notification) => {
            return this.renderNotification(notification)
        })
    }

    render() {
        return (
            <div className="Notifications">
                {this.renderNotifications()}
            </div>
        )
    }
}

export default Notifications