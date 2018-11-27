import { Action } from 'redux'
import * as actions from '../actions/inviteUser'
import * as types from '../../types'
import { ActionFlag } from '../actions'
import { StateInstances } from '../state';

export function inviteUserLoadStart(state: types.StoreState, action: actions.InviteUserLoadStart): types.StoreState {
    return {
        ...state,
        inviteUserView: {
            ...state.inviteUserView,
            loadingState: types.ComponentLoadingState.LOADING
        }
    }
}

export function inviteUserLoadReady(state: types.StoreState, action: actions.InviteUserLoadReady): types.StoreState {
    return {
        ...state,
        inviteUserView: {
            ...state.inviteUserView,
            loadingState: types.ComponentLoadingState.SUCCESS,
            error: null,
            value: {
                editState: types.InviteUserViewState.EDITING,
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
            loadingState: types.ComponentLoadingState.SUCCESS,
            error: action.error,
            value: null
        }
    }
}

export function searchUsersSuccess(state: types.StoreState, action: actions.SearchUsersSuccess): types.StoreState {
    if (state.inviteUserView.value === null) {
        throw new Error('view value is null')
    }
    return {
        ...state,
        inviteUserView: {
            ...state.inviteUserView,
            value: {
                ...state.inviteUserView.value,
                users: action.users
            }
        }
    }
}

export function selectUserSuccess(state: types.StoreState, action: actions.SelectUserSuccess): types.StoreState {
    if (state.inviteUserView.value === null) {
        throw new Error('view value is null')
    }
    return {
        ...state,
        inviteUserView: {
            ...state.inviteUserView,
            value: {
                ...state.inviteUserView.value,
                selectedUser: action.user
            }
        }
    }
}

export function sendInvitationStart(state: types.StoreState, action: actions.SendInvitationStart): types.StoreState {
    if (state.inviteUserView.value === null) {
        throw new Error('view value is null')
    }
    return {
        ...state,
        inviteUserView: {
            ...state.inviteUserView,
            value: {
                ...state.inviteUserView.value,
                editState: types.InviteUserViewState.SENDING
            }
        }
    }
}

export function sendInvitationSuccess(state: types.StoreState, action: actions.SendInvitationSuccess): types.StoreState {
    if (state.inviteUserView.value === null) {
        throw new Error('view value is null')
    }
    return {
        ...state,
        inviteUserView: {
            ...state.inviteUserView,
            value: {
                ...state.inviteUserView.value,
                editState: types.InviteUserViewState.SUCCESS
            }
        }
    }
}

export function sendInvitationError(state: types.StoreState, action: actions.SendInvitationError): types.StoreState {
    if (state.inviteUserView.value === null) {
        throw new Error('view value is null')
    }
    return {
        ...state,
        inviteUserView: {
            ...state.inviteUserView,
            value: {
                ...state.inviteUserView.value,
                editState: types.InviteUserViewState.ERROR
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
        case ActionFlag.INVITE_USER_SEND_INVITATION_START:
            return sendInvitationStart(state, action as actions.SendInvitationStart)
        case ActionFlag.INVITE_USER_SEND_INVITATION_SUCCESS:
            return sendInvitationSuccess(state, action as actions.SendInvitationSuccess)
        case ActionFlag.INVITE_USER_SEND_INVITATION_ERROR:
            return sendInvitationError(state, action as actions.SendInvitationError)
        default:
            return null
    }
}

export default reducer