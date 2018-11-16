import { Action } from 'redux'
import * as actions from '../actions/manageGroupRequests'
import * as types from '../../types'
import { ActionFlag } from '../actions'

export function manageGroupRequestsStart(
    state: types.StoreState,
    action: actions.ManageGroupRequestsStart): types.StoreState {
    return state
}

export function manageGroupRequestsSuccess(
    state: types.StoreState,
    action: actions.ManageGroupRequestsSuccess): types.StoreState {
    return {
        ...state,
        manageGroupRequestsView: {
            view: {
                organization: action.organization,
                requests: action.requests,
            },
            // TODO: wtf
            error: null
        }
    }
}

export function manageGroupRequestsError(
    state: types.StoreState,
    action: actions.ManageGroupRequestsError): types.StoreState {
    return {
        ...state,
        manageGroupRequestsView: {
            view: null,
            // TODO: wtf
            error: action.error
        }
    }
}


function reducer(state: types.StoreState, action: Action): types.StoreState | null {
    switch (action.type) {
        case ActionFlag.ADMIN_MANAGE_REQUESTS_START:
            return manageGroupRequestsStart(state, action as actions.ManageGroupRequestsStart)
        case ActionFlag.ADMIN_MANAGE_REQUESTS_SUCCESS:
            return manageGroupRequestsSuccess(state, action as actions.ManageGroupRequestsSuccess)
        case ActionFlag.ADMIN_MANAGE_REQUESTS_ERROR:
            return manageGroupRequestsError(state, action as actions.ManageGroupRequestsError)
        default:
            return null
    }
}

export default reducer