import { Action } from 'redux'
import * as actions from '../actions/requestAddNarrative'
import * as types from '../../types'
import { ActionFlag } from '../actions'

export function loadStart(state: types.StoreState, action: actions.LoadStart): types.StoreState {
    return {
        ...state,
        requestNarrativeView: {
            ...state.requestNarrativeView,
            status: types.RequestNarrativeState.LOADING,
            error: null,
            value: null
        }
    }
}

export function loadSuccess(state: types.StoreState, action: actions.LoadSuccess): types.StoreState {
    return {
        ...state,
        requestNarrativeView: {
            ...state.requestNarrativeView,
            status: types.RequestNarrativeState.LOADED,
            error: null,
            value: {
                organization: action.organization,
                narratives: action.narratives,
                selectedNarrative: null
            }
        }
    }
}

export function loadError(state: types.StoreState, action: actions.LoadError): types.StoreState {
    return {
        ...state,
        requestNarrativeView: {
            ...state.requestNarrativeView,
            status: types.RequestNarrativeState.ERROR,
            error: action.error,
            value: null
        }
    }
}

export function sendRequestStart(state: types.StoreState, action: actions.SendRequestStart): types.StoreState {
    return {
        ...state,
        requestNarrativeView: {
            ...state.requestNarrativeView,
            status: types.RequestNarrativeState.SENDING,
        }
    }
}

export function sendRequestSuccess(state: types.StoreState, action: actions.SendRequestSuccess): types.StoreState {
    const newState = {
        ...state,
        requestNarrativeView: {
            ...state.requestNarrativeView,
            status: types.RequestNarrativeState.SENT,
        }
    }

    const selectedNarrative = newState.requestNarrativeView.value!.selectedNarrative

    newState.requestNarrativeView.value!.narratives = newState.requestNarrativeView.value!.narratives.map((narrative) => {
        if (narrative.workspaceId === selectedNarrative!.workspaceId) {
            narrative.inOrganization = true
        }
        return narrative
    })

    return newState
}

export function sendRequestError(state: types.StoreState, action: actions.SendRequestError): types.StoreState {
    return {
        ...state,
        requestNarrativeView: {
            ...state.requestNarrativeView,
            status: types.RequestNarrativeState.SENT,
            error: action.error,
            value: null
        }
    }
}

export function selectNarrativeSuccess(state: types.StoreState, action: actions.SelectNarrativeSuccess): types.StoreState {
    if (state.requestNarrativeView.value === null) {
        return state
    }
    return {
        ...state,
        requestNarrativeView: {
            ...state.requestNarrativeView,
            // TODO: a selected state?
            error: null,
            value: {
                ...state.requestNarrativeView.value,
                selectedNarrative: action.narrative
            }
        }
    }
}

export function unload(state: types.StoreState, action: actions.Unload): types.StoreState {
    return {
        ...state,
        requestNarrativeView: {
            status: types.RequestNarrativeState.NONE,
            error: null,
            value: null
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