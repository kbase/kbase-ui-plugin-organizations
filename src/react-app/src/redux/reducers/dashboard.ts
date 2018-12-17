import { Action } from 'redux'

import { ActionFlag } from '../actions'

import { LoadStart, LoadSuccess, LoadError, DashboardAction, Unload, CancelOutboxRequest, CancelOutboxRequestSuccess } from '../actions/dashboard'
import { StoreState, ComponentLoadingState } from '../../types';

function loadStart(state: StoreState, action: LoadStart): StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            dashboardView: {
                loadingState: ComponentLoadingState.LOADING,
                error: null,
                viewModel: null
            }
        }
    }
}

function loadSuccess(state: StoreState, action: LoadSuccess): StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            dashboardView: {
                loadingState: ComponentLoadingState.SUCCESS,
                error: null,
                viewModel: {
                    organizations: action.organizations,
                    // users: action.users,
                    notifications: [],
                    pendingRequests: action.requests,
                    pendingInvitations: action.invitations,
                    pendingAdminRequests: action.pendingGroupRequests
                }
            }
        }
    }
}

function loadError(state: StoreState, action: LoadError): StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            dashboardView: {
                loadingState: ComponentLoadingState.ERROR,
                error: action.error,
                viewModel: null
            }
        }
    }
}

function unload(state: StoreState, action: Unload): StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            dashboardView: {
                loadingState: ComponentLoadingState.NONE,
                error: null,
                viewModel: null
            }
        }
    }
}

function cancelOutboxRequest(state: StoreState, action: CancelOutboxRequestSuccess) {
    return {
        ...state,
        view: {
            ...state.views,
            dashboardView: {
                ...state.views.dashboardView,
                viewModel: {
                    ...state.views.dashboardView.viewModel,
                    pendingRequests: action.requests
                }
            }
        }
    }
}

export default function reducer(state: StoreState, action: DashboardAction<any>): StoreState | null {
    switch (action.type) {
        case ActionFlag.DASHBOARD_LOAD_START:
            return loadStart(state, action as LoadStart)
        case ActionFlag.DASHBOARD_LOAD_SUCCESS:
            return loadSuccess(state, action as LoadSuccess)
        case ActionFlag.DASHBOARD_LOAD_ERROR:
            return loadError(state, action as LoadError)
        case ActionFlag.DASHBOARD_UNLOAD:
            return unload(state, action as Unload)
        case ActionFlag.DASHBOARD_CANCEL_OUTBOX_REQUEST_SUCCESS:
            return cancelOutboxRequest(state, action as CancelOutboxRequestSuccess)
        default:
            return null
    }
}