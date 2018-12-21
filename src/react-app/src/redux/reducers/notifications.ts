import { Action } from 'redux'
import * as actions from '../actions/notifications'
import { StoreState } from '../../types'
import { ActionFlag } from '../actions'
import * as feedsModel from '../../data/models/feeds'

function loadSuccess(state: StoreState, action: actions.LoadSuccess): StoreState {
    const notificationsById = new Map<feedsModel.NotificationID, feedsModel.OrganizationNotification>()
    action.notifications.forEach((notification) => {
        notificationsById.set(notification.id, notification)
    })
    return {
        ...state,
        db: {
            ...state.db,
            notifications: {
                all: action.notifications,
                byId: notificationsById
            }
        }
    }
}

function unload(state: StoreState, action: actions.Unload): StoreState {
    return {
        ...state,
        db: {
            ...state.db,
            notifications: {
                all: [],
                byId: new Map()
            }
        }
    }
}

function readSuccess(state: StoreState, action: actions.ReadSuccess): StoreState {
    const {
        db: { notifications: { all, byId } }
    } = state
    const allNotifications = all.filter((notification) => {
        return (notification.id !== action.notificationId)
    })
    const notificationsById = new Map(byId)
    notificationsById.delete(action.notificationId)
    return {
        ...state,
        db: {
            ...state.db,
            notifications: {
                all: allNotifications,
                byId: notificationsById
            }
        }
    }
}

export default function reducer(state: StoreState, action: Action): StoreState | null {
    switch (action.type) {
        case ActionFlag.NOTIFICATIONS_LOAD_SUCCESS:
            return loadSuccess(state, action as actions.LoadSuccess)
        case ActionFlag.NOTIFICATIONS_UNLOAD:
            return unload(state, action as actions.Unload)
        case ActionFlag.NOTIFICATIONS_READ_SUCCESS:
            return readSuccess(state, action as actions.ReadSuccess)
        default:
            return null
    }
}