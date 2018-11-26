import { Action } from 'redux'
import * as actions from '../actions/manageOrganizationRequests'
import * as types from '../../types'
import { ActionFlag } from '../actions'

export function manageOrganizationRequestsStart(
    state: types.StoreState,
    action: actions.ManageOrganizationRequestsStart): types.StoreState {
    return state
}

export function manageOrganizationRequestsSuccess(
    state: types.StoreState,
    action: actions.ManageOrganizationRequestsSuccess): types.StoreState {
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

export function manageOrganizationRequestsError(
    state: types.StoreState,
    action: actions.ManageOrganizationRequestsError): types.StoreState {
    return {
        ...state,
        manageOrganizationRequestsView: {
            viewState: null,
            state: types.ComponentLoadingState.ERROR,
            error: action.error
        }
    }
}


function reducer(state: types.StoreState, action: Action): types.StoreState | null {
    switch (action.type) {
        case ActionFlag.ADMIN_MANAGE_REQUESTS_START:
            return manageOrganizationRequestsStart(state, action as actions.ManageOrganizationRequestsStart)
        case ActionFlag.ADMIN_MANAGE_REQUESTS_SUCCESS:
            return manageOrganizationRequestsSuccess(state, action as actions.ManageOrganizationRequestsSuccess)
        case ActionFlag.ADMIN_MANAGE_REQUESTS_ERROR:
            return manageOrganizationRequestsError(state, action as actions.ManageOrganizationRequestsError)
        default:
            return null
    }
}

export default reducer