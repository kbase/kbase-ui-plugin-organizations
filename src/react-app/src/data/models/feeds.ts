import * as feedsApi from '../apis/feeds'
import * as userModel from './user'
import * as orgModel from './organization/model'
import * as requestModel from './requests'
import { acceptJoinRequest } from '../../redux/actions/manageOrganizationRequests';
import { sendRequest } from '../../redux/actions/requestAddNarrative';

export type NotificationID = string

export enum Level {
    ALERT = 0,
    ERROR,
    WARNING,
    REQUEST
}

export interface Context { }

export interface Notification {
    id: NotificationID
    actor: string
    verb: string
    object: string
    target: Array<string>
    source: string
    level: Level
    seen: boolean
    createdAt: Date
    expiresAt: Date
    externalKey?: string
    context?: Context
}

export enum OrganizationNotificationType {
    UNKNOWN = 0,
    JOIN_REQUEST,
    JOIN_INVITATION,
    NARRATIVE_ASSOCIATION_REQUEST,
    APP_ASSOCIATION_REQUEST,
    MESSAGE
}

export interface OrganizationNotification {
    id: NotificationID
    from: userModel.Username
    createdAt: Date
    expiresAt: Date
    level: Level
    organizationId: orgModel.OrganizationID
    type: OrganizationNotificationType
    read: boolean
    regarding: Array<string>
}

function convertLevel(level: string) {
    switch (level) {
        case 'alert':
            return Level.ALERT
        case 'error':
            return Level.ERROR
        case 'warning':
            return Level.WARNING
        case 'request':
            return Level.REQUEST
        default:
            throw new Error('Invalid level value: ' + level)
    }
}

function convertNotificationType(notification: feedsApi.Notification): OrganizationNotificationType {
    if (!(notification.context && notification.context.resourcetype)) {
        return OrganizationNotificationType.UNKNOWN
    }
    switch (notification.verb) {
        case 'requested':
            switch (notification.context.resourcetype) {
                case 'user':
                    return OrganizationNotificationType.JOIN_REQUEST
                case 'workspace':
                    return OrganizationNotificationType.NARRATIVE_ASSOCIATION_REQUEST
                case 'app':
                    return OrganizationNotificationType.APP_ASSOCIATION_REQUEST
            }
        case 'invited':
            switch (notification.context.resourcetype) {
                case 'user':
                    return OrganizationNotificationType.JOIN_INVITATION
            }
    }

    return OrganizationNotificationType.UNKNOWN
}

export interface FeedsClientParams {
    token: string
    username: string
    feedsServiceURL: string
}

export class FeedsClient {
    params: FeedsClientParams
    feedsClient: feedsApi.FeedsClient
    constructor(params: FeedsClientParams) {
        this.params = params
        this.feedsClient = new feedsApi.FeedsClient({
            token: this.params.token,
            url: this.params.feedsServiceURL
        })
    }

    async getNotifications(): Promise<Array<Notification>> {
        const notifications = await this.feedsClient.getNotifications({ count: 100 })

        return notifications.user.feed.map((notification) => {
            const { id, actor, verb, object, target, source, level, seen,
                created, expires, external_key, context } = notification
            return {
                id, actor, verb, object, target, source,
                level: convertLevel(level),
                seen,
                createdAt: new Date(created), expiresAt: new Date(expires),
                externalKey: external_key, context
            }
        })
    }

    async getOrganizationNotifications(): Promise<Array<OrganizationNotification>> {
        const notifications = await this.feedsClient.getNotifications({
            count: 100
        })

        // console.log('got notifications', notifications)

        // console.log('raw notifications...', notifications)

        return notifications.user.feed
            .filter(({ actor, source }) => {
                return (
                    source === 'groupsservice' &&
                    actor !== this.params.username
                )
            })
            .map((notification) => {
                return {
                    id: notification.id,
                    from: notification.actor,
                    createdAt: new Date(notification.created),
                    expiresAt: new Date(notification.expires),
                    level: convertLevel(notification.level),
                    read: notification.seen,
                    organizationId: notification.object,
                    type: convertNotificationType(notification),
                    regarding: notification.target
                }
            })
    }

    async seeNotification(notificationId: NotificationID): Promise<NotificationID> {
        const { seen_notes, unauthorized_notes } = await this.feedsClient.seeNotifications({ note_ids: [notificationId] })
        return seen_notes[0]

    }
}