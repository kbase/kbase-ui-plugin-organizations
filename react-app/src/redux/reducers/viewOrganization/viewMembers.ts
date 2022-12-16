import { Action } from 'redux';
import { ActionFlag } from '../../actions';
import * as actions from '../../actions/viewOrganization/viewMembers';
import { StoreState } from '../../store/types';
import { AsyncModelState, MemberType } from '../../store/types/common';
import { ViewOrgViewModelKind } from '../../store/types/views/Main/views/ViewOrg';

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
    if (state.view.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    // if (state.view.value.kind !== ViewKind.VIEW_ORG) {
    //     return state;
    // }

    if (state.view.value.views.viewOrg.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    if (state.view.value.views.viewOrg.value.kind !== ViewOrgViewModelKind.NORMAL) {
        return state;
    }

    const viewModel = state.view.value.views.viewOrg.value;

    // TODO: probably better is to have to have the action handler do a call to get the members
    // and to populate the orgs membership struct from that...
    const members = viewModel.organization.members.map((member) => {
        if (member.username === action.memberUsername) {
            return {
                ...member,
                type: MemberType.ADMIN
            };
        } else {
            return member;
        }
    });

    const sortedMembers = viewModel.members.map((member) => {
        if (member.username === action.memberUsername) {
            return {
                ...member,
                type: MemberType.ADMIN
            };
        } else {
            return member;
        }
    });

    return {
        ...state,
        view: {
            ...state.view,
            value: {
                ...state.view.value,
                views: {
                    ...state.view.value.views,
                    viewOrg: {
                        ...state.view.value.views.viewOrg,
                        value: {
                            ...state.view.value.views.viewOrg.value,
                            organization: {
                                ...state.view.value.views.viewOrg.value.organization,
                                members: members
                            },
                            members: sortedMembers
                        }

                    }
                }
            }
        }
    };
}

export function demoteToMemberSuccess(state: StoreState, action: actions.DemoteToMemberSuccess): StoreState {
    if (state.view.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    // if (state.view.value.kind !== ViewKind.VIEW_ORG) {
    //     return state;
    // }

    if (state.view.value.views.viewOrg.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    if (state.view.value.views.viewOrg.value.kind !== ViewOrgViewModelKind.NORMAL) {
        return state;
    }

    const viewModel = state.view.value.views.viewOrg.value;

    // TODO: probably better is to have to have the action handler do a call to get the members
    // and to populate the orgs membership struct from that...
    const members = viewModel.organization.members.map((member) => {
        if (member.username === action.memberUsername) {
            return {
                ...member,
                type: MemberType.MEMBER
            };
        } else {
            return member;
        }
    });

    const sortedMembers = viewModel.members.map((member) => {
        if (member.username === action.memberUsername) {
            return {
                ...member,
                type: MemberType.MEMBER
            };
        } else {
            return member;
        }
    });

    return {
        ...state,
        view: {
            ...state.view,
            value: {
                ...state.view.value,
                views: {
                    ...state.view.value.views,
                    viewOrg: {
                        ...state.view.value.views.viewOrg,
                        value: {
                            ...state.view.value.views.viewOrg.value,
                            organization: {
                                ...state.view.value.views.viewOrg.value.organization,
                                members: members
                            },
                            members: sortedMembers
                        }

                    }
                }
            }
        }
    };
}


export function removeMemberSuccess(state: StoreState, action: actions.RemoveMemberSuccess): StoreState {
    if (state.view.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    // if (state.view.value.kind !== ViewKind.VIEW_ORG) {
    //     return state;
    // }

    if (state.view.value.views.viewOrg.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    if (state.view.value.views.viewOrg.value.kind !== ViewOrgViewModelKind.NORMAL) {
        return state;
    }

    const viewModel = state.view.value.views.viewOrg.value;

    // TODO: probably better is to have to have the action handler do a call to get the members
    // and to populate the orgs membership struct from that...
    const members = viewModel.organization.members.filter((member) => {
        return (member.username !== action.memberUsername);
    });

    const sortedMembers = viewModel.members.filter((member) => {
        return (member.username !== action.memberUsername);
    });

    return {
        ...state,
        view: {
            ...state.view,
            value: {
                ...state.view.value,
                views: {
                    ...state.view.value.views,
                    viewOrg: {
                        ...state.view.value.views.viewOrg,
                        value: {
                            ...state.view.value.views.viewOrg.value,
                            organization: {
                                ...state.view.value.views.viewOrg.value.organization,
                                members: members
                            },
                            members: sortedMembers
                        }

                    }
                }
            }
        }
    };
}


export function sortMembersSuccess(state: StoreState, action: actions.SortMembersSuccess): StoreState {
    if (state.view.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    // if (state.view.value.kind !== ViewKind.VIEW_ORG) {
    //     return state;
    // }

    if (state.view.value.views.viewOrg.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    if (state.view.value.views.viewOrg.value.kind !== ViewOrgViewModelKind.NORMAL) {
        return state;
    }

    return {
        ...state,
        view: {
            ...state.view,
            value: {
                ...state.view.value,
                views: {
                    ...state.view.value.views,
                    viewOrg: {
                        ...state.view.value.views.viewOrg,
                        value: {
                            ...state.view.value.views.viewOrg.value,
                            sortMembersBy: action.sortBy,
                            members: action.members
                        }

                    }
                }
            }
        }
    };
};

export function searchMembersSuccess(state: StoreState, action: actions.SearchMembersSuccess): StoreState {
    if (state.view.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    // if (state.view.value.kind !== ViewKind.VIEW_ORG) {
    //     return state;
    // }

    if (state.view.value.views.viewOrg.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    if (state.view.value.views.viewOrg.value.kind !== ViewOrgViewModelKind.NORMAL) {
        return state;
    }

    return {
        ...state,
        view: {
            ...state.view,
            value: {
                ...state.view.value,
                views: {
                    ...state.view.value.views,
                    viewOrg: {
                        ...state.view.value.views.viewOrg,
                        value: {
                            ...state.view.value.views.viewOrg.value,
                            searchMembersBy: action.searchBy,
                            members: action.members
                        }
                    }

                }
            }
        }
    };
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
            return promoteToAdminSuccess(state, action as actions.PromoteToAdminSuccess);
        case ActionFlag.VIEW_ORG_VIEW_MEMBERS_DEMOTE_TO_MEMBER_SUCCESS:
            return demoteToMemberSuccess(state, action as actions.DemoteToMemberSuccess);
        case ActionFlag.VIEW_ORG_VIEW_MEMBERS_REMOVE_MEMBER_SUCCESS:
            return removeMemberSuccess(state, action as actions.RemoveMemberSuccess);
        case ActionFlag.VIEW_ORG_SORT_MEMBERS_SUCCESS:
            return sortMembersSuccess(state, action as actions.SortMembersSuccess);
        case ActionFlag.VIEW_ORG_SEARCH_MEMBERS_SUCCESS:
            return searchMembersSuccess(state, action as actions.SearchMembersSuccess);
        default:
            return null;
    }
}

export default reducer;