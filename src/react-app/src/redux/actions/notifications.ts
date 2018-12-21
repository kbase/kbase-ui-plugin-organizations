import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { ActionFlag } from './index'
import { AppError, StoreState } from '../../types'
import * as feedsModel from '../../data/models/feeds';
import { ActionButtonState } from 'antd/lib/modal/ActionButton';

export interface Load extends Action<ActionFlag.NOTIFICATIONS_LOAD> {
    type: ActionFlag.NOTIFICATIONS_LOAD
}

export interface LoadStart extends Action<ActionFlag.NOTIFICATIONS_LOAD_START> {
    type: ActionFlag.NOTIFICATIONS_LOAD_START
}

export interface LoadSuccess extends Action<ActionFlag.NOTIFICATIONS_LOAD_SUCCESS> {
    type: ActionFlag.NOTIFICATIONS_LOAD_SUCCESS,
    notifications: Array<feedsModel.OrganizationNotification>
}

export interface LoadError extends Action<ActionFlag.NOTIFICATIONS_LOAD_ERROR> {
    type: ActionFlag.NOTIFICATIONS_LOAD_ERROR,
    error: AppError
}

export interface Unload extends Action<ActionFlag.NOTIFICATIONS_UNLOAD> {
    type: ActionFlag.NOTIFICATIONS_UNLOAD
}

export interface Read extends Action<ActionFlag.NOTIFICATIONS_READ> {
    type: ActionFlag.NOTIFICATIONS_READ,
    notificationId: feedsModel.NotificationID
}

export interface ReadStart extends Action<ActionFlag.NOTIFICATIONS_READ_START> {
    type: ActionFlag.NOTIFICATIONS_READ_START
}

export interface ReadSuccess extends Action<ActionFlag.NOTIFICATIONS_READ_SUCCESS> {
    type: ActionFlag.NOTIFICATIONS_READ_SUCCESS,
    notificationId: feedsModel.NotificationID
}

export interface ReadError extends Action<ActionFlag.NOTIFICATIONS_READ_ERROR> {
    type: ActionFlag.NOTIFICATIONS_READ_ERROR,
    error: AppError
}

export function loadStart(): LoadStart {
    return {
        type: ActionFlag.NOTIFICATIONS_LOAD_START
    }
}

export function loadSuccess(notifications: Array<feedsModel.OrganizationNotification>): LoadSuccess {
    return {
        type: ActionFlag.NOTIFICATIONS_LOAD_SUCCESS,
        notifications: notifications
    }
}

export function loadError(error: AppError): LoadError {
    return {
        type: ActionFlag.NOTIFICATIONS_LOAD_ERROR,
        error: error
    }
}

export function unload(): Unload {
    return {
        type: ActionFlag.NOTIFICATIONS_UNLOAD
    }
}

export function load() {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(loadStart())

        const {
            auth: { authorization: { token, username } },
            app: { config } } = getState()

        const feedsClient = new feedsModel.FeedsClient({
            token, username,
            feedsServiceURL: config.services.Feeds.url
        })

        try {
            const notifications = await feedsClient.getOrganizationNotifications()
            // const groupNotifications = notifications.filter((notification) => {
            //     return (notification.source === 'groupsservice')
            // })
            // console.log('loading notifications', notifications)
            dispatch(loadSuccess(notifications))
        } catch (ex) {
            console.error('error', ex)
            dispatch(loadError({
                code: ex.name,
                message: ex.message
            }))
        }
    }
}

export function read(notificationId: feedsModel.NotificationID) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch({
            type: ActionFlag.NOTIFICATIONS_READ_START
        } as ReadStart)

        const {
            auth: { authorization: { token, username } },
            app: { config } } = getState()

        const feedsClient = new feedsModel.FeedsClient({
            token, username,
            feedsServiceURL: config.services.Feeds.url
        })

        try {
            const notifications = await feedsClient.seeNotification(notificationId)
            // const groupNotifications = notifications.filter((notification) => {
            //     return (notification.source === 'groupsservice')
            // })
            // console.log('loading notifications', notifications)
            dispatch({
                type: ActionFlag.NOTIFICATIONS_READ_SUCCESS,
                notificationId: notificationId
            } as ReadSuccess)
        } catch (ex) {
            console.error('error', ex)
            dispatch({
                type: ActionFlag.NOTIFICATIONS_READ_ERROR,
                error: {
                    code: ex.name,
                    message: ex.message
                }
            } as ReadError)
        }
    }
}

