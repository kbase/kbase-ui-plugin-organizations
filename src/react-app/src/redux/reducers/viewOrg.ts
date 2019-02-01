import { Action } from 'redux'
import * as actions from '../actions/viewOrg'
import * as types from '../../types'
import { ActionFlag } from '../actions'
import acceptInboxRequest from './viewOrganization/acceptInboxRequest'
import viewMembers from './viewOrganization/viewMembers'
import denyInboxRequest from './viewOrganization/denyInboxRequest'
import cancelOutboxRequest from './viewOrganization/cancelOutboxRequests'

export function loadStart(state: types.StoreState, action: actions.LoadStart): types.StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            viewOrgView: {
                loadingState: types.ComponentLoadingState.LOADING,
                error: null,
                viewModel: null
            }
        }
    }
}

export function loadNormalSuccess(state: types.StoreState, action: actions.LoadNormalSuccess): types.StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            viewOrgView: {
                loadingState: types.ComponentLoadingState.SUCCESS,
                error: null,
                viewModel: {
                    kind: types.ViewOrgViewModelKind.NORMAL,
                    organization: action.organization,
                    relation: action.relation,
                    groupRequests: action.groupRequests,
                    groupInvitations: action.groupInvitations,
                    requestInbox: action.requestInbox,
                    requestOutbox: action.requestOutbox
                } as types.ViewOrgViewModel
            }
        }
    }
}

export function loadInaccessiblePrivateSuccess(state: types.StoreState, action: actions.LoadInaccessiblePrivateSuccess): types.StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            viewOrgView: {
                loadingState: types.ComponentLoadingState.SUCCESS,
                error: null,
                viewModel: {
                    kind: types.ViewOrgViewModelKind.PRIVATE_INACCESSIBLE,
                    organization: action.organization,
                    relation: action.relation,
                    requestOutbox: action.requestOutbox
                } as types.ViewInaccessiblePrivateOrgViewModel
            }
        }
    }
}

export function loadError(state: types.StoreState, action: actions.LoadError): types.StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            viewOrgView: {
                loadingState: types.ComponentLoadingState.ERROR,
                error: action.error,
                viewModel: null
            }
        }
    }
}

export function unload(state: types.StoreState, action: actions.Unload): types.StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            viewOrgView: {
                loadingState: types.ComponentLoadingState.NONE,
                error: null,
                viewModel: null
            }
        }
    }
}

export function removeNarrativeSuccess(state: types.StoreState, action: actions.RemoveNarrativeSuccess): types.StoreState {
    if (!state.views.viewOrgView.viewModel) {
        return state
    }
    // Argh!@
    if (state.views.viewOrgView.viewModel.kind !== types.ViewOrgViewModelKind.NORMAL) {
        return state
    }
    const newNarratives = state.views.viewOrgView.viewModel.organization.narratives.filter((narrative) => {
        return (narrative.workspaceId !== action.narrative.workspaceId)
    })
    return {
        ...state,
        views: {
            ...state.views,
            viewOrgView: {
                ...state.views.viewOrgView,
                viewModel: {
                    ...state.views.viewOrgView.viewModel,
                    organization: {
                        ...state.views.viewOrgView.viewModel.organization,
                        narratives: newNarratives
                    }
                }
            }
        }
    }
}

export function accessNarrativeSuccess(state: types.StoreState, action: actions.AccessNarrativeSuccess): types.StoreState {
    if (!state.views.viewOrgView.viewModel) {
        return state
    }
    if (state.views.viewOrgView.viewModel.kind !== types.ViewOrgViewModelKind.NORMAL) {
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            viewOrgView: {
                ...state.views.viewOrgView,
                viewModel: {
                    ...state.views.viewOrgView.viewModel,
                    organization: action.organization
                }
            }
        }
    }
}

function reducer(state: types.StoreState, action: Action): types.StoreState | null {
    // NB using discriminant union nature of the ActionX types to narrow
    // the type.

    switch (action.type) {
        case ActionFlag.VIEW_ORG_LOAD_START:
            return loadStart(state, action as actions.LoadStart)
        case ActionFlag.VIEW_ORG_LOAD_NORMAL_SUCCESS:
            return loadNormalSuccess(state, action as actions.LoadNormalSuccess)
        case ActionFlag.VIEW_ORG_LOAD_INACCESSIBLE_PRIVATE_SUCCESS:
            return loadInaccessiblePrivateSuccess(state, action as actions.LoadInaccessiblePrivateSuccess)
        case ActionFlag.VIEW_ORG_LOAD_ERROR:
            return loadError(state, action as actions.LoadError)
        case ActionFlag.VIEW_ORG_UNLOAD:
            return unload(state, action as actions.Unload)
        case ActionFlag.VIEW_ORG_REMOVE_NARRATIVE_SUCCESS:
            return removeNarrativeSuccess(state, action as actions.RemoveNarrativeSuccess)
        case ActionFlag.VIEW_ORG_ACCESS_NARRATIVE_SUCCESS:
            return accessNarrativeSuccess(state, action as actions.AccessNarrativeSuccess)
    }

    return acceptInboxRequest(state, action) ||
        denyInboxRequest(state, action) ||
        cancelOutboxRequest(state, action) ||
        viewMembers(state, action)
}

export default reducer