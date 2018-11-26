import { Action } from 'redux'
import * as actions from '../actions/manageMembership'
import * as types from '../../types'
import { ActionFlag } from '../actions'

export function manageMembershipLoadStart(state: types.StoreState, action: actions.LoadStart): types.StoreState {
    console.log('start')
    return {
        ...state,
        manageMembershipView: {
            loading: true,
            error: null,
            value: null
        }
    }
}

export function manageMembershipLoadSuccess(state: types.StoreState, action: actions.LoadSuccess): types.StoreState {
    console.log('success')
    return {
        ...state,
        manageMembershipView: {
            loading: false,
            error: null,
            value: {
                organization: action.organization
            }
        }
    }
}

export function manageMembershipLoadError(state: types.StoreState, action: actions.LoadError): types.StoreState {
    console.log('error')
    return {
        ...state,
        manageMembershipView: {
            loading: false,
            error: action.error,
            value: null
        }
    }
}

function reducer(state: types.StoreState, action: Action): types.StoreState | null {
    switch (action.type) {
        case ActionFlag.MANAGE_MEMBERSHIP_LOAD_START:
            return manageMembershipLoadStart(state, action as actions.LoadStart)
        case ActionFlag.MANAGE_MEMBERSHIP_LOAD_SUCCESS:
            return manageMembershipLoadSuccess(state, action as actions.LoadSuccess)
        case ActionFlag.MANAGE_MEMBERSHIP_LOAD_ERROR:
            return manageMembershipLoadError(state, action as actions.LoadError)
        default:
            return null
    }
}

export default reducer