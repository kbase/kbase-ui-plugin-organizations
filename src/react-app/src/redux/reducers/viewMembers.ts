import { Action } from 'redux'
import * as actions from '../actions/viewMembers'
import * as types from '../../types'
import { ActionFlag } from '../actions'

export function viewMembersLoadStart(state: types.StoreState, action: actions.ViewMembersLoadStart) {
    return {
        ...state,
        viewMembersView: {
            ...state.viewMembersView,
            state: types.ViewMembersViewState.LOADING,
            view: null,
            error: null
        }
    }
}

export function viewMembersUnload(state: types.StoreState, action: actions.ViewMembersUnload) {
    return {
        ...state,
        viewMembersView: {
            ...state.viewMembersView,
            state: types.ViewMembersViewState.NONE,
            view: null,
            error: null
        }
    }
}

export function viewMembersLoadSuccess(state: types.StoreState, action: actions.ViewMembersLoadSuccess) {
    return {
        ...state,
        viewMembersView: {
            ...state.viewMembersView,
            state: types.ViewMembersViewState.SUCCESS,
            view: {
                organization: action.organization
            },
            error: null
        }
    }
}

export function viewMembersLoadError(state: types.StoreState, action: actions.ViewMembersLoadError) {
    return {
        ...state,
        viewMembersView: {
            ...state.viewMembersView,
            state: types.ViewMembersViewState.ERROR,
            view: null,
            error: action.error
        }
    }
}

export function viewMembersPromoteToAdminSuccess(state: types.StoreState, action: actions.ViewMembersPromoteToAdminSuccess): types.StoreState {

    if (state.viewMembersView.view === null) {
        return state
    }

    // TODO: probably better is to have to have the action handler do a call to get the members
    // and to populate the orgs membership struct from that...
    const members = state.viewMembersView.view.organization.members.map((member) => {
        if (member.user.username === action.memberUsername) {
            member.type = types.MemberType.ADMIN
            return member
        } else {
            return member
        }
    })

    const newState = { ...state }
    newState.viewMembersView.view!.organization.members = members
    return newState
}

export function viewMembersDemoteToMemberSuccess(state: types.StoreState, action: actions.ViewMembersDemoteToMemberSuccess): types.StoreState {

    if (state.viewMembersView.view === null) {
        return state
    }

    // TODO: probably better is to have to have the action handler do a call to get the members
    // and to populate the orgs membership struct from that...
    const members = state.viewMembersView.view.organization.members.map((member) => {
        if (member.user.username === action.memberUsername) {
            member.type = types.MemberType.MEMBER
            return member
        } else {
            return member
        }
    })

    const newState = { ...state }
    newState.viewMembersView.view!.organization.members = members
    return newState
}

function reducer(state: types.StoreState, action: Action): types.StoreState | null {
    // NB using discriminant union nature of the ActionX types to narrow
    // the type.

    switch (action.type) {
        case ActionFlag.VIEW_MEMBERS_LOAD_START:
            return viewMembersLoadStart(state, action as actions.ViewMembersLoadStart)
        case ActionFlag.VIEW_MEMBERS_LOAD_SUCCESS:
            return viewMembersLoadSuccess(state, action as actions.ViewMembersLoadSuccess)
        case ActionFlag.VIEW_MEMBERS_LOAD_ERROR:
            return viewMembersLoadError(state, action as actions.ViewMembersLoadError)
        case ActionFlag.VIEW_MEMBERS_UNLOAD:
            return viewMembersUnload(state, action as actions.ViewMembersUnload)
        case ActionFlag.VIEW_MEMBERS_PROMOTE_TO_ADMIN_SUCCESS:
            return viewMembersPromoteToAdminSuccess(state, action as actions.ViewMembersPromoteToAdminSuccess)
        case ActionFlag.VIEW_MEMBERS_DEMOTE_TO_MEMBER_SUCCESS:
            return viewMembersDemoteToMemberSuccess(state, action as actions.ViewMembersDemoteToMemberSuccess)
        default:
            return null
    }
}

export default reducer