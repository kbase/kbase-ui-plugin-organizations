import { Action } from 'redux'
import * as actions from '../actions/manageMembership'
import * as types from '../../types'
import { ActionFlag } from '../actions'

export function loadStart(state: types.StoreState, action: actions.LoadStart): types.StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            manageMembershipView: {
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
            manageMembershipView: {
                loadingState: types.ComponentLoadingState.SUCCESS,
                error: null,
                viewModel: {
                    organization: action.organization
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
            manageMembershipView: {
                loadingState: types.ComponentLoadingState.LOADING,
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
            manageMembershipView: {
                loadingState: types.ComponentLoadingState.NONE,
                error: null,
                viewModel: null
            }
        }
    }
}

function reducer(state: types.StoreState, action: Action): types.StoreState | null {
    switch (action.type) {
        case ActionFlag.MANAGE_MEMBERSHIP_LOAD_START:
            return loadStart(state, action as actions.LoadStart)
        case ActionFlag.MANAGE_MEMBERSHIP_LOAD_SUCCESS:
            return loadSuccess(state, action as actions.LoadSuccess)
        case ActionFlag.MANAGE_MEMBERSHIP_LOAD_ERROR:
            return loadError(state, action as actions.LoadError)
        case ActionFlag.MANAGE_MEMBERSHIP_UNLOAD:
            return unload(state, action as actions.Unload)
        default:
            return null
    }
}

export default reducer