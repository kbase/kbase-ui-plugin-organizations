import { Action } from 'redux'
import * as actions from '../../actions/viewOrganization/addApps'
import { AddAppsViewModel, View, ViewState, StoreState, ViewOrgViewModelKind, ResourceRelationToOrg } from '../../../types'
import { ActionFlag } from '../../actions';

export function loadStart(state: View<AddAppsViewModel>, action: actions.LoadStart): View<AddAppsViewModel> {
    return {
        state: ViewState.LOADING,
        viewModel: null,
        error: null
    }
}

export function loadSuccess(state: View<AddAppsViewModel>, action: actions.LoadSuccess): View<AddAppsViewModel> {
    return {
        state: ViewState.OK,
        error: null,
        viewModel: {
            rawApps: action.rawApps,
            sortBy: action.sortBy,
            searchBy: action.searchBy,
            apps: action.apps,
            selectedApp: action.selectedApp
        }
    }
}

export function loadError(state: View<AddAppsViewModel>, action: actions.LoadError): View<AddAppsViewModel> {
    return {
        state: ViewState.ERROR,
        error: action.error,
        viewModel: null
    }
}

export function unload(state: View<AddAppsViewModel>, action: actions.Unload): View<AddAppsViewModel> {
    return {
        state: ViewState.NONE,
        error: null,
        viewModel: null
    }
}

export function selectSuccess(state: View<AddAppsViewModel>, action: actions.SelectSuccess): View<AddAppsViewModel> {
    if (state.viewModel === null) {
        return state
    }

    const newRawApps = state.viewModel.rawApps.slice(0)
    // TODO might need more item setting here
    newRawApps.forEach((app) => {
        if (app === action.selectedApp) {
            app.selected = true
        } else {
            app.selected = false
        }
    })

    // TODO: reapply sort and search??


    return {
        ...state,
        viewModel: {
            ...state.viewModel,
            apps: newRawApps,
            rawApps: newRawApps,
            selectedApp: action.selectedApp
        } as AddAppsViewModel
    }
}

export function requestAssociationSuccess(state: View<AddAppsViewModel>, action: actions.RequestAssociationSuccess): View<AddAppsViewModel> {
    if (state.viewModel === null) {
        return state
    }

    const newRawApps = state.viewModel.rawApps.slice(0)
    // TODO might need more item setting here
    newRawApps.forEach((app) => {
        if (app.app.id === action.appId) {
            if (action.pending) {
                app.relation = ResourceRelationToOrg.ASSOCIATION_PENDING
            } else {
                app.relation = ResourceRelationToOrg.ASSOCIATED
            }
        }
    })

    // TODO: reapply sort and search??


    return {
        ...state,
        viewModel: {
            ...state.viewModel,
            apps: newRawApps,
            rawApps: newRawApps
            // selectedApp: action.selectedApp
        } as AddAppsViewModel
    }
}

function haveReducer(action: Action): boolean {
    switch (action.type) {
        case ActionFlag.VIEW_ORG_ADD_APPS_LOAD_START:
        case ActionFlag.VIEW_ORG_ADD_APPS_LOAD_SUCCESS:
        case ActionFlag.VIEW_ORG_ADD_APPS_LOAD_ERROR:
        case ActionFlag.VIEW_ORG_ADD_APPS_UNLOAD:
        case ActionFlag.VIEW_ORG_ADD_APPS_SELECT_SUCCESS:
        case ActionFlag.VIEW_ORG_ADD_APPS_REQUEST_ASSOCIATE_APP_SUCCESS:
            return true
        default: return false
    }
}

function localReducer(state: View<AddAppsViewModel>, action: actions.AddAppsAction): View<AddAppsViewModel> | null {
    switch (action.type) {
        case ActionFlag.VIEW_ORG_ADD_APPS_LOAD_START:
            return loadStart(state, action as actions.LoadStart)
        case ActionFlag.VIEW_ORG_ADD_APPS_LOAD_SUCCESS:
            return loadSuccess(state, action as actions.LoadSuccess)
        case ActionFlag.VIEW_ORG_ADD_APPS_LOAD_ERROR:
            return loadError(state, action as actions.LoadError)
        case ActionFlag.VIEW_ORG_ADD_APPS_UNLOAD:
            return unload(state, action as actions.Unload)
        case ActionFlag.VIEW_ORG_ADD_APPS_SELECT_SUCCESS:
            return selectSuccess(state, action as actions.SelectSuccess)
        case ActionFlag.VIEW_ORG_ADD_APPS_REQUEST_ASSOCIATE_APP_SUCCESS:
            return requestAssociationSuccess(state, action as actions.RequestAssociationSuccess)
        default:
            return null
    }
}

export default function reducer(state: StoreState, action: Action): StoreState | null {
    if (!haveReducer(action)) {
        return null
    }
    if (!state.views.viewOrgView.viewModel) {
        return state
    }
    if (state.views.viewOrgView.viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
        return state
    }
    const viewState: View<AddAppsViewModel> = state.views.viewOrgView.viewModel.subViews.addAppsView
    const newViewState = localReducer(viewState, action)
    if (newViewState === null) {
        return null
    }
    return {
        ...state,
        views: {
            ...state.views,
            viewOrgView: {
                ...state.views.viewOrgView,
                viewModel: {
                    ...state.views.viewOrgView.viewModel,
                    subViews: {
                        ...state.views.viewOrgView.viewModel.subViews,
                        addAppsView: newViewState
                    }
                }
            }
        }
    }
}