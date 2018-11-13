import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import * as Cookies from 'es-cookie'

import { ActionFlag } from './index'
import { AppError, StoreState } from '../../types';
import { AuthClient, TokenInfo, Account } from '../../data/auth';

// Action Definitions

export interface AuthCheck extends Action {
    type: ActionFlag.AUTH_CHECK
}

export interface AuthCheckStart extends Action {
    type: ActionFlag.AUTH_CHECK_START
}

export interface AuthCheckError extends Action {
    type: ActionFlag.AUTH_CHECK_ERROR,
    error: AppError
}

export interface AuthAuthorized extends Action {
    type: ActionFlag.AUTH_AUTHORIZED,
    token: string
    username: string,
    realname: string,
    roles: Array<string>
}

export interface AuthUnauthorized extends Action {
    type: ActionFlag.AUTH_UNAUTHORIZED
}

export interface AuthRemoveAuthorization extends Action {
    type: ActionFlag.AUTH_REMOVE_AUTHORIZATION
}

export interface AuthAddAuthorization extends Action {
    type: ActionFlag.AUTH_ADD_AUTHORIZATION,
    token: string
}

// Action Creators


export function authCheckStart(): AuthCheckStart {
    return {
        type: ActionFlag.AUTH_CHECK_START
    }
}

export function authCheckError(error: AppError): AuthCheckError {
    return {
        type: ActionFlag.AUTH_CHECK_ERROR,
        error
    }
}

export function authAuthorized(token: string, username: string, realname: string, roles: Array<string>): AuthAuthorized {
    return {
        type: ActionFlag.AUTH_AUTHORIZED,
        token, username, realname, roles
    }
}

export function authUnauthorized(): AuthUnauthorized {
    return {
        type: ActionFlag.AUTH_UNAUTHORIZED
    }
}

// export function authRemoveAuthorization(): AuthRemoveAuthorization {
//     return {
//         type: ActionFlag.AUTH_REMOVE_AUTHORIZATION
//     }
// }

// export function authAddAuthorization(token: string): AuthAddAuthorization {
//     return {
//         type: ActionFlag.AUTH_ADD_AUTHORIZATION,
//         token: token
//     }
// }

// Action Thunks

export function checkAuth() {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(authCheckStart())

        // TODO: get the auth from the kbase-ui integration api, perhaps a postmessage call

        const token = Cookies.get('kbase_session')
        if (!token) {
            dispatch(authUnauthorized())
            return
        }
        const auth = new AuthClient({ url: '/services/auth' })
        Promise.all([
            auth.getTokenInfo(token),
            auth.getMe(token)
        ])
            .then(([tokenInfo, account]) => {
                const roles = account.roles.map(({ id, desc }) => id)
                dispatch(authAuthorized(token, account.user, account.display, roles))
            })
            .catch((err) => {
                console.error('auth check error', err)
                dispatch(authCheckError({
                    code: 'error',
                    message: err.message
                }))
            })
    }
}

export function authRemoveAuthorization() {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        // remove cookie
        Cookies.remove('kbase_session')

        // remove auth in state
        dispatch(authUnauthorized())
    }
}

export function authAddAuthorization(token: string) {
    return (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        // add cookie
        Cookies.set('kbase_session', token)

        // TODO: get auth info
        const auth = new AuthClient({ url: '/services/auth' })
        Promise.all([
            auth.getTokenInfo(token),
            auth.getMe(token)
        ])
            .then(([tokenInfo, account]) => {
                const roles = account.roles.map(({ id, desc }) => id)
                dispatch(authAuthorized(token, account.user, account.display, roles))
            })
            .catch((err) => {
                console.error('auth check error', err)
                dispatch(authCheckError({
                    code: 'error',
                    message: err.message
                }))
            })

    }
}