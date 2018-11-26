import { Action } from 'redux'
import * as actions from '../actions/inviteUser'
import * as types from '../../types'
import { ActionFlag } from '../actions'

export function inviteUserLoadStart(state: types.StoreState, action: actions.InviteUserLoadStart): types.StoreState {
    return {
        ...state,
        inviteUserView: {
            ...state.inviteUserView,
            state: types.InviteUserState.LOADING
        }
    }
}

export function inviteUserLoadReady(state: types.StoreState, action: actions.InviteUserLoadReady): types.StoreState {
    return {
        ...state,
        inviteUserView: {
            ...state.inviteUserView,
            state: types.InviteUserState.READY,
            viewState: {
                users: [],
                organization: action.organization,
                selectedUser: null
            }
        }
    }
}

export function inviteUserLoadError(state: types.StoreState, action: actions.InviteUserLoadError): types.StoreState {
    return {
        ...state,
        inviteUserView: {
            ...state.inviteUserView,
            state: types.InviteUserState.ERROR,
            viewState: action.error
        }
    }
}

export function searchUsersSuccess(state: types.StoreState, action: actions.SearchUsersSuccess): types.StoreState {
    return {
        ...state,
        inviteUserView: {
            ...state.inviteUserView,
            viewState: {
                ...state.inviteUserView.viewState as types.InviteUserValue,
                users: action.users
            }
        }
    }
}

export function selectUserSuccess(state: types.StoreState, action: actions.SelectUserSuccess): types.StoreState {
    return {
        ...state,
        inviteUserView: {
            ...state.inviteUserView,
            viewState: {
                ...state.inviteUserView.viewState as types.InviteUserValue,
                selectedUser: action.user
            }
        }
    }
}


function reducer(state: types.StoreState, action: Action): types.StoreState | null {
    switch (action.type) {
        case ActionFlag.INVITE_USER_LOAD_START:
            return inviteUserLoadStart(state, action as actions.InviteUserLoadStart)
        case ActionFlag.INVITE_USER_LOAD_READY:
            return inviteUserLoadReady(state, action as actions.InviteUserLoadReady)
        case ActionFlag.INVITE_USER_LOAD_ERROR:
            return inviteUserLoadError(state, action as actions.InviteUserLoadError)
        case ActionFlag.INVITE_USER_SEARCH_USERS_SUCCESS:
            return searchUsersSuccess(state, action as actions.SearchUsersSuccess)
        case ActionFlag.INVITE_USER_SELECT_USER_SUCCESS:
            return selectUserSuccess(state, action as actions.SelectUserSuccess)
        default:
            return null
    }
}

export default reducer