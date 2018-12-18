import { Action } from 'redux'

import { ActionFlag } from '../actions'

import { LoadStart, LoadSuccess, LoadError, DashboardAction, Unload, CancelOutboxRequest, CancelOutboxRequestSuccess, AcceptInboxRequestSuccess, RejectInboxRequestSuccess } from '../actions/dashboard'
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
                    requestInbox: action.requestInbox,
                    requestOutbox: action.requestOutbox,
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

function cancelOutboxRequest(state: StoreState, action: CancelOutboxRequestSuccess): StoreState {
    if (!state.views.dashboardView.viewModel) {
        throw new Error('view model mysteriously missing in dashboard')
    }
    return {
        ...state,
        views: {
            ...state.views,
            dashboardView: {
                ...state.views.dashboardView,
                viewModel: {
                    ...state.views.dashboardView.viewModel,
                    // TODO: rename to requestOutbox, requestInbox
                    requestOutbox: action.requests
                }
            }
        }
    }
}

function acceptInboxRequest(state: StoreState, action: AcceptInboxRequestSuccess): StoreState {
    if (!state.views.dashboardView.viewModel) {
        throw new Error('view model mysteriously missing in dashboard')
    }
    return {
        ...state,
        views: {
            ...state.views,
            dashboardView: {
                ...state.views.dashboardView,
                viewModel: {
                    ...state.views.dashboardView.viewModel,
                    // TODO: rename to requestOutbox, requestInbox
                    requestInbox: action.requests,
                    organizations: action.organizations
                }
            }
        }
    }
}

function rejectInboxRequest(state: StoreState, action: RejectInboxRequestSuccess): StoreState {
    if (!state.views.dashboardView.viewModel) {
        throw new Error('view model mysteriously missing in dashboard')
    }
    return {
        ...state,
        views: {
            ...state.views,
            dashboardView: {
                ...state.views.dashboardView,
                viewModel: {
                    ...state.views.dashboardView.viewModel,
                    // TODO: rename to requestOutbox, requestInbox
                    requestInbox: action.requests
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
        case ActionFlag.DASHBOARD_ACCEPT_INBOX_REQUEST_SUCCESS:
            return acceptInboxRequest(state, action as AcceptInboxRequestSuccess)
        case ActionFlag.DASHBOARD_REJECT_INBOX_REQUEST_SUCCESS:
            return rejectInboxRequest(state, action as RejectInboxRequestSuccess)
        default:
            return null
    }
}