import * as feedsApi from '../apis/feeds'
import { string } from 'prop-types';

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

export interface FeedsClientParams {
    token: string
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
        const notifications = await this.feedsClient.getNotifications()

        return notifications.user.map((notification) => {
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
}