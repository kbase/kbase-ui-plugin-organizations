import { Action } from 'redux'
import * as actions from '../../actions/viewOrganization/inviteUser'
import {
    StoreState, InviteUserViewModel, ViewState,
    View, InviteUserViewState
} from '../../../types'
import { ActionFlag } from '../../actions'
import * as orgModel from '../../../data/models/organization/model'
import { ViewOrgViewModelKind } from '../../../types';

export function loadStart(state: View<InviteUserViewModel>, action: actions.LoadStart): View<InviteUserViewModel> {
    return {
        state: ViewState.LOADING,
        viewModel: null,
        error: null
    }
}

export function loadSuccess(state: View<InviteUserViewModel>, action: actions.LoadSuccess): View<InviteUserViewModel> {
    return {
        state: ViewState.OK,
        error: null,
        viewModel: {
            editState: InviteUserViewState.EDITING,
            users: action.users,
            organization: action.organization,
            selectedUser: null
        }
    }
}

export function loadError(state: View<InviteUserViewModel>, action: actions.LoadError): View<InviteUserViewModel> {
    return {
        state: ViewState.ERROR,
        error: action.error,
        viewModel: null
    }
}

export function unload(state: View<InviteUserViewModel>, action: actions.Unload): View<InviteUserViewModel> {
    return {

        state: ViewState.NONE,
        error: null,
        viewModel: null
    }
}

export function searchUsersSuccess(state: View<InviteUserViewModel>, action: actions.SearchUsersSuccess): View<InviteUserViewModel> {
    // TODO: better guards!
    if (state.viewModel === null) {
        return state
    }
    return {
        ...state,
        viewModel: {
            ...state.viewModel,
            users: action.users
        }
    }
}

export function selectUserSuccess(state: View<InviteUserViewModel>, action: actions.SelectUserSuccess): View<InviteUserViewModel> {
    if (state.viewModel === null) {
        return state
    }
    return {
        ...state,
        viewModel: {
            ...state.viewModel,
            selectedUser: {
                user: action.user,
                relation: action.relation
            }
        }
    }
}

export function sendInvitationStart(state: View<InviteUserViewModel>, action: actions.SendInvitationStart): View<InviteUserViewModel> {
    if (state.viewModel === null) {
        return state
    }
    return {
        ...state,
        viewModel: {
            ...state.viewModel,
            editState: InviteUserViewState.SENDING
        }
    }
}

export function sendInvitationSuccess(state: View<InviteUserViewModel>, action: actions.SendInvitationSuccess): View<InviteUserViewModel> {
    if (state.viewModel === null) {
        return state
    }

    const { viewModel: { selectedUser, users } } = state

    // const selectedUser = state.inviteUserView.value.selectedUser
    if (!selectedUser) {
        throw new Error('selected user is null')
    }
    selectedUser.relation = orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING

    if (!users) {
        throw new Error('users is null')
    }
    const newUsers = users.map((user) => {
        if (user.username === selectedUser.user.username) {
            user.relation = orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING
        }
        return user
    })

    return {
        ...state,

        viewModel: {
            ...state.viewModel,
            editState: InviteUserViewState.SUCCESS,
            selectedUser: selectedUser,
            users: newUsers
        }
    }
}

export function sendInvitationError(state: View<InviteUserViewModel>, action: actions.SendInvitationError): View<InviteUserViewModel> {
    if (state.viewModel === null) {
        return state
    }
    return {
        ...state,
        viewModel: {
            ...state.viewModel,
            editState: InviteUserViewState.ERROR
        }
    }
}

function localReducer(state: View<InviteUserViewModel>, action: Action): View<InviteUserViewModel> | null {
    switch (action.type) {
        case ActionFlag.INVITE_USER_LOAD_START:
            return loadStart(state, action as actions.LoadStart)
        case ActionFlag.INVITE_USER_LOAD_SUCCESS:
            return loadSuccess(state, action as actions.LoadSuccess)
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

function haveReducer(action: Action): boolean {
    switch (action.type) {
        case ActionFlag.INVITE_USER_LOAD_START:
        case ActionFlag.INVITE_USER_LOAD_SUCCESS:
        case ActionFlag.INVITE_USER_LOAD_ERROR:
        case ActionFlag.INVITE_USER_UNLOAD:
        case ActionFlag.INVITE_USER_SEARCH_USERS_SUCCESS:
        case ActionFlag.INVITE_USER_SELECT_USER_SUCCESS:
        case ActionFlag.INVITE_USER_SEND_INVITATION_START:
        case ActionFlag.INVITE_USER_SEND_INVITATION_SUCCESS:
        case ActionFlag.INVITE_USER_SEND_INVITATION_ERROR:
            return true
        default:
            return false
    }
}

function reducer(state: StoreState, action: Action): StoreState | null {
    if (!haveReducer(action)) {
        return null
    }
    if (!state.views.viewOrgView.viewModel) {
        return state
    }
    if (state.views.viewOrgView.viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
        return state
    }
    const viewState: View<InviteUserViewModel> = state.views.viewOrgView.viewModel.subViews.inviteUserView
    const newViewState = localReducer(viewState, action)
    if (newViewState === null) {
        return null
    }
    return {
        ...state,
        views: {
            ...state.views,
            viewOrgView: {
                ...state.views.viewOrgView,
                viewModel: {
                    ...state.views.viewOrgView.viewModel,
                    subViews: {
                        ...state.views.viewOrgView.viewModel.subViews,
                        inviteUserView: newViewState
                    }
                }
            }
        }
    }
}

export default reducer