import { Action } from 'redux'
import * as actions from '../actions/manageOrganizationRequests'
import { StoreState, ComponentLoadingState } from '../../types'
import { ActionFlag } from '../actions'

export function loadStart(
    state: StoreState,
    action: actions.LoadStart): StoreState {
    return state
}

export function loadSuccess(
    state: StoreState,
    action: actions.LoadSuccess): StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            manageOrganizationRequestsView: {
                loadingState: ComponentLoadingState.SUCCESS,
                error: null,
                viewModel: {
                    organization: action.organization,
                    requests: action.requests,
                    invitations: action.invitations
                },
            }
        }
    }
}

export function loadError(
    state: StoreState,
    action: actions.LoadError): StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            manageOrganizationRequestsView: {
                loadingState: ComponentLoadingState.ERROR,
                error: action.error,
                viewModel: null
            }
        }

    }
}

export function unload(state: StoreState, action: actions.Unload): StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            manageOrganizationRequestsView: {
                loadingState: ComponentLoadingState.NONE,
                error: null,
                viewModel: null
            }
        }
    }
}

export function getViewAccessSuccess(state: StoreState, action: actions.GetViewAccessSuccess): StoreState {
    // Note: we use the state object rather than peeling off the viewModel because
    // TS can't trace the assertion (not falsy) of the variable back to the object 
    // property it was taken from.
    if (!state.views.manageOrganizationRequestsView.viewModel) {
        return state
    }
    const requests = state.views.manageOrganizationRequestsView.viewModel.requests
    const newRequests = requests.map((request) => {
        if (request.id = action.request.id) {
            return action.request
        }
        return request
    })

    return {
        ...state,
        views: {
            ...state.views,
            manageOrganizationRequestsView: {
                ...state.views.manageOrganizationRequestsView,
                viewModel: {
                    // TODO: below, 
                    ...state.views.manageOrganizationRequestsView.viewModel,
                    requests: newRequests
                }
            }
        }
    }
}


function reducer(state: StoreState, action: Action): StoreState | null {
    switch (action.type) {
        case ActionFlag.ADMIN_MANAGE_REQUESTS_LOAD_START:
            return loadStart(state, action as actions.LoadStart)
        case ActionFlag.ADMIN_MANAGE_REQUESTS_LOAD_SUCCESS:
            return loadSuccess(state, action as actions.LoadSuccess)
        case ActionFlag.ADMIN_MANAGE_REQUESTS_LOAD_ERROR:
            return loadError(state, action as actions.LoadError)
        case ActionFlag.ADMIN_MANAGE_REQUESTS_UNLOAD:
            return unload(state, action as actions.Unload)
        case ActionFlag.ADMIN_MANAGE_REQUESTS_GET_VIEW_ACCESS_SUCCESS:
            return getViewAccessSuccess(state, action as actions.GetViewAccessSuccess)
        default:
            return null
    }
}

export default reducer