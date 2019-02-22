import { Action } from 'redux'
import * as actions from '../../actions/viewOrganization/requestAddNarrative'
import {
    StoreState, SaveState, NarrativeState, View,
    RequestNarrativeViewModel, ViewOrgViewModelKind,
    ViewState,
    SelectionState
} from '../../../types'
import { ActionFlag } from '../../actions'

export function loadStart(state: View<RequestNarrativeViewModel>, action: actions.LoadStart): View<RequestNarrativeViewModel> {
    return {

        state: ViewState.LOADING,
        error: null,
        viewModel: null
    }

}

export function loadSuccess(state: View<RequestNarrativeViewModel>, action: actions.LoadSuccess): View<RequestNarrativeViewModel> {
    return {
        state: ViewState.OK,
        error: null,
        viewModel: {
            organization: action.organization,
            narratives: action.narratives,
            selectedNarrative: null,
            relation: action.relation,
            error: null,
            selectionState: SelectionState.NONE,
            saveState: SaveState.SAVED
        }
    }
}

export function loadError(state: View<RequestNarrativeViewModel>, action: actions.LoadError): View<RequestNarrativeViewModel> {
    return {
        state: ViewState.ERROR,
        error: action.error,
        viewModel: null
    }
}

export function sendRequestStart(state: View<RequestNarrativeViewModel>, action: actions.SendRequestStart): View<RequestNarrativeViewModel> {
    if (state.viewModel === null) {
        return state
    }

    return {
        ...state,
        viewModel: {
            ...state.viewModel,
            saveState: SaveState.SAVING
        }
    }
}

export function sendRequestSuccess(state: View<RequestNarrativeViewModel>, action: actions.SendRequestSuccess): View<RequestNarrativeViewModel> {
    if (state.viewModel === null) {
        return state
    }

    const newState: View<RequestNarrativeViewModel> = {
        ...state,
        viewModel: {
            ...state.viewModel,
            saveState: SaveState.SAVED
        }
    }

    const viewModel = newState.viewModel

    // hmm, TS can't trace this fact from the original state (which we proved
    // at the top of this function.)
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

export function sendRequestError(state: View<RequestNarrativeViewModel>, action: actions.SendRequestError): View<RequestNarrativeViewModel> {
    if (state.viewModel === null) {
        return state
    }
    return {
        ...state,
        viewModel: {
            ...state.viewModel,
            saveState: SaveState.SAVE_ERROR,
            error: action.error
        }
    }
}

export function selectNarrativeStart(state: View<RequestNarrativeViewModel>, action: actions.SelectNarrativeStart): View<RequestNarrativeViewModel> {
    if (state.viewModel === null) {
        return state
    }
    return {
        ...state,
        error: null,
        viewModel: {
            ...state.viewModel
        }
    }
}

export function selectNarrativeSuccess(state: View<RequestNarrativeViewModel>, action: actions.SelectNarrativeSuccess): View<RequestNarrativeViewModel> {
    if (state.viewModel === null) {
        return state
    }
    const newState = {
        ...state,
        error: null,
        viewModel: {
            ...state.viewModel,
            selectedNarrative: action.narrative
        }
    }
    return newState
}

export function unload(state: View<RequestNarrativeViewModel>, action: actions.Unload): View<RequestNarrativeViewModel> {
    return {
        state: ViewState.NONE,
        error: null,
        viewModel: null
    }
}

function sortSuccess(state: View<RequestNarrativeViewModel>, action: actions.SortSuccess): View<RequestNarrativeViewModel> {
    if (state.viewModel === null) {
        return state
    }
    return {
        ...state,
        viewModel: {
            ...state.viewModel,
            narratives: action.narratives
        }
    }
}

function localReducer(state: View<RequestNarrativeViewModel>, action: Action): View<RequestNarrativeViewModel> | null {
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
        case ActionFlag.REQUEST_ADD_NARRATIVE_SELECT_NARRATIVE_START:
            return selectNarrativeStart(state, action as actions.SelectNarrativeStart)
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

function haveReducer(action: Action): boolean {
    switch (action.type) {
        case ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_START:
        case ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_SUCCESS:
        case ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_ERROR:
        case ActionFlag.REQUEST_ADD_NARRATIVE_SEND_START:
        case ActionFlag.REQUEST_ADD_NARRATIVE_SEND_SUCCESS:
        case ActionFlag.REQUEST_ADD_NARRATIVE_LOAD_ERROR:
        case ActionFlag.REQUEST_ADD_NARRATIVE_SELECT_NARRATIVE_SUCCESS:
        case ActionFlag.REQUEST_ADD_NARRATIVE_UNLOAD:
        case ActionFlag.REQUEST_ADD_NARRATIVE_SORT_SUCCESS:
            return true
        default:
            return false
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
    const viewState: View<RequestNarrativeViewModel> = state.views.viewOrgView.viewModel.subViews.requestNarrativeView
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
                        requestNarrativeView: newViewState
                    }
                }
            }
        }
    }
}

