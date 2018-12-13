import { Action } from 'redux'
import * as actions from '../actions/viewMembers'
import { StoreState, ComponentLoadingState, MemberType } from '../../types'
import { ActionFlag } from '../actions'

export function loadStart(state: StoreState, action: actions.LoadStart) {
    return {
        ...state,
        views: {
            ...state.views,
            viewMembersView: {
                ...state.views.viewMembersView,
                loadingState: ComponentLoadingState.LOADING,
                viewModel: null,
                error: null
            }
        }
    }
}

export function unload(state: StoreState, action: actions.Unload): StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            viewMembersView: {
                ...state.views.viewMembersView,
                loadingState: ComponentLoadingState.NONE,
                viewModel: null,
                error: null
            }
        }
    }
}

export function loadSuccess(state: StoreState, action: actions.LoadSuccess): StoreState {
    console.log('load success ...', action)
    return {
        ...state,
        views: {
            ...state.views,
            viewMembersView: {
                ...state.views.viewMembersView,
                loadingState: ComponentLoadingState.SUCCESS,
                viewModel: {
                    organization: action.organization,
                    relation: action.relation
                },
                error: null
            }
        }
    }
}

export function loadError(state: StoreState, action: actions.LoadError): StoreState {
    return {
        ...state,
        views: {
            ...state.views,
            viewMembersView: {
                ...state.views.viewMembersView,
                loadingState: ComponentLoadingState.ERROR,
                viewModel: null,
                error: action.error
            }
        }
    }
}

export function promoteToAdminSuccess(state: StoreState, action: actions.PromoteToAdminSuccess): StoreState {
    if (state.views.viewMembersView.viewModel === null) {
        return state
    }

    const {
        views: { viewMembersView: { viewModel } }
    } = state

    // TODO: probably better is to have to have the action handler do a call to get the members
    // and to populate the orgs membership struct from that...
    const members = viewModel.organization.members.map((member) => {
        if (member.username === action.memberUsername) {
            member.type = MemberType.ADMIN
            return member
        } else {
            return member
        }
    })

    return {
        ...state,
        views: {
            ...state.views,
            viewMembersView: {
                ...state.views.viewMembersView,
                viewModel: {
                    ...state.views.viewMembersView.viewModel,
                    organization: {
                        ...state.views.viewMembersView.viewModel!.organization,
                        members: members
                    }
                }
            }
        }
    }
}

export function demoteToMemberSuccess(state: StoreState, action: actions.DemoteToMemberSuccess): StoreState {
    if (state.views.viewMembersView.viewModel === null) {
        return state
    }

    const {
        views: { viewMembersView: { viewModel } }
    } = state

    // TODO: probably better is to have to have the action handler do a call to get the members
    // and to populate the orgs membership struct from that...
    const members = viewModel.organization.members.map((member) => {
        if (member.username === action.memberUsername) {
            member.type = MemberType.MEMBER
            return member
        } else {
            return member
        }
    })

    return {
        ...state,
        views: {
            ...state.views,
            viewMembersView: {
                ...state.views.viewMembersView,
                viewModel: {
                    ...state.views.viewMembersView.viewModel,
                    organization: {
                        ...state.views.viewMembersView.viewModel!.organization,
                        members: members
                    }
                }
            }
        }
    }
}

function reducer(state: StoreState, action: Action): StoreState | null {
    // NB using discriminant union nature of the ActionX types to narrow
    // the type.

    switch (action.type) {
        case ActionFlag.VIEW_MEMBERS_LOAD_START:
            return loadStart(state, action as actions.LoadStart)
        case ActionFlag.VIEW_MEMBERS_LOAD_SUCCESS:
            return loadSuccess(state, action as actions.LoadSuccess)
        case ActionFlag.VIEW_MEMBERS_LOAD_ERROR:
            return loadError(state, action as actions.LoadError)
        case ActionFlag.VIEW_MEMBERS_UNLOAD:
            return unload(state, action as actions.Unload)
        case ActionFlag.VIEW_MEMBERS_PROMOTE_TO_ADMIN_SUCCESS:
            return promoteToAdminSuccess(state, action as actions.PromoteToAdminSuccess)
        case ActionFlag.VIEW_MEMBERS_DEMOTE_TO_MEMBER_SUCCESS:
            return demoteToMemberSuccess(state, action as actions.DemoteToMemberSuccess)
        default:
            return null
    }
}

export default reducer