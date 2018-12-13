import { Action } from 'redux'
import * as actions from '../actions/organizationCentric'
import { StoreState, ComponentLoadingState } from '../../types'
import { ActionFlag } from '../actions'

export function loadStart(state: StoreState, action: actions.LoadStart): StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            organizationCentricView: {
                loadingState: ComponentLoadingState.LOADING,
                error: null,
                viewModel: null
            }
        }
    }
}

export function loadError(state: StoreState, action: actions.LoadError): StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            organizationCentricView: {
                ...state.views.organizationCentricView,
                loadingState: ComponentLoadingState.ERROR,
                error: action.error,
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
            organizationCentricView: {
                ...state.views.organizationCentricView,
                loadingState: ComponentLoadingState.SUCCESS,
                error: null,
                viewModel: {
                    organization: action.organization,
                    pendingJoinRequest: action.pendingJoinRequest,
                    pendingJoinInvitation: action.pendingJoinInvitation,
                    relation: action.relation
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
            organizationCentricView: {
                loadingState: ComponentLoadingState.NONE,
                error: null,
                viewModel: null
            }
        }
    }
}

function reducer(state: StoreState, action: Action): StoreState | null {
    switch (action.type) {
        case ActionFlag.ORGANIZATION_CENTRIC_VIEW_LOAD_START:
            return loadStart(state, action as actions.LoadStart)
        case ActionFlag.ORGANIZATION_CENTRIC_VIEW_LOAD_SUCCESS:
            return loadSuccess(state, action as actions.LoadSuccess)
        case ActionFlag.ORGANIZATION_CENTRIC_VIEW_LOAD_ERROR:
            return loadError(state, action as actions.LoadError)
        case ActionFlag.ORGANIZATION_CENTRIC_VIEW_UNLOAD:
            return unload(state, action as actions.Unload)
        default:
            return null
    }
}

export default reducer