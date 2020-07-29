import { Action } from 'redux';
import * as actions from '../actions/viewMembers';
import { StoreState } from '../store/types';
import { ActionFlag } from '../actions';
import { AsyncModelState, MemberType } from '../store/types/common';
import { ViewMembersViewModel } from '../store/types/views/Main/views/ViewMembers';

export function loadStart(state: ViewMembersViewModel, action: actions.LoadStart): ViewMembersViewModel {
    return {
        loadingState: AsyncModelState.LOADING
    };
}

export function unload(state: ViewMembersViewModel, action: actions.Unload): ViewMembersViewModel {
    return {
        loadingState: AsyncModelState.NONE
    };
}

export function loadSuccess(state: ViewMembersViewModel, action: actions.LoadSuccess): ViewMembersViewModel {
    return {
        loadingState: AsyncModelState.SUCCESS,
        value: {
            organization: action.organization,
            relation: action.relation
        }
    };

}

export function loadError(state: ViewMembersViewModel, action: actions.LoadError): ViewMembersViewModel {
    return {
        loadingState: AsyncModelState.ERROR,
        error: action.error
    };
}

export function promoteToAdminSuccess(state: ViewMembersViewModel, action: actions.PromoteToAdminSuccess): ViewMembersViewModel {
    if (state.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    const {
        value: {
            organization: {
                members
            }
        }
    } = state;

    // TODO: probably better is to have to have the action handler do a call to get the members
    // and to populate the orgs membership struct from that...
    const newMembers = members.map((member) => {
        if (member.username === action.memberUsername) {
            member.type = MemberType.ADMIN;
            return member;
        } else {
            return member;
        }
    });

    return {
        ...state,
        value: {
            ...state.value,
            organization: {
                ...state.value.organization,
                members: newMembers
            }
        }
    };
}

export function demoteToMemberSuccess(state: ViewMembersViewModel, action: actions.DemoteToMemberSuccess): ViewMembersViewModel {
    if (state.loadingState !== AsyncModelState.SUCCESS) {
        return state;
    }

    const {
        value: {
            organization: {
                members
            }
        }
    } = state;

    // TODO: probably better is to have to have the action handler do a call to get the members
    // and to populate the orgs membership struct from that...
    const newMembers = members.map((member) => {
        if (member.username === action.memberUsername) {
            member.type = MemberType.MEMBER;
            return member;
        } else {
            return member;
        }
    });

    return {
        ...state,
        value: {
            ...state.value,
            organization: {
                ...state.value.organization,
                members: newMembers
            }
        }
    };
}

function localReducer(state: ViewMembersViewModel, action: Action): ViewMembersViewModel | null {
    // NB using discriminant union nature of the ActionX types to narrow
    // the type.

    switch (action.type) {
        case ActionFlag.VIEW_MEMBERS_LOAD_START:
            return loadStart(state, action as actions.LoadStart);
        case ActionFlag.VIEW_MEMBERS_LOAD_SUCCESS:
            return loadSuccess(state, action as actions.LoadSuccess);
        case ActionFlag.VIEW_MEMBERS_LOAD_ERROR:
            return loadError(state, action as actions.LoadError);
        case ActionFlag.VIEW_MEMBERS_UNLOAD:
            return unload(state, action as actions.Unload);
        case ActionFlag.VIEW_MEMBERS_PROMOTE_TO_ADMIN_SUCCESS:
            return promoteToAdminSuccess(state, action as actions.PromoteToAdminSuccess);
        case ActionFlag.VIEW_MEMBERS_DEMOTE_TO_MEMBER_SUCCESS:
            return demoteToMemberSuccess(state, action as actions.DemoteToMemberSuccess);
        default:
            return null;
    }
}

export default function reducer(state: StoreState, action: Action<any>): StoreState | null {
    if (state.auth.userAuthorization === null) {
        return null;
    }

    if (state.view.loadingState !== AsyncModelState.SUCCESS) {
        return null;
    }

    // if (state.view.value.kind !== ViewKind.VIEW_MEMBERS) {
    //     return null;
    // }



    const model = localReducer(state.view.value.views.viewMembers, action);
    if (model) {
        return {
            ...state,
            view: {
                ...state.view,
                value: {
                    ...state.view.value,
                    views: {
                        ...state.view.value.views,
                        viewMembers: model
                    }
                }
            }
        };
    }
    return null;
}