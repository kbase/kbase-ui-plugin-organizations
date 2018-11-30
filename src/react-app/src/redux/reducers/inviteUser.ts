import { Action } from 'redux'
import * as actions from '../actions/inviteUser'
import * as types from '../../types'
import { ActionFlag } from '../actions'

export function loadStart(state: types.StoreState, action: actions.LoadStart): types.StoreState {
    return {
        ...state,
        inviteUserView: {
            ...state.inviteUserView,
            loadingState: types.ComponentLoadingState.LOADING
        }
    }
}

export function loadReady(state: types.StoreState, action: actions.LoadReady): types.StoreState {
    return {
        ...state,
        inviteUserView: {
            ...state.inviteUserView,
            loadingState: types.ComponentLoadingState.SUCCESS,
            error: null,
            value: {
                editState: types.InviteUserViewState.EDITING,
                users: action.users,
                organization: action.organization,
                selectedUser: null
            }
        }
    }
}

export function loadError(state: types.StoreState, action: actions.LoadError): types.StoreState {
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

export function unload(state: types.StoreState, action: actions.Unload): types.StoreState {
    return {
        ...state,
        inviteUserView: {
            ...state.inviteUserView,
            loadingState: types.ComponentLoadingState.NONE,
            error: null,
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
                selectedUser: {
                    user: action.user,
                    relation: action.relation
                }
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

    const { inviteUserView: { value: { selectedUser, users } } } = state

    // const selectedUser = state.inviteUserView.value.selectedUser
    if (!selectedUser) {
        throw new Error('selected user is null')
    }
    selectedUser.relation = types.UserRelationToOrganization.MEMBER_INVITATION_PENDING

    if (!users) {
        throw new Error('users is null')
    }
    const newUsers = users.map((user) => {
        if (user.username === selectedUser.user.username) {
            user.relation = types.UserRelationToOrganization.MEMBER_INVITATION_PENDING
        }
        return user
    })


    return {
        ...state,
        inviteUserView: {
            ...state.inviteUserView,
            value: {
                ...state.inviteUserView.value,
                editState: types.InviteUserViewState.SUCCESS,
                selectedUser: selectedUser,
                users: newUsers
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
            return loadStart(state, action as actions.LoadStart)
        case ActionFlag.INVITE_USER_LOAD_READY:
            return loadReady(state, action as actions.LoadReady)
        case ActionFlag.INVITE_USER_LOAD_ERROR:
            return loadError(state, action as actions.LoadError)
        case ActionFlag.INVITE_USER_UNLOAD:
            return unload(state, action as actions.Unload)
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