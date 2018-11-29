import { Action } from 'redux'
import * as actions from '../actions/viewOrg'
import * as types from '../../types'
import { ActionFlag } from '../actions'

export function viewOrgStart(state: types.StoreState,
    action: actions.ViewOrgStart): types.StoreState {
    return {
        ...state,
        viewOrg: { ...state.viewOrg, state: types.ViewOrgState.FETCHING }
    }
}

export function viewOrgSuccess(state: types.StoreState,
    action: actions.ViewOrgSuccess): types.StoreState {
    return {
        ...state,
        viewOrg: {
            ...state.viewOrg,
            state: types.ViewOrgState.READY,
            organization: action.organization
        }
    }
}

export function viewOrgError(state: types.StoreState,
    action: actions.ViewOrgError): types.StoreState {
    return {
        ...state,
        viewOrg: {
            ...state.viewOrg,
            state: types.ViewOrgState.ERROR,
            error: action.error
        }
    }
}

export function viewOrgStop(state: types.StoreState, action: actions.ViewOrgStop): types.StoreState {
    return {
        ...state,
        viewOrg: {
            state: types.ViewOrgState.NONE
        }
    }
}


export function removeNarrativeSuccess(state: types.StoreState, action: actions.RemoveNarrativeSuccess): types.StoreState {
    if (!state.viewOrg.organization) {
        return state
    }
    const newNarratives = state.viewOrg.organization.narratives.filter((narrative) => {
        return (narrative.workspaceId !== action.narrative.workspaceId)
    })
    return {
        ...state,
        viewOrg: {
            ...state.viewOrg,
            organization: {
                ...state.viewOrg.organization,
                narratives: newNarratives
            }
        }
    }
}

function reducer(state: types.StoreState, action: Action): types.StoreState | null {
    // NB using discriminant union nature of the ActionX types to narrow
    // the type.

    switch (action.type) {
        case ActionFlag.VIEW_ORG_FETCH_START:
            return viewOrgStart(state, action as actions.ViewOrgStart)
        case ActionFlag.VIEW_ORG_FETCH_SUCCESS:
            return viewOrgSuccess(state, action as actions.ViewOrgSuccess)
        case ActionFlag.VIEW_ORG_FETCH_ERROR:
            return viewOrgError(state, action as actions.ViewOrgError)
        case ActionFlag.VIEW_ORG_STOP:
            return viewOrgStop(state, action as actions.ViewOrgStop)
        case ActionFlag.VIEW_ORG_REMOVE_NARRATIVE_SUCCESS:
            return removeNarrativeSuccess(state, action as actions.RemoveNarrativeSuccess)
        default:
            return null
    }
}
export default reducer