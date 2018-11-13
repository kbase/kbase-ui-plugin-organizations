import { Action } from 'redux'

import { ActionFlag } from '../actions'
import { StoreState, AuthState } from '../../types'
import { AuthCheckStart, AuthAuthorized, AuthUnauthorized, AuthCheckError } from '../actions/auth';

export function authCheckStart(state: StoreState, action: AuthCheckStart): StoreState {
    return {
        ...state,
        auth: {
            status: AuthState.CHECKING,
            message: '',
            authorization: {
                token: '',
                username: '',
                realname: '',
                roles: []
            }
        }
    }
}

export function authCheckError(state: StoreState, action: AuthCheckError): StoreState {
    return {
        ...state,
        auth: {
            status: AuthState.ERROR,
            message: action.error.message,
            authorization: {
                token: '',
                username: '',
                realname: '',
                roles: []
            }
        }
    }
}

export function authAuthorized(state: StoreState, action: AuthAuthorized): StoreState {
    return {
        ...state,
        auth: {
            status: AuthState.AUTHORIZED,
            message: '',
            authorization: {
                token: action.token,
                username: action.username,
                realname: action.realname,
                roles: action.roles
            }
        }
    }
}

export function authUnauthorized(state: StoreState, action: AuthUnauthorized): StoreState {
    return {
        ...state,
        auth: {
            status: AuthState.UNAUTHORIZED,
            message: '',
            authorization: {
                token: '',
                username: '',
                realname: '',
                roles: []
            }
        }
    }
}

function reducer(state: StoreState, action: Action): StoreState | null {
    switch (action.type) {
        case ActionFlag.AUTH_CHECK_START:
            return authCheckStart(state, action as AuthCheckStart)
        case ActionFlag.AUTH_AUTHORIZED:
            return authAuthorized(state, action as AuthAuthorized)
        case ActionFlag.AUTH_UNAUTHORIZED:
            return authUnauthorized(state, action as AuthUnauthorized)
        case ActionFlag.AUTH_CHECK_ERROR:
            return authCheckError(state, action as AuthCheckError)
        default:
            return null
    }
}

export default reducer