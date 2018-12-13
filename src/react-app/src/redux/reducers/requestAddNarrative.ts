import { Action } from 'redux'
import * as actions from '../actions/requestAddNarrative'
import * as types from '../../types'
import { ActionFlag } from '../actions'
import { OrganizationModel } from '../../data/models/organization/model';

export function loadStart(state: types.StoreState, action: actions.LoadStart): types.StoreState {
    return {
        ...state,
        views: {
            ...state.views,

            requestNarrativeView: {
                ...state.views.requestNarrativeView,
                loadingState: types.ComponentLoadingState.LOADING,
                error: null,
                viewModel: null
            }
        }
    }
}

export function loadSuccess(state: types.StoreState, action: actions.LoadSuccess): types.StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            requestNarrativeView: {
                ...state.views.requestNarrativeView,
                loadingState: types.ComponentLoadingState.SUCCESS,
                error: null,
                viewModel: {
                    organization: action.organization,
                    narratives: action.narratives,
                    selectedNarrative: null,
                    relation: action.relation,
                    error: null,
                    saveState: types.SaveState.SAVED
                }
            }
        }
    }
}

export function loadError(state: types.StoreState, action: actions.LoadError): types.StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            requestNarrativeView: {
                ...state.views.requestNarrativeView,
                loadingState: types.ComponentLoadingState.ERROR,
                error: action.error,
                viewModel: null
            }
        }
    }
}

export function sendRequestStart(state: types.StoreState, action: actions.SendRequestStart): types.StoreState {

    if (!state.views.requestNarrativeView.viewModel) {
        throw new Error('view model missing')
    }

    return {
        ...state,
        views: {
            ...state.views,
            requestNarrativeView: {
                ...state.views.requestNarrativeView,
                viewModel: {
                    ...state.views.requestNarrativeView.viewModel,
                    saveState: types.SaveState.SAVING
                }
            }
        }
    }
}

export function sendRequestSuccess(state: types.StoreState, action: actions.SendRequestSuccess): types.StoreState {

    if (!state.views.requestNarrativeView.viewModel) {
        throw new Error('view model missing')
    }

    const newState: types.StoreState = {
        ...state,
        views: {
            ...state.views,
            requestNarrativeView: {
                ...state.views.requestNarrativeView,
                viewModel: {
                    ...state.views.requestNarrativeView.viewModel,
                    saveState: types.SaveState.SAVED
                }
            }
        }
    }

    const viewModel = newState.views.requestNarrativeView.viewModel

    if (!viewModel) {
        throw new Error('view model missing')
    }

    const selectedNarrative = viewModel.selectedNarrative

    // If the request is by an admin, it will be returned as true, not the request
    // (the api returns {complete: true})
    if (action.request === true) {
        viewModel.narratives = viewModel.narratives.map((narrative) => {
            if (narrative.workspaceId === selectedNarrative!.workspaceId) {
                narrative.status = types.NarrativeState.ASSOCIATED
            }
            return narrative
        })
    } else {
        viewModel.narratives = viewModel.narratives.map((narrative) => {
            if (narrative.workspaceId === selectedNarrative!.workspaceId) {
                narrative.status = types.NarrativeState.REQUESTED
            }
            return narrative
        })
    }

    return newState
}

export function sendRequestError(state: types.StoreState, action: actions.SendRequestError): types.StoreState {

    if (!state.views.requestNarrativeView.viewModel) {
        throw new Error('view model missing')
    }

    return {
        ...state,
        views: {
            ...state.views,
            requestNarrativeView: {
                ...state.views.requestNarrativeView,
                viewModel: {
                    ...state.views.requestNarrativeView.viewModel,
                    saveState: types.SaveState.SAVE_ERROR,
                    error: action.error
                }
            }
        }
    }
}

export function selectNarrativeSuccess(state: types.StoreState, action: actions.SelectNarrativeSuccess): types.StoreState {
    if (!state.views.requestNarrativeView.viewModel) {
        throw new Error('view model missing')
    }
    return {
        ...state,
        views: {
            ...state.views,
            requestNarrativeView: {
                ...state.views.requestNarrativeView,
                // TODO: a selected state?
                error: null,
                viewModel: {
                    ...state.views.requestNarrativeView.viewModel,
                    selectedNarrative: action.narrative
                }
            }
        }
    }
}

export function unload(state: types.StoreState, action: actions.Unload): types.StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            requestNarrativeView: {
                loadingState: types.ComponentLoadingState.NONE,
                error: null,
                viewModel: null
            }
        }
    }
}

function reducer(state: types.StoreState, action: Action): types.StoreState | null {
    switch (action.type) {
        case ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_START:
            return loadStart(state, action as actions.LoadStart)
        case ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_SUCCESS:
            return loadSuccess(state, action as actions.LoadSuccess)
        case ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_ERROR:
            return loadError(state, action as actions.LoadError)
        case ActionFlag.REQUEST_ADD_NARRATIVE_SEND_START:
            return sendRequestStart(state, action as actions.SendRequestStart)
        case ActionFlag.REQUEST_ADD_NARRATIVE_SEND_SUCCESS:
            return sendRequestSuccess(state, action as actions.SendRequestSuccess)
        case ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_ERROR:
            return sendRequestStart(state, action as actions.SendRequestStart)
        case ActionFlag.REQUEST_ADD_NARRATIVE_SELECT_NARRATIVE_SUCCESS:
            return selectNarrativeSuccess(state, action as actions.SelectNarrativeSuccess)
        case ActionFlag.REQUEST_ADD_NARRATIVE_UNLOAD:
            return unload(state, action as actions.Unload)
        default:
            return null
    }
}

export default reducer