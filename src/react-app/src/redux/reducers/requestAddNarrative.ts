import { Action } from 'redux'
import * as actions from '../actions/requestAddNarrative'
import { StoreState, ComponentLoadingState, SaveState, NarrativeState } from '../../types'
import { ActionFlag } from '../actions'

export function loadStart(state: StoreState, action: actions.LoadStart): StoreState {
    return {
        ...state,
        views: {
            ...state.views,

            requestNarrativeView: {
                ...state.views.requestNarrativeView,
                loadingState: ComponentLoadingState.LOADING,
                error: null,
                viewModel: null
            }
        }
    }
}

export function loadSuccess(state: StoreState, action: actions.LoadSuccess): StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            requestNarrativeView: {
                ...state.views.requestNarrativeView,
                loadingState: ComponentLoadingState.SUCCESS,
                error: null,
                viewModel: {
                    organization: action.organization,
                    narratives: action.narratives,
                    selectedNarrative: null,
                    relation: action.relation,
                    error: null,
                    saveState: SaveState.SAVED
                }
            }
        }
    }
}

export function loadError(state: StoreState, action: actions.LoadError): StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            requestNarrativeView: {
                ...state.views.requestNarrativeView,
                loadingState: ComponentLoadingState.ERROR,
                error: action.error,
                viewModel: null
            }
        }
    }
}

export function sendRequestStart(state: StoreState, action: actions.SendRequestStart): StoreState {
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
                    saveState: SaveState.SAVING
                }
            }
        }
    }
}

export function sendRequestSuccess(state: StoreState, action: actions.SendRequestSuccess): StoreState {
    if (!state.views.requestNarrativeView.viewModel) {
        throw new Error('view model missing')
    }

    const newState: StoreState = {
        ...state,
        views: {
            ...state.views,
            requestNarrativeView: {
                ...state.views.requestNarrativeView,
                viewModel: {
                    ...state.views.requestNarrativeView.viewModel,
                    saveState: SaveState.SAVED
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
        viewModel.narratives = viewModel.narratives.map((orgNarrative) => {
            if (orgNarrative.narrative.workspaceId === selectedNarrative!.narrative.workspaceId) {
                orgNarrative.status = NarrativeState.ASSOCIATED
            }
            return orgNarrative
        })
    } else {
        viewModel.narratives = viewModel.narratives.map((orgNarrative) => {
            if (orgNarrative.narrative.workspaceId === selectedNarrative!.narrative.workspaceId) {
                orgNarrative.status = NarrativeState.REQUESTED
            }
            return orgNarrative
        })
    }

    return newState
}

export function sendRequestError(state: StoreState, action: actions.SendRequestError): StoreState {
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
                    saveState: SaveState.SAVE_ERROR,
                    error: action.error
                }
            }
        }
    }
}

export function selectNarrativeSuccess(state: StoreState, action: actions.SelectNarrativeSuccess): StoreState {
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

export function unload(state: StoreState, action: actions.Unload): StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            requestNarrativeView: {
                loadingState: ComponentLoadingState.NONE,
                error: null,
                viewModel: null
            }
        }
    }
}

function sortSuccess(state: StoreState, action: actions.SortSuccess): StoreState {
    const viewModel = state.views.requestNarrativeView.viewModel
    if (viewModel === null) {
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            requestNarrativeView: {
                ...state.views.requestNarrativeView,
                viewModel: {
                    ...viewModel,
                    narratives: action.narratives
                }
            }
        }
    }
}

function reducer(state: StoreState, action: Action): StoreState | null {
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
        case ActionFlag.REQUEST_ADD_NARRATIVE_SORT_SUCCESS:
            return sortSuccess(state, action as actions.SortSuccess)
        default:
            return null
    }
}

export default reducer