import { Action } from 'redux'
import * as actions from '../actions/manageOrganizationRequests'
import * as types from '../../types'
import { ActionFlag } from '../actions'

export function loadStart(
    state: types.StoreState,
    action: actions.LoadStart): types.StoreState {
    return state
}

export function loadSuccess(
    state: types.StoreState,
    action: actions.LoadSuccess): types.StoreState {
    return {
        ...state,
        manageOrganizationRequestsView: {
            viewState: {
                organization: action.organization,
                requests: action.requests,
            },
            // TODO: wtf
            state: types.ComponentLoadingState.SUCCESS,
            error: null
        }
    }
}

export function loadError(
    state: types.StoreState,
    action: actions.LoadError): types.StoreState {
    return {
        ...state,
        manageOrganizationRequestsView: {
            viewState: null,
            state: types.ComponentLoadingState.ERROR,
            error: action.error
        }
    }
}

export function unload(state: types.StoreState, action: actions.Unload): types.StoreState {
    return {
        ...state,
        manageOrganizationRequestsView: {
            state: types.ComponentLoadingState.NONE,
            viewState: null,
            error: null
        }
    }
}


function reducer(state: types.StoreState, action: Action): types.StoreState | null {
    switch (action.type) {
        case ActionFlag.ADMIN_MANAGE_REQUESTS_LOAD_START:
            return loadStart(state, action as actions.LoadStart)
        case ActionFlag.ADMIN_MANAGE_REQUESTS_LOAD_SUCCESS:
            return loadSuccess(state, action as actions.LoadSuccess)
        case ActionFlag.ADMIN_MANAGE_REQUESTS_LOAD_ERROR:
            return loadError(state, action as actions.LoadError)
        case ActionFlag.ADMIN_MANAGE_REQUESTS_UNLOAD:
            return unload(state, action as actions.Unload)
        default:
            return null
    }
}

export default reducer