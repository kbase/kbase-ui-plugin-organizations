import { ActionFlag } from '../actions'

import {
    LoadStart, LoadSuccess, LoadError, DashboardAction, Unload,
    CancelOutboxRequestSuccess, AcceptInboxRequestSuccess, RejectInboxRequestSuccess,
    RefreshStart, RefreshSuccess, RefreshError
} from '../actions/dashboard'
import { StoreState, ComponentLoadingState, DashboardView } from '../../types';

function loadStart(state: DashboardView, action: LoadStart): DashboardView {
    return {
        loadingState: ComponentLoadingState.LOADING,
        error: null,
        viewModel: null
    }
}

function loadSuccess(state: DashboardView, action: LoadSuccess): DashboardView {
    return {
        loadingState: ComponentLoadingState.SUCCESS,
        error: null,
        viewModel: {
            refreshState: ComponentLoadingState.NONE,
            organizations: action.organizations,
            // users: action.users,
            // notifications: [],
            requestInbox: action.requestInbox,
            requestOutbox: action.requestOutbox,
            pendingAdminRequests: action.pendingGroupRequests
        }
    }
}

function loadError(state: DashboardView, action: LoadError): DashboardView {
    return {
        ...state,
        loadingState: ComponentLoadingState.ERROR,
        error: action.error,
        viewModel: null
    }
}

function refreshStart(state: DashboardView, action: RefreshStart): DashboardView {
    if (!state.viewModel) {
        return state
    }
    return {
        ...state,
        viewModel: {
            ...state.viewModel,
            refreshState: ComponentLoadingState.LOADING
        }

    }
}

function refreshSuccess(state: DashboardView, action: RefreshSuccess): DashboardView {
    return {
        ...state,
        error: null,
        viewModel: {
            refreshState: ComponentLoadingState.SUCCESS,
            organizations: action.organizations,
            requestInbox: action.requestInbox,
            requestOutbox: action.requestOutbox,
            pendingAdminRequests: action.pendingGroupRequests
        }
    }
}

function refreshError(state: DashboardView, action: RefreshError): DashboardView {
    if (!state.viewModel) {
        return state
    }
    return {
        ...state,
        error: action.error,
        viewModel: {
            ...state.viewModel,
            refreshState: ComponentLoadingState.ERROR
        }
    }
}

function unload(state: DashboardView, action: Unload): DashboardView {
    return {
        loadingState: ComponentLoadingState.NONE,
        error: null,
        viewModel: null
    }
}

function cancelOutboxRequest(state: DashboardView, action: CancelOutboxRequestSuccess): DashboardView {
    if (!state.viewModel) {
        throw new Error('view model mysteriously missing in dashboard')
    }
    return {
        ...state,
        viewModel: {
            ...state.viewModel,
            // TODO: rename to requestOutbox, requestInbox
            requestOutbox: action.requests
        }
    }
}

function acceptInboxRequest(state: DashboardView, action: AcceptInboxRequestSuccess): DashboardView {
    if (!state.viewModel) {
        throw new Error('view model mysteriously missing in dashboard')
    }
    return {
        ...state,
        viewModel: {
            ...state.viewModel,
            // TODO: rename to requestOutbox, requestInbox
            requestInbox: action.requests,
            organizations: action.organizations
        }
    }
}

function rejectInboxRequest(state: DashboardView, action: RejectInboxRequestSuccess): DashboardView {
    if (!state.viewModel) {
        throw new Error('view model mysteriously missing in dashboard')
    }
    return {
        ...state,
        viewModel: {
            ...state.viewModel,
            // TODO: rename to requestOutbox, requestInbox
            requestInbox: action.requests
        }
    }
}

function localReducer(state: DashboardView, action: DashboardAction<any>): DashboardView | null {
    switch (action.type) {
        case ActionFlag.DASHBOARD_LOAD_START:
            return loadStart(state, action as LoadStart)
        case ActionFlag.DASHBOARD_LOAD_SUCCESS:
            return loadSuccess(state, action as LoadSuccess)
        case ActionFlag.DASHBOARD_LOAD_ERROR:
            return loadError(state, action as LoadError)
        case ActionFlag.DASHBOARD_UNLOAD:
            return unload(state, action as Unload)
        case ActionFlag.DASHBOARD_REFRESH_START:
            return refreshStart(state, action as RefreshStart)
        case ActionFlag.DASHBOARD_REFRESH_SUCCESS:
            return refreshSuccess(state, action as RefreshSuccess)
        case ActionFlag.DASHBOARD_REFRESH_ERROR:
            return refreshError(state, action as RefreshError)
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

export default function reducer(state: StoreState, action: DashboardAction<any>): StoreState | null {
    const dashboardView = localReducer(state.views.dashboardView, action)
    if (!dashboardView) {
        return null
    }
    return {
        ...state,
        views: {
            ...state.views,
            dashboardView
        }
    }
}