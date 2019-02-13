import { Action } from 'redux'
import * as actions from '../../actions/viewOrganization/viewMembers'
import { StoreState, ComponentLoadingState, MemberType, ViewOrgViewModelKind } from '../../../types'
import { ActionFlag } from '../../actions'

// export function loadStart(state: StoreState, action: actions.LoadStart) {
//     return {
//         ...state,
//         views: {
//             ...state.views,
//             viewMembersView: {
//                 ...state.views.viewMembersView,
//                 loadingState: ComponentLoadingState.LOADING,
//                 viewModel: null,
//                 error: null
//             }
//         }
//     }
// }

// export function unload(state: StoreState, action: actions.Unload): StoreState {
//     return {
//         ...state,
//         views: {
//             ...state.views,
//             viewMembersView: {
//                 ...state.views.viewMembersView,
//                 loadingState: ComponentLoadingState.NONE,
//                 viewModel: null,
//                 error: null
//             }
//         }
//     }
// }

// export function loadSuccess(state: StoreState, action: actions.LoadSuccess): StoreState {
//     return {
//         ...state,
//         views: {
//             ...state.views,
//             viewMembersView: {
//                 ...state.views.viewMembersView,
//                 loadingState: ComponentLoadingState.SUCCESS,
//                 viewModel: {
//                     organization: action.organization,
//                     relation: action.relation
//                 },
//                 error: null
//             }
//         }
//     }
// }

// export function loadError(state: StoreState, action: actions.LoadError): StoreState {
//     return {
//         ...state,
//         views: {
//             ...state.views,
//             viewMembersView: {
//                 ...state.views.viewMembersView,
//                 loadingState: ComponentLoadingState.ERROR,
//                 viewModel: null,
//                 error: action.error
//             }
//         }
//     }
// }

export function promoteToAdminSuccess(state: StoreState, action: actions.PromoteToAdminSuccess): StoreState {

    const {
        views: { viewOrgView: { viewModel } }
    } = state

    if (viewModel === null) {
        return state
    }

    // TODO: ugh, cut this off before getting here.
    if (viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
        return state
    }

    // TODO: probably better is to have to have the action handler do a call to get the members
    // and to populate the orgs membership struct from that...
    const members = viewModel.organization.members.map((member) => {

        if (member.username === action.memberUsername) {
            return {
                ...member,
                type: MemberType.ADMIN
            }
        } else {
            return member
        }
    })

    return {
        ...state,
        views: {
            ...state.views,
            viewOrgView: {
                ...state.views.viewOrgView,
                viewModel: {
                    ...viewModel,
                    organization: {
                        ...viewModel.organization,
                        members: members
                    }
                }
            }
        }
    }
}

export function demoteToMemberSuccess(state: StoreState, action: actions.DemoteToMemberSuccess): StoreState {
    const {
        views: { viewOrgView: { viewModel } }
    } = state

    if (viewModel === null) {
        return state
    }

    // TODO: ugh, cut this off before getting here.
    if (viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
        return state
    }

    // TODO: probably better is to have to have the action handler do a call to get the members
    // and to populate the orgs membership struct from that...
    const members = viewModel.organization.members.map((member) => {
        if (member.username === action.memberUsername) {
            return {
                ...member,
                type: MemberType.MEMBER
            }
        } else {
            return member
        }
    })

    return {
        ...state,
        views: {
            ...state.views,
            viewOrgView: {
                ...state.views.viewOrgView,
                viewModel: {
                    ...viewModel,
                    organization: {
                        ...viewModel.organization,
                        members: members
                    }
                }
            }
        }
    }
}


export function removeMemberSuccess(state: StoreState, action: actions.RemoveMemberSuccess): StoreState {
    const {
        views: { viewOrgView: { viewModel } }
    } = state

    if (viewModel === null) {
        return state
    }

    // TODO: ugh, cut this off before getting here.
    if (viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
        return state
    }

    // TODO: probably better is to have to have the action handler do a call to get the members
    // and to populate the orgs membership struct from that...
    const members = viewModel.organization.members.filter((member) => {
        return (member.username !== action.memberUsername)
    })

    const sortedMembers = viewModel.members.filter((member) => {
        return (member.username !== action.memberUsername)
    })

    console.log('members?', members)

    return {
        ...state,
        views: {
            ...state.views,
            viewOrgView: {
                ...state.views.viewOrgView,
                viewModel: {
                    ...viewModel,
                    organization: {
                        ...viewModel.organization,
                        members: members
                    },
                    members: sortedMembers
                }
            }
        }
    }
}


export function sortMembersSuccess(state: StoreState, action: actions.SortMembersSuccess): StoreState {
    if (!state.views.viewOrgView.viewModel) {
        return state
    }
    if (state.views.viewOrgView.viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            ...state.views,
            viewOrgView: {
                ...state.views.viewOrgView,
                viewModel: {
                    ...state.views.viewOrgView.viewModel,
                    sortMembersBy: action.sortBy,
                    members: action.members
                }
            }
        }
    }
}

export function searchMembersSuccess(state: StoreState, action: actions.SearchMembersSuccess): StoreState {
    if (!state.views.viewOrgView.viewModel) {
        return state
    }
    if (state.views.viewOrgView.viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
        return state
    }
    return {
        ...state,
        views: {
            ...state.views,
            ...state.views,
            viewOrgView: {
                ...state.views.viewOrgView,
                viewModel: {
                    ...state.views.viewOrgView.viewModel,
                    searchMembersBy: action.searchBy,
                    members: action.members
                }
            }
        }
    }
}

function reducer(state: StoreState, action: Action): StoreState | null {
    // NB using discriminant union nature of the ActionX types to narrow
    // the type.

    switch (action.type) {
        // case ActionFlag.VIEW_MEMBERS_LOAD_START:
        //     return loadStart(state, action as actions.LoadStart)
        // case ActionFlag.VIEW_MEMBERS_LOAD_SUCCESS:
        //     return loadSuccess(state, action as actions.LoadSuccess)
        // case ActionFlag.VIEW_MEMBERS_LOAD_ERROR:
        //     return loadError(state, action as actions.LoadError)
        // case ActionFlag.VIEW_MEMBERS_UNLOAD:
        //     return unload(state, action as actions.Unload)
        case ActionFlag.VIEW_ORG_VIEW_MEMBERS_PROMOTE_TO_ADMIN_SUCCESS:
            return promoteToAdminSuccess(state, action as actions.PromoteToAdminSuccess)
        case ActionFlag.VIEW_ORG_VIEW_MEMBERS_DEMOTE_TO_MEMBER_SUCCESS:
            return demoteToMemberSuccess(state, action as actions.DemoteToMemberSuccess)
        case ActionFlag.VIEW_ORG_VIEW_MEMBERS_REMOVE_MEMBER_SUCCESS:
            return removeMemberSuccess(state, action as actions.RemoveMemberSuccess)
        case ActionFlag.VIEW_ORG_SORT_MEMBERS_SUCCESS:
            return sortMembersSuccess(state, action as actions.SortMembersSuccess)
        case ActionFlag.VIEW_ORG_SEARCH_MEMBERS_SUCCESS:
            return searchMembersSuccess(state, action as actions.SearchMembersSuccess)
        default:
            return null
    }
}

export default reducer